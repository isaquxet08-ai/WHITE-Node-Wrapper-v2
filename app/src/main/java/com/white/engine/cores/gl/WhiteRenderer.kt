package com.white.engine.cores.gl

import android.opengl.GLSurfaceView
import com.white.engine.core.WhiteEngine
import com.white.engine.core.FileLogger
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10

/**
 * WhiteRenderer — 后端无关渲染门面
 * 持有选中的 RenderBackend, 把引擎 tick 与视觉指令转发下去。
 * 后端切换 (GLES ↔ Vulkan) 对上层完全透明。
 */
class WhiteRenderer(private val engine: WhiteEngine) : GLSurfaceView.Renderer {

    var backend: RenderBackend = GlesBackend()
        private set

    var fps: Int = 0; private set
    @Volatile var surfaceWidth: Int = 1080; private set   // v0.3.0: 逻辑层查屏用
    @Volatile var surfaceHeight: Int = 2241; private set
    private var frameCount = 0
    private var fpsClock = 0f
    private var lastTs = System.nanoTime()

    // 模组 overlay 注册表 (ApiBridge.render 调用)
    private val overlays = mutableMapOf<String, Triple<String, Int, Float>>()   // id → (asset, z, alpha)

    // v4.6.0: 屏幕合成层 — shim 注册 (#static/#ov 2D 画布), tick 后按 lighten 语义叠到 GL 帧上
    val screenLayers = java.util.concurrent.ConcurrentHashMap<String, Int>()    // name → canvas cid
    private val layerCache = java.util.concurrent.ConcurrentHashMap<String, Pair<Int, Int>>()  // name → (ver, texId)

    /** v4.6.0: GL 线程 — 画布版本变化时重上传, 再 GL_MAX 全屏合成 */
    private fun drawScreenLayers() {
        val backend = backend as? GlesBackend ?: return
        for (name in listOf("static", "ov")) {
            val cid = screenLayers[name] ?: continue
            val bmp = com.white.engine.cores.gl.CanvasSurfaces.bitmap(cid) ?: continue
            val ver = com.white.engine.cores.gl.CanvasSurfaces.version(cid)
            var tex = layerCache[name]
            if (tex == null || tex.first != ver) {
                if (tex != null) backend.deleteBridgeTex(tex.second)
                // v4.8.0: 逻辑线程会并发重绘位图 — 上传读像素需与写互斥
                val newTex = com.white.engine.cores.gl.CanvasSurfaces.locked { backend.loadTextureSync(bmp) }
                tex = ver to newTex
                layerCache[name] = tex
            }
            backend.drawScreenLayerTex(tex.second)
        }
    }

    // v0.3.0: 渲染指令队列 — 逻辑线程的绘制请求排队到 GL 线程执行 (线程红线: 逻辑线程绝不碰 GL)
    private val renderQueue = java.util.concurrent.ConcurrentLinkedQueue<() -> Unit>()
    fun postRender(action: () -> Unit) = renderQueue.add(action)

    // v0.4.0 M3.2: GL 线程调度器 — QuickJS 逻辑层迁移到 GL 线程 (WebGL 桥同步查询的前提)
    var glView: GLSurfaceView? = null
    fun glRun(block: () -> Unit) {
        val v = glView
        if (v != null) v.queueEvent(block) else block()
    }

    override fun onSurfaceCreated(gl: GL10?, config: EGLConfig?) {
        // v0.1.3: 逐步探针 — native 崩溃抓不到堆栈, 靠"最后一句探针"定位死点
        FileLogger.w("Render", "GL线程: onSurfaceCreated 进入")
        val glVer = gl?.glGetString(GL10.GL_VERSION) ?: "?"
        // v0.1.4 保险: ES 1.x 上下文绝不调 GLES20 (会 SIGSEGV), 静默保命等崩溃报告
        if (glVer.contains("ES-CM") || glVer.contains("ES 1.")) {
            FileLogger.w("Render", "!! ES 1.x 上下文 ($glVer) — 不支持 ES2, 跳过 init 保命 (此设备无法运行引擎)")
            return
        }
        try {
            // v4.8.0: 遗迹清理 — VkBackend 占位后端移除, 仅 GLES 一条腿
            if (backend !is GlesBackend) backend = GlesBackend()
            FileLogger.w("Render", "探针1: backend.init 开始 (GL 版本 $glVer)")
            backend.init(null, 1, 1)
            FileLogger.w("Render", "探针2: backend.init 完成")
            engine.emit("render.ready", backend.name)
            FileLogger.w("Render", "渲染后端就绪: ${backend.name}")
            // v4.4.3: GL 上下文已就绪 — 触发延后的逻辑层 boot (shader 编译必须有当前 EGL 上下文)
            engine.logic.onGlContextReady()
        } catch (e: Throwable) {
            FileLogger.w("Render", "!! onSurfaceCreated 异常: ${e.javaClass.name}: ${e.message}")
            e.stackTrace.take(20).forEach { FileLogger.w("Render", "    at $it") }
            throw e
        }
    }

