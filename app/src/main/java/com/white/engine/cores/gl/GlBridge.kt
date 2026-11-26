package com.white.engine.cores.gl

import android.opengl.GLES20 as G
import android.opengl.GLES30 as G30
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.Base64

/**
 * GlBridge — WebGL2 → GLES 直通桥 (M3 第二阶段)
 *
 * 约定:
 *  · 所有方法必须在 GL 线程调用 — v0.4.0 起 QuickJS 逻辑层运行在 GL 线程, 桥调用即同步 GL 调用
 *  · WebGL 枚举 == GLES 枚举 (同一套 GLSL ES / 状态机), 直通无需翻译
 *  · ArrayBuffer ↔ byte[] 封送由 quickjs-android 提供 (JS 侧传 typed array 的 .buffer)
 *  · 对象句柄 (shader/program/buffer/texture/vao) 全部走真实 GL 名, JS 侧不透明
 */
/**
 * v4.4.2: quickjs-Android 的接口绑定不支持 byte[] (JNI 抛 "Unsupported Java type byte"),
 * 二进制通路全部改走 Base64 String 封送 (JS 侧 btoa / Java 侧 Base64.getDecoder)
 */
private fun decodeB64(b64: String): ByteArray = try {
    Base64.getDecoder().decode(b64)
} catch (e: Throwable) {
    ByteArray(0)
}

/**
 * GlBridgeApi — QuickJS 桥绑定契约
 *
 * ⚠ quickjs-Android 的 JavaBridge 只接受 interface (动态代理封送), 绑具体类会抛
 *   "Only interfaces can be bound" (v4.4.0 首启即败的根因)。
 *   且不支持 byte[] (v4.4.1 二进制参数直接 abort) → 二进制一律 Base64 String。
 */
interface GlBridgeApi {
    // ---- shader ----
    fun createShader(type: Int): Int
    fun shaderSource(id: Int, src: String)
    fun compileShader(id: Int)
    fun deleteShader(id: Int)
    fun shaderParam(id: Int, pname: Int): Int
    fun shaderLog(id: Int): String

    // ---- program ----
    fun createProgram(): Int
    fun attach(pid: Int, sid: Int)
    fun detach(pid: Int, sid: Int)
    fun link(pid: Int)
    fun useProgram(pid: Int)
    fun deleteProgram(pid: Int)
    fun programParam(pid: Int, pname: Int): Int
    fun programLog(pid: Int): String
    fun getAttrib(pid: Int, name: String): Int
    fun getUniform(pid: Int, name: String): Int

    // ---- program 枚举 / attrib 绑定 (game.js _initGL 实际使用) ----
    fun bindAttribLocation(pid: Int, index: Int, name: String)
    fun getUniformInfo(pid: Int, index: Int): String   // "name|size|type"
    fun getAttribInfo(pid: Int, index: Int): String    // "name|size|type"

    // ---- buffer ----
    fun createBuffer(): Int
    fun deleteBuffer(id: Int)
    fun bindBuffer(target: Int, id: Int)
    fun bufferData(target: Int, b64: String, usage: Int)
    fun bufferSubData(target: Int, offset: Int, b64: String)
    fun bufferDataSize(target: Int, size: Int, usage: Int)
    fun generateMipmap(target: Int)

    // ---- vao ----
    fun createVertexArray(): Int
    fun bindVertexArray(id: Int)
    fun deleteVertexArray(id: Int)

    // ---- texture ----
    fun createTexture(): Int
    fun deleteTexture(id: Int)
    fun activeTexture(unit: Int)
    fun bindTexture(target: Int, id: Int)
    fun texParam(target: Int, pname: Int, value: Int)
    fun pixelStore(pname: Int, value: Int)
    fun texFromImage(webglTex: Int, imgTex: Int): Boolean
    fun texImage2DFromBytes(target: Int, level: Int, internal: Int, w: Int, h: Int, format: Int, type: Int, b64: String)

    // ---- uniform ----
    fun uniform1i(loc: Int, v: Int)
    fun uniform1f(loc: Int, v: Double)
    fun uniform2f(loc: Int, a: Double, b: Double)
    fun uniform3f(loc: Int, a: Double, b: Double, c: Double)
    fun uniform4f(loc: Int, a: Double, b: Double, c: Double, d: Double)
    fun uniformMatrix4fv(loc: Int, b64: String)
    fun uniformMatrix4n(loc: Int, m0: Double, m1: Double, m2: Double, m3: Double, m4: Double, m5: Double, m6: Double, m7: Double,
                        m8: Double, m9: Double, m10: Double, m11: Double, m12: Double, m13: Double, m14: Double, m15: Double)

