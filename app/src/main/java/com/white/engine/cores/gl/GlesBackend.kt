package com.white.engine.cores.gl

import android.opengl.GLES20
import android.opengl.GLES30
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer

/**
 * GlesBackend — OpenGL ES 2/3 后端 (默认, 全设备兼容)
 *
 * 设计要点 (对齐网页版病灶的反面):
 *   · 全场只有 1 个 GL 上下文 / 1 个 surface — 网页版是 30 个 canvas
 *   · 单一共享 VBO, 每帧一次 bufferSubData — 网页版每层各自上传
 *   · overlay 列表按 z 排序后一次画完, 不切 framebuffer
 */
class GlesBackend : RenderBackend {

    override val name = "GLES"

    private var program = 0
    private var vbo = 0
    private var posLoc = 0
    private var colorLoc = 0
    private val overlayList = mutableListOf<Triple<String, Int, Float>>()   // id, z, alpha
    // v4.6.0: 对齐 game.css :root --bg #09090b (浏览器 #stage 背景, GL 层代替)
    private var clearR = 9f / 255f; private var clearG = 9f / 255f; private var clearB = 11f / 255f

    // 每顶点 6 floats (x,y,r,g,b,a) = 24 字节; 6 顶点 = 144 字节 (v0.3.7 根修: 原 5 floats 分配必溢出)
    private val quad: FloatBuffer = ByteBuffer.allocateDirect(6 * 6 * 4)
        .order(ByteOrder.nativeOrder()).asFloatBuffer()