    override fun onSurfaceChanged(gl: GL10?, width: Int, height: Int) {
        try { surfaceWidth = width; surfaceHeight = height; backend.resize(width, height); FileLogger.w("Render", "surface 尺寸: ${width}x${height}") }
        catch (e: Throwable) { FileLogger.w("Render", "onSurfaceChanged 异常: ${e.message}") }
    }

    private var drawErrorsLogged = 0
    // v4.7.7 帧耗时分解累计器 (v4.8.0: jsTick 段迁逻辑线程 PerfLog, GL 侧仅 3 段)
    private var perfAccQ = 0L; private var perfAccL = 0L; private var perfAccF = 0L
    private var perfN = 0
    private var glThreadPinned = false
    private var firstFrameLogged = false

    private var hbFrameN = 0L
    override fun onDrawFrame(gl: GL10?) {
        com.white.engine.core.BlackBox.beat("大核GL", "帧#${++hbFrameN}")   // T85 黑匣子心跳
        if (!glThreadPinned) { glThreadPinned = true; com.white.engine.core.CpuAffinity.pin(big = true) }   // v4.8.0: GL 集合线程 → 大核
        val now = System.nanoTime()
        val dt = (now - lastTs) / 1_000_000_000f
        lastTs = now

        try {
            // v4.8.0 多核架构帧序: GL 线程只做集合 — 回放逻辑线程录制的 GL 指令 → 2D 层合成 → swap
            backend.beginFrame()
            val tQ0 = System.nanoTime()
            val flushed = engine.flushGlCmds()           // v4.8.0: 逻辑线程 __gl 录制指令回放
            while (true) {
                val action = renderQueue.poll() ?: break
                try { action() } catch (e: Throwable) {
                    if (drawErrorsLogged++ < 5) FileLogger.w("Render", "渲染指令异常: ${e.javaClass.simpleName}: ${e.message}")
                }
            }
            val tJ1 = tQ0   // v4.8.0: jsTick 已迁逻辑线程 (PerfLogic 独立打点), GL 侧无此段
            drawScreenLayers()                           // v4.6.0: #ov/#static 2D 层 lighten 合成 (mix-blend-mode 对齐)
            val tL0 = System.nanoTime()
            overlays.values.sortedBy { it.second }       // 按 z 稳定排序, 一次画完
                .forEach { backend.drawOverlay(it.first, it.second, it.third) }
            backend.endFrame()
            val tEnd = System.nanoTime()
            // v4.7.7: 帧耗时分解 — cmds(指令回放+mod队列) / layers(2D层纹理) / 汇总, 低帧率下每10帧一条
            perfAccQ += tJ1 - tQ0; perfAccL += tL0 - tJ1; perfAccF += tEnd - tL0
            perfN++
            if (perfN >= 10) {
                val ms = { ns: Long -> "%.1f".format(ns / 1_000_000.0 / perfN) }
                FileLogger.w("Perf", "帧耗时分解(每帧均值 x${perfN}): cmds=${ms(perfAccQ)}ms layers=${ms(perfAccL)}ms overlays+swap=${ms(perfAccF)}ms 回放=${flushed}条")
                perfAccQ = 0; perfAccL = 0; perfAccF = 0; perfN = 0
            }
            if (!firstFrameLogged) { firstFrameLogged = true; FileLogger.w("Render", "首帧渲染完成 (渲染循环正式运转)") }
        } catch (e: Throwable) {
            // v0.1.2: 帧内异常不外泄 — GL 线程死亡 = 整个应用闪退; 记录后跳帧保命
            if (drawErrorsLogged++ < 5) {
                FileLogger.w("Render", "onDrawFrame 异常 (第${drawErrorsLogged}次): ${e.javaClass.name}: ${e.message}")
                e.stackTrace.take(15).forEach { FileLogger.w("Render", "    at $it") }
            }
            return
        }

        frameCount++; fpsClock += dt
        if (fpsClock >= 1f) { fps = frameCount; frameCount = 0; fpsClock = 0f }
    }

    fun tick(dtSec: Float) { /* 预留: 非渲染驱动路径 */ }

    // ---- Mod API: render.* ----
    fun addOverlay(id: String, asset: String, z: Int, alpha: Float) { overlays[id] = Triple(asset, z, alpha) }
    fun removeOverlay(id: String) { overlays.remove(id) }
    fun screenEffect(effect: String, durationSec: Float) = backend.screenEffect(effect, durationSec)

    // ---- 引擎内部 ----
    fun flashCard(card: Char) {
        // RYGB 卡按键视觉反馈 — 颜色映射与原版一致 (事同而理不同: 原版走 CSS 变量, 我们走 clear uniform)
        val (r, g, b) = when (card) {
            'R' -> Triple(0.88f, 0.33f, 0.33f)
            'Y' -> Triple(0.83f, 0.69f, 0.17f)
            'G' -> Triple(0.17f, 0.63f, 0.27f)
            else -> Triple(0.23f, 0.44f, 0.83f)
        }
        backend.setClearColor(r, g, b)
        engine.sched.after(120L) { backend.setClearColor(0.05f, 0.05f, 0.07f) }
    }
}