    // ---- vertex / state ----
    fun enableVertexAttribArray(idx: Int)
    fun disableVertexAttribArray(idx: Int)
    fun vertexAttribPointer(idx: Int, size: Int, type: Int, normalized: Boolean, stride: Int, offset: Int)
    fun viewport(x: Int, y: Int, w: Int, h: Int)
    fun clearColor(r: Double, g: Double, b: Double, a: Double)
    fun clear(mask: Int)
    fun enable(cap: Int)
    fun disable(cap: Int)
    fun blendFunc(s: Int, d: Int)
    fun cullFace(mode: Int)
    fun frontFace(mode: Int)
    fun depthFunc(fn: Int)

    // ---- draw ----
    fun drawArrays(mode: Int, first: Int, count: Int)
    fun drawElements(mode: Int, count: Int, type: Int, offset: Int)

    // ---- misc ----
    fun getError(): Int
    fun getInt(pname: Int): Int
    fun getString(pname: Int): String
    fun surfaceSize(): String

    // ---- framebuffer (真 FBO — game.js 特效管线: 渲染到纹理再合成) ----
    fun createFramebuffer(): Int
    fun deleteFramebuffer(id: Int)
    fun bindFramebuffer(target: Int, id: Int)
    fun framebufferTexture2D(target: Int, attachment: Int, texTarget: Int, tex: Int, level: Int)
    fun checkFramebufferStatus(target: Int): Int

    // ---- v4.7.3: white-engine.js LiveDrawing/PaintLayer/Post 管线缺口补齐 ----
    // PaintLayer.ensure 无条件调 gl.texStorage2D (不可变纹理分配) — 缺失 = 每帧 TypeError: not a function
    fun texStorage2D(target: Int, levels: Int, internal: Int, w: Int, h: Int)
    fun blendEquation(mode: Int)
    // MSAA 渲染缓冲 (samples>1 分支) + blit 解析 (Post 管线 READ→DRAW 合成)
    fun createRenderbuffer(): Int
    fun bindRenderbuffer(target: Int, id: Int)
    fun deleteRenderbuffer(id: Int)
    fun renderbufferStorageMultisample(target: Int, samples: Int, internal: Int, w: Int, h: Int)
    fun framebufferRenderbuffer(target: Int, attachment: Int, rbTarget: Int, rb: Int)
    fun blitFramebuffer(
        srcX0: Int, srcY0: Int, srcX1: Int, srcY1: Int,
        dstX0: Int, dstY0: Int, dstX1: Int, dstY1: Int,
        mask: Int, filter: Int
    )
}

class GlBridge(private val renderer: WhiteRenderer) : GlBridgeApi {

    /** webgl 纹理句柄 → 图片桥纹理 GL 名别名 (texFromImage; GlesBackend 异步上传, 未就绪返回 false) */
    private val texAlias = HashMap<Int, Int>()
    private val flipSrc = HashMap<Int, Int>()   // v4.6.0: webglTex → 已翻转的源桥纹理 (缓存防每帧重翻)
    // v4.5.1: UNPACK_FLIP_Y_WEBGL 对齐 — GLES 无此像素存储参数, 上传时在位图层翻转
    private var flipY = false
    fun setFlipY(f: Boolean) { flipY = f }

    // ---- shader ----
    override fun createShader(type: Int): Int = G.glCreateShader(type)
    override fun shaderSource(id: Int, src: String) = G.glShaderSource(id, src)
    override fun compileShader(id: Int) = G.glCompileShader(id)
    override fun deleteShader(id: Int) = G.glDeleteShader(id)
    override fun shaderParam(id: Int, pname: Int): Int { val b = IntArray(1); G.glGetShaderiv(id, pname, b, 0); return b[0] }
    override fun shaderLog(id: Int): String = G.glGetShaderInfoLog(id) ?: ""

    // ---- program ----
    override fun createProgram(): Int = G.glCreateProgram()
    override fun attach(pid: Int, sid: Int) = G.glAttachShader(pid, sid)
    override fun detach(pid: Int, sid: Int) = G.glDetachShader(pid, sid)
    override fun link(pid: Int) = G.glLinkProgram(pid)
    override fun useProgram(pid: Int) = G.glUseProgram(pid)
    override fun deleteProgram(pid: Int) = G.glDeleteProgram(pid)
    override fun programParam(pid: Int, pname: Int): Int { val b = IntArray(1); G.glGetProgramiv(pid, pname, b, 0); return b[0] }
    override fun programLog(pid: Int): String = G.glGetProgramInfoLog(pid) ?: ""
    override fun getAttrib(pid: Int, name: String): Int = G.glGetAttribLocation(pid, name)
    override fun getUniform(pid: Int, name: String): Int = G.glGetUniformLocation(pid, name)
    override fun bindAttribLocation(pid: Int, index: Int, name: String) = G.glBindAttribLocation(pid, index, name)