    override fun init(surface: Any?, width: Int, height: Int): Boolean {
        // 顶点着色器: 二维位置 + 颜色
        val vs = """
            attribute vec2 aPos; attribute vec4 aColor; uniform vec2 uRes;
            varying vec4 vColor; void main() {
                vec2 p = (aPos / uRes) * 2.0 - 1.0;   // 像素坐标 → NDC
                gl_Position = vec4(p.x, -p.y, 0.0, 1.0);
                vColor = aColor; }
        """.trimIndent()
        val fs = """
            precision mediump float; varying vec4 vColor;
            void main() { gl_FragColor = vColor; }
        """.trimIndent()

        program = buildProgram(vs, fs)
        posLoc = GLES20.glGetAttribLocation(program, "aPos")
        colorLoc = GLES20.glGetAttribLocation(program, "aColor")

        // v0.4.0 M3 纹理着色器 (独立 program, 与实色通道并存)
        val tvs = """
            attribute vec2 aPos; attribute vec2 aUV; uniform vec2 uRes;
            varying vec2 vUV; void main() {
                vec2 p = (aPos / uRes) * 2.0 - 1.0;
                gl_Position = vec4(p.x, -p.y, 0.0, 1.0);
                vUV = aUV; }
        """.trimIndent()
        val tfs = """
            precision mediump float; varying vec2 vUV;
            uniform sampler2D uTex; uniform float uAlpha;
            void main() { vec4 c = texture2D(uTex, vUV); gl_FragColor = vec4(c.rgb, c.a * uAlpha); }
        """.trimIndent()
        texProgram = buildProgram(tvs, tfs)
        texPosLoc = GLES20.glGetAttribLocation(texProgram, "aPos")
        texUvLoc = GLES20.glGetAttribLocation(texProgram, "aUV")
        texResLoc = GLES20.glGetUniformLocation(texProgram, "uRes")
        texSamplerLoc = GLES20.glGetUniformLocation(texProgram, "uTex")
        texAlphaLoc = GLES20.glGetUniformLocation(texProgram, "uAlpha")

        val ids = IntArray(1)
        GLES20.glGenBuffers(1, ids, 0)
        vbo = ids[0]
        GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, vbo)
        GLES20.glBufferData(GLES20.GL_ARRAY_BUFFER, 6 * 6 * 4, null, GLES20.GL_DYNAMIC_DRAW)
        val tids = IntArray(1)
        GLES20.glGenBuffers(1, tids, 0)
        texVbo = tids[0]
        GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, texVbo)
        GLES20.glBufferData(GLES20.GL_ARRAY_BUFFER, 6 * 4 * 4, null, GLES20.GL_DYNAMIC_DRAW)
        GLES20.glEnable(GLES20.GL_BLEND)
        GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA, GLES20.GL_ONE_MINUS_SRC_ALPHA)
        resize(width, height)
        return true
    }

    override fun resize(width: Int, height: Int) {
        surfW = if (width > 0) width else 1
        surfH = if (height > 0) height else 1
        GLES20.glViewport(0, 0, surfW, surfH)
    }

    override fun beginFrame() {
        uploadPendingTextures()   // M3: 先消化图片上传队列
        GLES20.glClearColor(clearR, clearG, clearB, 1f)
        GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT)
    }

    override fun endFrame() { /* swap 由 GLSurfaceView 处理 */ }

    override fun setClearColor(r: Float, g: Float, b: Float) { clearR = r; clearG = g; clearB = b }

    /** 一个矩形 overlay (像素坐标) — demo 用; M2 起接贴图批次 */
    fun pushQuad(x: Float, y: Float, w: Float, h: Float, r: Float, g: Float, b: Float, a: Float) {
        // 自持状态: drawTexture 与本方法混排时 program/attribs 互不污染
        GLES20.glUseProgram(program)
        GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, vbo)
        GLES20.glEnableVertexAttribArray(posLoc)
        GLES20.glEnableVertexAttribArray(colorLoc)
        GLES20.glVertexAttribPointer(posLoc, 2, GLES20.GL_FLOAT, false, 24, 0)
        GLES20.glVertexAttribPointer(colorLoc, 4, GLES20.GL_FLOAT, false, 24, 8)
        val v = floatArrayOf(
            x, y, r, g, b, a, x + w, y, r, g, b, a, x + w, y + h, r, g, b, a,
            x, y, r, g, b, a, x + w, y + h, r, g, b, a, x, y + h, r, g, b, a
        )
        quad.clear(); quad.put(v)
        quad.rewind()   // put 后 position 在末尾, 必须倒回 0 否则 bufferSubData remaining() < size
        GLES20.glBufferSubData(GLES20.GL_ARRAY_BUFFER, 0, 6 * 6 * 4, quad)
        GLES20.glDrawArrays(GLES20.GL_TRIANGLES, 0, 6)
    }

    override fun drawOverlay(id: String, z: Int, alpha: Float) {
        overlayList.add(Triple(id, z, alpha))   // 实际绘制由 WhiteRenderer 在 beginFrame~endFrame 间编排
    }

    override fun removeOverlay(id: String) { overlayList.removeAll { it.first == id } }

    override fun screenEffect(effect: String, durationSec: Float) {
        // flash/shake/fade — M2 实现 (shader uniform 驱动)
    }

    // ── v0.4.0 M3 纹理通道 (Image 真加载 → GL 纹理 → drawImage 真渲染) ──
    private var texProgram = 0
    private var texVbo = 0
    private var texPosLoc = 0
    private var texUvLoc = 0
    private var texResLoc = 0
    private var texSamplerLoc = 0
    private var texAlphaLoc = 0
    private var surfW = 1
    private var surfH = 1
    private val textures = java.util.concurrent.ConcurrentHashMap<Int, Int>()          // texId → GL 纹理名
    private val texSizes = java.util.concurrent.ConcurrentHashMap<Int, IntArray>()     // texId → [w,h]
    // v4.5.1: 位图缓存 — canvas 2d 裁剪部件需要读源位图 (drawTex/canvasToTexture), 保留解码结果
    private val texBmps = java.util.concurrent.ConcurrentHashMap<Int, android.graphics.Bitmap>()
    private val texCounter = java.util.concurrent.atomic.AtomicInteger(1)
    private val pendingUploads = java.util.concurrent.ConcurrentLinkedQueue<Pair<Int, android.graphics.Bitmap>>()
    private val texBuffer: FloatBuffer = ByteBuffer.allocateDirect(6 * 4 * 4)
        .order(ByteOrder.nativeOrder()).asFloatBuffer()   // x,y,u,v × 6 顶点

    /** 逻辑线程调用: 解码好的位图排队, GL 线程下一帧上传; 立即返回 texId (未上传完 draw 会跳过) */
    fun loadTexture(bmp: android.graphics.Bitmap): Int {
        val id = texCounter.getAndIncrement()
        texSizes[id] = intArrayOf(bmp.width, bmp.height)
        texBmps[id] = bmp
        pendingUploads.add(id to bmp)
        return id
    }

    /** v4.5.1: 翻转上传 (UNPACK_FLIP_Y_WEBGL 对齐) — 返回新 texId */
    fun loadTextureFlipped(bmp: android.graphics.Bitmap): Int {
        val m = android.graphics.Matrix().apply { setScale(1f, -1f); postTranslate(0f, bmp.height.toFloat()) }
        return loadTexture(android.graphics.Bitmap.createBitmap(bmp, 0, 0, bmp.width, bmp.height, m, false))
    }

    /** v4.6.0: GL 线程同步上传 (canvasToTexture 在 tick 内直调) — 返回即可用 glNameOf 命中 */
    fun loadTextureSync(bmp: android.graphics.Bitmap): Int {
        val id = texCounter.getAndIncrement()
        texSizes[id] = intArrayOf(bmp.width, bmp.height)
        texBmps[id] = bmp
        uploadOne(id, bmp)
        return id
    }

    /** v4.6.0: 删除桥纹理 (屏幕层重上传前清旧, 防泄漏)
     *  ⚡ T83 崩溃真凶修复 (v4.9.1): texBmps 里存的是**调用方位图的本体引用**
     *  (屏幕层路径 = CanvasSurfaces 画布位图, 逻辑线程还在持续绘制) —
     *  此处 recycle 会把别人正在写的位图拆掉 → 逻辑线程 drawBitmap 静默 SIGSEGV。
     *  位图生命周期归 owner 管: 画布位图由 CanvasSurfaces.destroy 回收; 图片桥位图随 deleteTexture。 */
    fun deleteBridgeTex(id: Int) {
        if (id <= 0) return
        textures.remove(id)?.let { GLES20.glDeleteTextures(1, intArrayOf(it), 0) }
        texBmps.remove(id)   // 只解除引用, 绝不 recycle — owner 全权负责
        texSizes.remove(id)
    }

    /** v4.6.0: 屏幕合成层 — 全屏纹理 GL_MAX (精确复刻 CSS mix-blend-mode:lighten)。texId = 桥纹理 id */
    fun drawScreenLayerTex(texId: Int) {
        val glTex = glNameOf(texId) ?: return
        GLES20.glUseProgram(texProgram)
        GLES20.glUniform2f(texResLoc, surfW.toFloat(), surfH.toFloat())
        GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, texVbo)
        val v = floatArrayOf(
            0f, 0f, 0f, 1f, surfW.toFloat(), 0f, 1f, 1f, surfW.toFloat(), surfH.toFloat(), 1f, 0f,
            0f, 0f, 0f, 1f, surfW.toFloat(), surfH.toFloat(), 1f, 0f, 0f, surfH.toFloat(), 0f, 0f
        )
        texBuffer.clear(); texBuffer.put(v); texBuffer.rewind()
        GLES20.glBufferSubData(GLES20.GL_ARRAY_BUFFER, 0, 6 * 4 * 4, texBuffer)
        GLES20.glEnableVertexAttribArray(texPosLoc)
        GLES20.glEnableVertexAttribArray(texUvLoc)
        GLES20.glVertexAttribPointer(texPosLoc, 2, GLES20.GL_FLOAT, false, 16, 0)
        GLES20.glVertexAttribPointer(texUvLoc, 2, GLES20.GL_FLOAT, false, 16, 8)
        GLES20.glActiveTexture(GLES20.GL_TEXTURE0)
        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, glTex)
        GLES20.glUniform1i(texSamplerLoc, 0)
        GLES20.glUniform1f(texAlphaLoc, 1f)
        // lighten = max(fb, layer): MAX 混合方程 + ONE/ONE (fb 已含 clear+WebGL 内容)
        GLES30.glBlendEquation(GLES30.GL_MAX)
        GLES20.glBlendFunc(GLES20.GL_ONE, GLES20.GL_ONE)
        GLES20.glDrawArrays(GLES20.GL_TRIANGLES, 0, 6)
        GLES30.glBlendEquation(GLES30.GL_FUNC_ADD)
        GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA, GLES20.GL_ONE_MINUS_SRC_ALPHA)
    }

    private fun uploadOne(id: Int, bmp: android.graphics.Bitmap) {
        val ids = IntArray(1)
        GLES20.glGenTextures(1, ids, 0)
        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, ids[0])
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR)
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR)
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_CLAMP_TO_EDGE)
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE)
        android.opengl.GLUtils.texImage2D(GLES20.GL_TEXTURE_2D, 0, bmp, 0)
        textures[id] = ids[0]
    }

    /** v4.5.1: 源位图读取 (canvas 2d drawImage 裁剪 / 翻转上传用) */
    fun bitmapOf(id: Int): android.graphics.Bitmap? = texBmps[id]

    fun textureSize(id: Int): String {
        val s = texSizes[id] ?: return "0,0"
        return "${s[0]},${s[1]}"
    }

    /** M3.2: 图片桥纹理 → 真实 GL 纹理名 (未上传完返回 null; WebGL texFromImage 别名用) */
    fun glNameOf(id: Int): Int? = textures[id]

    /** GL 线程: 把排队的位图上传为 GL 纹理 (beginFrame 里调用) */
    private fun uploadPendingTextures() {
        while (true) {
            val p = pendingUploads.poll() ?: break
            val (id, bmp) = p
            if (textures.containsKey(id)) { bmp.recycle(); continue }
            val ids = IntArray(1)
            GLES20.glGenTextures(1, ids, 0)
            GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, ids[0])
            GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR)
            GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR)
            GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_CLAMP_TO_EDGE)
            GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE)
            android.opengl.GLUtils.texImage2D(GLES20.GL_TEXTURE_2D, 0, bmp, 0)
            textures[id] = ids[0]
            bmp.recycle()
        }
    }

    /** GL 线程: 画一张纹理矩形 (UV 子矩形 + 全局透明度) */
    fun drawTexture(id: Int, x: Float, y: Float, w: Float, h: Float, u0: Float, v0: Float, u1: Float, v1: Float, alpha: Float) {
        val glTex = textures[id] ?: return   // 还没上传完 → 跳过本帧, 下帧再画
        GLES20.glUseProgram(texProgram)
        GLES20.glUniform2f(texResLoc, surfW.toFloat(), surfH.toFloat())
        GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, texVbo)
        val v = floatArrayOf(
            x, y, u0, v0, x + w, y, u1, v0, x + w, y + h, u1, v1,
            x, y, u0, v0, x + w, y + h, u1, v1, x, y + h, u0, v1
        )
        texBuffer.clear(); texBuffer.put(v); texBuffer.rewind()
        GLES20.glBufferSubData(GLES20.GL_ARRAY_BUFFER, 0, 6 * 4 * 4, texBuffer)
        GLES20.glEnableVertexAttribArray(texPosLoc)
        GLES20.glEnableVertexAttribArray(texUvLoc)
        GLES20.glVertexAttribPointer(texPosLoc, 2, GLES20.GL_FLOAT, false, 16, 0)
        GLES20.glVertexAttribPointer(texUvLoc, 2, GLES20.GL_FLOAT, false, 16, 8)
        GLES20.glActiveTexture(GLES20.GL_TEXTURE0)
        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, glTex)
        GLES20.glUniform1i(texSamplerLoc, 0)
        GLES20.glUniform1f(texAlphaLoc, alpha)
        GLES20.glDrawArrays(GLES20.GL_TRIANGLES, 0, 6)
    }

    override fun shutdown() {
        if (vbo != 0) GLES20.glDeleteBuffers(1, intArrayOf(vbo), 0)
        if (texVbo != 0) GLES20.glDeleteBuffers(1, intArrayOf(texVbo), 0)
        if (program != 0) GLES20.glDeleteProgram(program)
        if (texProgram != 0) GLES20.glDeleteProgram(texProgram)
    }

    private fun buildProgram(vsSrc: String, fsSrc: String): Int {
        val vs = GLES20.glCreateShader(GLES20.GL_VERTEX_SHADER)
        GLES20.glShaderSource(vs, vsSrc); GLES20.glCompileShader(vs)
        val fs = GLES20.glCreateShader(GLES20.GL_FRAGMENT_SHADER)
        GLES20.glShaderSource(fs, fsSrc); GLES20.glCompileShader(fs)
        val p = GLES20.glCreateProgram()
        GLES20.glAttachShader(p, vs); GLES20.glAttachShader(p, fs); GLES20.glLinkProgram(p)
        return p
    }
}
