package com.white.engine.cores.gl

/**
 * CanvasSurfaces — CPU 位图画布注册表 (v4.5.1)
 *
 * 背景: white-engine 立绘管线 = canvas 2d 裁剪部件 → getImageData 提取 alpha →
 *       canvas 作源 texImage2D 上传。原 2D 垫片无像素缓冲 (getImageData 全零 → 部件全隐身)。
 * 方案: 2D 画布落到 Android Bitmap (真栅格化), JS 经桥读写; 上传纹理时直接用位图。
 * 线程: v4.8.0 起调用方为 QuickJS 逻辑线程 (写), GL 线程合成层读取 (读) —
 *       Bitmap 非线程安全 → 全部读写走粗粒度 lock 互斥 (白描: 位图操作毫秒级, 锁开销可忽略)。
 */
object CanvasSurfaces {

    /** 全局互斥锁 — 所有位图写操作与像素读操作共用 */
    val lock = Any()

    /** 供 GL 线程读像素路径 (如 loadTextureSync 上传) 包裹互斥 */
    inline fun <T> locked(block: () -> T): T = synchronized(lock) { block() }

    private val bitmaps = java.util.concurrent.ConcurrentHashMap<Int, android.graphics.Bitmap>()
    private val canvases = java.util.concurrent.ConcurrentHashMap<Int, android.graphics.Canvas>()
    private val versions = java.util.concurrent.ConcurrentHashMap<Int, Int>()   // v4.6.0: 写代数 (屏幕层缓存失效)
    private val paint = android.graphics.Paint()
    private val counter = java.util.concurrent.atomic.AtomicInteger(1)

    /** v4.6.0: 画布写代数 — 每次内容变更 +1 (屏幕合成层据此重上传纹理) */
    fun version(id: Int): Int = versions[id] ?: 0
    private fun bump(id: Int) { versions[id] = (versions[id] ?: 0) + 1 }

    /** 创建画布 (ARGB_8888), 返回句柄; 0 = 失败 */
    fun create(w: Int, h: Int): Int {
        val ww = w.coerceIn(1, 4096); val hh = h.coerceIn(1, 4096)
        return try {
            val bmp = android.graphics.Bitmap.createBitmap(ww, hh, android.graphics.Bitmap.Config.ARGB_8888)
            val id = counter.getAndIncrement()
            bitmaps[id] = bmp
            canvases[id] = android.graphics.Canvas(bmp)
            id
        } catch (e: Throwable) { 0 }
    }

    fun resize(id: Int, w: Int, h: Int): Boolean = synchronized(lock) {
        val c = canvases[id] ?: return false
        val ww = w.coerceIn(1, 4096); val hh = h.coerceIn(1, 4096)
        if (c.width == ww && c.height == hh) return true
        return try {
            val bmp = android.graphics.Bitmap.createBitmap(ww, hh, android.graphics.Bitmap.Config.ARGB_8888)
            bitmaps[id] = bmp; canvases[id] = android.graphics.Canvas(bmp)
            bump(id); true
        } catch (e: Throwable) { false }
    }

    fun bitmap(id: Int): android.graphics.Bitmap? = bitmaps[id]

    /** drawImage: 源位图子矩形 → 目标矩形 (含缩放), alpha 0..1 */
    fun drawTex(id: Int, src: android.graphics.Bitmap, sx: Int, sy: Int, sw: Int, sh: Int, dx: Float, dy: Float, dw: Float, dh: Float, alpha: Float): Boolean = synchronized(lock) {
        val c = canvases[id] ?: return false
        if (sw <= 0 || sh <= 0 || dw <= 0f || dh <= 0f) return false
        val cx = sx.coerceIn(0, src.width); val cy = sy.coerceIn(0, src.height)
        val cw = sw.coerceAtMost(src.width - cx); val ch = sh.coerceAtMost(src.height - cy)
        if (cw <= 0 || ch <= 0) return false
        paint.alpha = (alpha.coerceIn(0f, 1f) * 255).toInt()
        paint.isFilterBitmap = true
        c.drawBitmap(src, android.graphics.Rect(cx, cy, cx + cw, cy + ch),
            android.graphics.RectF(dx, dy, dx + dw, dy + dh), paint)
        bump(id); return true
    }

    fun fillRect(id: Int, x: Float, y: Float, w: Float, h: Float, r: Float, g: Float, b: Float, a: Float): Boolean = synchronized(lock) {
        val c = canvases[id] ?: return false
        paint.color = android.graphics.Color.argb(
            (a.coerceIn(0f, 1f) * 255).toInt(),
            (r.coerceIn(0f, 1f) * 255).toInt(),
            (g.coerceIn(0f, 1f) * 255).toInt(),
            (b.coerceIn(0f, 1f) * 255).toInt())
        c.drawRect(x, y, x + w, y + h, paint)
        bump(id); return true
    }

    fun clearRect(id: Int, x: Float, y: Float, w: Float, h: Float): Boolean = synchronized(lock) {
        val c = canvases[id] ?: return false
        paint.xfermode = android.graphics.PorterDuffXfermode(android.graphics.PorterDuff.Mode.CLEAR)
        c.drawRect(x, y, x + w, y + h, paint)
        paint.xfermode = null
        bump(id); return true
    }

    /** 全画布像素 → RGBA bytes → Base64 (getImageData 用, 非预乘) */
    fun pixelsB64(id: Int): String = synchronized(lock) {
        val bmp = bitmaps[id] ?: return ""
        encodeRegion(bmp, 0, 0, bmp.width, bmp.height)
    }