    override fun getUniformInfo(pid: Int, index: Int): String {
        val n = IntArray(1); val sz = IntArray(1); val ty = IntArray(1); val buf = ByteArray(256)
        G30.glGetActiveUniform(pid, index, buf.size, n, 0, sz, 0, ty, 0, buf, 0)
        val name = if (n[0] > 0) String(buf, 0, n[0]) else ""
        return "$name|${sz[0]}|${ty[0]}"
    }

    override fun getAttribInfo(pid: Int, index: Int): String {
        val n = IntArray(1); val sz = IntArray(1); val ty = IntArray(1); val buf = ByteArray(256)
        G.glGetActiveAttrib(pid, index, buf.size, n, 0, sz, 0, ty, 0, buf, 0)
        val name = if (n[0] > 0) String(buf, 0, n[0]) else ""
        return "$name|${sz[0]}|${ty[0]}"
    }

    // ---- buffer ----
    override fun createBuffer(): Int { val b = IntArray(1); G.glGenBuffers(1, b, 0); return b[0] }
    override fun deleteBuffer(id: Int) = G.glDeleteBuffers(1, intArrayOf(id), 0)
    override fun bindBuffer(target: Int, id: Int) = G.glBindBuffer(target, id)
    override fun bufferData(target: Int, b64: String, usage: Int) {
        val bytes = decodeB64(b64)
        val bb = ByteBuffer.allocateDirect(bytes.size).order(ByteOrder.nativeOrder())
        bb.put(bytes); bb.rewind()
        G.glBufferData(target, bytes.size, bb, usage)
    }
    override fun bufferSubData(target: Int, offset: Int, b64: String) {
        val bytes = decodeB64(b64)
        val bb = ByteBuffer.allocateDirect(bytes.size).order(ByteOrder.nativeOrder())
        bb.put(bytes); bb.rewind()
        G.glBufferSubData(target, offset, bytes.size, bb)
    }
    override fun bufferDataSize(target: Int, size: Int, usage: Int) =
        G.glBufferData(target, size, null, usage)
    override fun generateMipmap(target: Int) = G.glGenerateMipmap(target)

    // ---- VAO (WebGL2 / ES3) ----
    override fun createVertexArray(): Int { val b = IntArray(1); G30.glGenVertexArrays(1, b, 0); return b[0] }
    override fun bindVertexArray(id: Int) = G30.glBindVertexArray(id)
    override fun deleteVertexArray(id: Int) = G30.glDeleteVertexArrays(1, intArrayOf(id), 0)

    // ---- texture ----
    override fun createTexture(): Int { val b = IntArray(1); G.glGenTextures(1, b, 0); return b[0] }
    override fun deleteTexture(id: Int) { texAlias.remove(id); G.glDeleteTextures(1, intArrayOf(id), 0) }
    override fun activeTexture(unit: Int) = G.glActiveTexture(unit)
    override fun bindTexture(target: Int, id: Int) = G.glBindTexture(target, texAlias[id] ?: id)
    override fun texParam(target: Int, pname: Int, value: Int) = G.glTexParameteri(target, pname, value)
    override fun pixelStore(pname: Int, value: Int) = G.glPixelStorei(pname, value)

    /** texImage2D 数据源 = Image 元素 (图片桥纹理别名) — 上传未完成返回 false, JS 侧重试
     *  v4.6.0: flipY 翻转结果缓存 — 同一 (webglTex, imgTex) 对只翻转上传一次 (原每帧新建纹理泄漏) */
    override fun texFromImage(webglTex: Int, imgTex: Int): Boolean {
        val backend = renderer.backend as? GlesBackend ?: return false
        if (flipSrc[webglTex] == imgTex && texAlias[webglTex] != null) return true
        val glName = if (flipY) {
            // UNPACK_FLIP_Y_WEBGL=true: 翻转后重传 (别名指向新纹理)
            val bmp = backend.bitmapOf(imgTex) ?: return false
            val m = android.graphics.Matrix().apply { setScale(1f, -1f); postTranslate(0f, bmp.height.toFloat()) }
            val flipped = backend.loadTextureSync(android.graphics.Bitmap.createBitmap(bmp, 0, 0, bmp.width, bmp.height, m, false))
            backend.glNameOf(flipped) ?: return false
        } else {
            backend.glNameOf(imgTex) ?: return false
        }
        texAlias[webglTex] = glName
        flipSrc[webglTex] = if (flipY) imgTex else -1
        return true
    }