    /**
     * v4.5.5 压缩回传: 全画布 RGBA → Deflate(zlib) → Base64。
     * 立绘大片透明区 (RGBA 全零) 压缩比 ~99%: 16.4MB → 48KB, 跨桥从 5.6s → 0.3s 级。
     * JS 端 shim puffZ 解压, 失败自动回退 pixelsB64 明文通道。
     * v4.6.1: level 6→1 (4.6.0 日志实测 JS 侧 2259ms, 大头是 Java 端压缩耗时; level 1 对
     * 透明立绘压缩比仍 <10%, 速度 ~3 倍) + 分段耗时打点定位残余瓶颈。
     */
    fun pixelsB64Z(id: Int): String = synchronized(lock) {
        val bmp = bitmaps[id] ?: return ""
        try {
            val t0 = android.os.SystemClock.elapsedRealtime()
            val n = bmp.width * bmp.height
            val px = IntArray(n)
            bmp.getPixels(px, 0, bmp.width, 0, 0, bmp.width, bmp.height)
            val raw = ByteArray(n * 4)
            for (i in 0 until n) {
                val p = px[i]
                raw[4 * i] = ((p shr 16) and 0xFF).toByte()
                raw[4 * i + 1] = ((p shr 8) and 0xFF).toByte()
                raw[4 * i + 2] = (p and 0xFF).toByte()
                raw[4 * i + 3] = ((p shr 24) and 0xFF).toByte()
            }
            val t1 = android.os.SystemClock.elapsedRealtime()
            val defl = java.util.zip.Deflater(1, false)   // v4.6.1: BEST_SPEED — zlib 包装 (带 CMF/FLG + Adler32)
            defl.setInput(raw)
            defl.finish()
            val baos = java.io.ByteArrayOutputStream(raw.size / 8 + 64)
            val chunk = ByteArray(65536)
            while (!defl.finished()) {
                val got = defl.deflate(chunk)
                baos.write(chunk, 0, got)
            }
            defl.end()
            val z = baos.toByteArray()
            val t2 = android.os.SystemClock.elapsedRealtime()
            val out = android.util.Base64.encodeToString(z, android.util.Base64.NO_WRAP)
            if (n >= 300000)   // 只给大图打点, 防刷屏
                com.white.engine.core.FileLogger.w("CanvasSurf", "[perf] pixelsB64Z ${bmp.width}x${bmp.height}: 取像素 ${t1 - t0}ms + 压缩 ${t2 - t1}ms (${z.size shr 10}KB) + b64 ${android.os.SystemClock.elapsedRealtime() - t2}ms")
            out
        } catch (e: Throwable) { "" }
    }

    /**
     * v4.5.3 子区域像素 → RGBA → Base64。
     * 部件裁剪热路径: 原实现每次 getImageData 都整画布回传 (4096² 立绘 = 64MB RGBA → 85MB Base64
     * 跨 JNI+QuickJS 双拷贝 = 每部件 ~8s); 区域化后单次只传部件自身的小矩形。
     */
    fun regionB64(id: Int, x: Int, y: Int, w: Int, h: Int): String = synchronized(lock) {
        val bmp = bitmaps[id] ?: return ""
        if (w <= 0 || h <= 0 || bmp.width <= 0 || bmp.height <= 0) return ""
        val cx = x.coerceIn(0, bmp.width - 1); val cy = y.coerceIn(0, bmp.height - 1)
        val cw = w.coerceAtMost(bmp.width - cx); val ch = h.coerceAtMost(bmp.height - cy)
        if (cw <= 0 || ch <= 0) return ""
        try { encodeRegion(bmp, cx, cy, cw, ch) } catch (e: Throwable) { "" }
    }

    private fun encodeRegion(bmp: android.graphics.Bitmap, x: Int, y: Int, w: Int, h: Int): String {
        val n = w * h
        val px = IntArray(n)
        bmp.getPixels(px, 0, w, x, y, w, h)
        val out = ByteArray(n * 4)
        for (i in 0 until n) {
            val p = px[i]
            out[4 * i] = ((p shr 16) and 0xFF).toByte()     // R
            out[4 * i + 1] = ((p shr 8) and 0xFF).toByte()  // G
            out[4 * i + 2] = (p and 0xFF).toByte()          // B
            out[4 * i + 3] = ((p shr 24) and 0xFF).toByte() // A
        }
        return android.util.Base64.encodeToString(out, android.util.Base64.NO_WRAP)
    }

    /** putImageData: RGBA bytes → 画布 (引擎填充遮罩管线) */
    fun putImage(id: Int, rgba: ByteArray, dx: Int, dy: Int, w: Int, h: Int): Boolean = synchronized(lock) {
        val c = canvases[id] ?: return false
        if (w <= 0 || h <= 0 || rgba.size < w * h * 4) return false
        try {
            val px = IntArray(w * h)
            for (i in px.indices) {
                val o = 4 * i
                px[i] = android.graphics.Color.argb(
                    (rgba[o + 3].toInt() and 0xFF),
                    (rgba[o].toInt() and 0xFF),
                    (rgba[o + 1].toInt() and 0xFF),
                    (rgba[o + 2].toInt() and 0xFF))
            }
            val bmp = android.graphics.Bitmap.createBitmap(px, w, h, android.graphics.Bitmap.Config.ARGB_8888)
            c.drawBitmap(bmp, dx.toFloat(), dy.toFloat(), null)
            bump(id); true
        } catch (e: Throwable) { false }
    }

    fun destroy(id: Int) { synchronized(lock) { bitmaps.remove(id); canvases.remove(id) } }
}