    /** v4.5.1: canvas 2d 画布 → 纹理 (位图层真栅格化结果; 引擎立绘部件管线用)
     *  v4.6.0: 同步上传 — 返回即可用, 消灭异步未就绪刷屏
     *  v4.9.1: 补 CanvasSurfaces 粗锁 — 本调用经 latch 在 GL 线程执行, 与逻辑线程写位图并发,
     *          无锁读 = Skia 并发读写 = 静默 SIGSEGV (核间边界审计炸点 #2) */
    fun canvasToTexture(cid: Int): Int {
        val backend = renderer.backend as? GlesBackend ?: return -1
        return CanvasSurfaces.locked {
            val bmp = CanvasSurfaces.bitmap(cid) ?: return@locked -1
            if (flipY) {
                val m = android.graphics.Matrix().apply { setScale(1f, -1f); postTranslate(0f, bmp.height.toFloat()) }
                backend.loadTextureSync(android.graphics.Bitmap.createBitmap(bmp, 0, 0, bmp.width, bmp.height, m, false))
            } else backend.loadTextureSync(bmp)
        }
    }

    /** texImage2D 数据源 = 原始像素 (Base64 封送) */
    override fun texImage2DFromBytes(target: Int, level: Int, internal: Int, w: Int, h: Int, format: Int, type: Int, b64: String) {
        var bytes = decodeB64(b64)
        // v4.5.1: UNPACK_FLIP_Y_WEBGL — 行序翻转 (按 bpp 整除才做)
        if (flipY && w > 0 && h > 1 && bytes.isNotEmpty() && bytes.size % (w * h) == 0) {
            val bpp = bytes.size / (w * h); val row = w * bpp
            val flipped = ByteArray(bytes.size)
            for (r in 0 until h) System.arraycopy(bytes, r * row, flipped, (h - 1 - r) * row, row)
            bytes = flipped
        }
        val bb = ByteBuffer.allocateDirect(bytes.size).order(ByteOrder.nativeOrder())
        bb.put(bytes); bb.rewind()
        G.glTexImage2D(target, level, internal, w, h, 0, format, type, bb)
    }

    /** v4.5.1: texImage2D(null) — FBO 纹理存储分配 (RGBA8/RGBA16F 等) */
    fun texImage2DNull(target: Int, level: Int, internal: Int, w: Int, h: Int, format: Int, type: Int) {
        G.glTexImage2D(target, level, internal, w, h, 0, format, type, null)
    }

    // ---- uniform ----
    override fun uniform1i(loc: Int, v: Int) = G.glUniform1i(loc, v)
    override fun uniform1f(loc: Int, v: Double) = G.glUniform1f(loc, v.toFloat())
    override fun uniform2f(loc: Int, a: Double, b: Double) = G.glUniform2f(loc, a.toFloat(), b.toFloat())
    override fun uniform3f(loc: Int, a: Double, b: Double, c: Double) = G.glUniform3f(loc, a.toFloat(), b.toFloat(), c.toFloat())
    override fun uniform4f(loc: Int, a: Double, b: Double, c: Double, d: Double) = G.glUniform4f(loc, a.toFloat(), b.toFloat(), c.toFloat(), d.toFloat())
    override fun uniformMatrix4fv(loc: Int, b64: String) {
        val bytes = decodeB64(b64)
        val fb = ByteBuffer.allocateDirect(bytes.size).order(ByteOrder.nativeOrder()).asFloatBuffer()
        fb.put(ByteBuffer.wrap(bytes).order(ByteOrder.nativeOrder()).asFloatBuffer()); fb.rewind()
        G.glUniformMatrix4fv(loc, 1, false, fb)
    }

    // v4.9.0: GL 批量通道的矩阵回放目标 — 16 个数值直传 (免 b64 编解码; 与 shim 'uniformMatrix4n' op 对应)
    override fun uniformMatrix4n(loc: Int, m0: Double, m1: Double, m2: Double, m3: Double, m4: Double, m5: Double, m6: Double, m7: Double,
                                 m8: Double, m9: Double, m10: Double, m11: Double, m12: Double, m13: Double, m14: Double, m15: Double) {
        val f = floatArrayOf(m0.toFloat(), m1.toFloat(), m2.toFloat(), m3.toFloat(), m4.toFloat(), m5.toFloat(), m6.toFloat(), m7.toFloat(),
            m8.toFloat(), m9.toFloat(), m10.toFloat(), m11.toFloat(), m12.toFloat(), m13.toFloat(), m14.toFloat(), m15.toFloat())
        val fb = ByteBuffer.allocateDirect(64).order(ByteOrder.nativeOrder()).asFloatBuffer()
        fb.put(f); fb.rewind()
        G.glUniformMatrix4fv(loc, 1, false, fb)
    }

    // ---- attrib / 状态 ----
    override fun enableVertexAttribArray(idx: Int) = G.glEnableVertexAttribArray(idx)
    override fun disableVertexAttribArray(idx: Int) = G.glDisableVertexAttribArray(idx)
    override fun vertexAttribPointer(idx: Int, size: Int, type: Int, normalized: Boolean, stride: Int, offset: Int) =
        G.glVertexAttribPointer(idx, size, type, normalized, stride, offset)
    override fun viewport(x: Int, y: Int, w: Int, h: Int) = G.glViewport(x, y, w, h)
    override fun clearColor(r: Double, g: Double, b: Double, a: Double) = G.glClearColor(r.toFloat(), g.toFloat(), b.toFloat(), a.toFloat())
    override fun clear(mask: Int) = G.glClear(mask)
    override fun enable(cap: Int) = G.glEnable(cap)
    override fun disable(cap: Int) = G.glDisable(cap)
    override fun blendFunc(s: Int, d: Int) = G.glBlendFunc(s, d)
    override fun cullFace(mode: Int) = G.glCullFace(mode)
    override fun frontFace(mode: Int) = G.glFrontFace(mode)
    override fun depthFunc(fn: Int) = G.glDepthFunc(fn)

    // ---- draw ----
    override fun drawArrays(mode: Int, first: Int, count: Int) = G.glDrawArrays(mode, first, count)
    override fun drawElements(mode: Int, count: Int, type: Int, offset: Int) = G.glDrawElements(mode, count, type, offset)

    // ---- query ----
    override fun getError(): Int = G.glGetError()
    override fun getInt(pname: Int): Int { val b = IntArray(1); G.glGetIntegerv(pname, b, 0); return b[0] }
    override fun getString(pname: Int): String = G.glGetString(pname) ?: ""
    override fun surfaceSize(): String = "${renderer.surfaceWidth},${renderer.surfaceHeight}"

    // ---- framebuffer (真 FBO) ----
    override fun createFramebuffer(): Int { val b = IntArray(1); G.glGenFramebuffers(1, b, 0); return b[0] }
    override fun deleteFramebuffer(id: Int) = G.glDeleteFramebuffers(1, intArrayOf(id), 0)
    override fun bindFramebuffer(target: Int, id: Int) = G.glBindFramebuffer(target, id)
    override fun framebufferTexture2D(target: Int, attachment: Int, texTarget: Int, tex: Int, level: Int) =
        G.glFramebufferTexture2D(target, attachment, texTarget, tex, level)
    override fun checkFramebufferStatus(target: Int) = G.glCheckFramebufferStatus(target)

    // ---- v4.7.3: GLES 3.0 补齐 (white-engine.js 主渲染管线真实缺口) ----
    override fun texStorage2D(target: Int, levels: Int, internal: Int, w: Int, h: Int) =
        G30.glTexStorage2D(target, levels, internal, w, h)
    override fun blendEquation(mode: Int) = G.glBlendEquation(mode)
    override fun createRenderbuffer(): Int { val b = IntArray(1); G.glGenRenderbuffers(1, b, 0); return b[0] }
    override fun bindRenderbuffer(target: Int, id: Int) = G.glBindRenderbuffer(target, id)
    override fun deleteRenderbuffer(id: Int) = G.glDeleteRenderbuffers(1, intArrayOf(id), 0)
    override fun renderbufferStorageMultisample(target: Int, samples: Int, internal: Int, w: Int, h: Int) =
        G30.glRenderbufferStorageMultisample(target, samples, internal, w, h)
    override fun framebufferRenderbuffer(target: Int, attachment: Int, rbTarget: Int, rb: Int) =
        G.glFramebufferRenderbuffer(target, attachment, rbTarget, rb)
    override fun blitFramebuffer(
        srcX0: Int, srcY0: Int, srcX1: Int, srcY1: Int,
        dstX0: Int, dstY0: Int, dstX1: Int, dstY1: Int,
        mask: Int, filter: Int
    ) = G30.glBlitFramebuffer(
        srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter
    )
}
