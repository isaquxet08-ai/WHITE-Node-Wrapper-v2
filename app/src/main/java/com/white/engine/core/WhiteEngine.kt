package com.white.engine.core

import android.content.Context
import com.whl.quickjs.wrapper.JSCallFunction
import com.whl.quickjs.wrapper.JSObject
import com.whl.quickjs.wrapper.QuickJSContext
import com.white.engine.cores.gl.WhiteRenderer
import com.white.engine.cores.mod.ModHost
import com.white.engine.cores.mod.ApiBridge
import com.white.engine.cores.mod.CommandDef

/**
 * WHITE 引擎内核
 *
 * ⚠ 范围红线 (README §范围红线):
 *   本内核只做渲染/输入/音频/存储/模组宿主。
 *   剧情推动逻辑与游戏资源 = 原版资产, 经 LogicHost 原样托管, 不复制不改写。
 *   引擎对剧情层的访问是只读观察 + 官方包装既有入口。
 */
/** 逻辑层存档目录 (逻辑桥 saveRead/saveWrite/saveList 用) */
internal val LOGIC_SAVE_DIR = java.io.File("/storage/emulated/0/WHITE/存档")

/**
 * 原版游戏资源目录 (v0.4.1: 游戏本体随 APK assets 分发 → 首启解压到私有 filesDir/game, 免存储权限;
 * 外部 /storage/emulated/0/WHITE/game 仅作旧包/自定义内容回退) — 只读不写 (范围红线)
 */
internal var GAME_DIR = java.io.File("/storage/emulated/0/WHITE/game")

/** readGameFile 未命中哨兵 (Proxy 封送不支持 null 返回, 用字符串哨兵区分 404) */
internal const val GAME_FILE_MISS = "@@GAME_FILE_NOT_FOUND@@"

/** 游戏资源路径解析缓存 (v0.4.0: 抽出三级查找, 供文本桥/图片桥复用) — CHM 不允许 null, miss 用哨兵文件 */
internal val gameFilePathCache = java.util.concurrent.ConcurrentHashMap<String, java.io.File>()
internal val GAME_PATH_MISS = java.io.File("@@GAME_PATH_MISS@@")
internal fun isPathMiss(f: java.io.File) = f.path == GAME_PATH_MISS.path

/** 游戏资源三级查找: WHITE/game/<path> → WHITE/<path> → 递归兜底 (只读, 防 '..' 逃逸) */
internal fun resolveGameFile(path: String): java.io.File? {
    if (path.isEmpty() || path.contains("..")) return null
    val cached = gameFilePathCache[path]
    if (cached != null) return if (isPathMiss(cached)) null else cached
    val gameBase = GAME_DIR.canonicalFile
    val whiteBase = gameBase.parentFile
    var hit: java.io.File? = null
    // 1: game/<path>  2: WHITE/<path>
    for (base in listOfNotNull(gameBase, whiteBase)) {
        val f = base.resolve(path.trimStart('/'))
        if (f.exists() && f.isFile) { hit = f; break }
    }
    // 3: 递归兜底 — 包内资源实际层级可能与 index.html 相对路径不同, 按尾部/文件名找第一个命中
    if (hit == null) {
        val norm = path.trimStart('/')
        val tail = norm.substringAfterLast('/')
        hit = try {
            gameBase.walkTopDown().filter { it.isFile }.firstOrNull { f ->
                f.canonicalPath.endsWith("/$norm") || f.name == tail
            }
        } catch (e: Exception) { null }
    }
    gameFilePathCache[path] = hit ?: GAME_PATH_MISS
    return hit
}

/**
 * JS 侧可见的桥接口 (方法签名必须是简单类型, 经 Java Proxy 封送) — 文件顶层供 LogicHost 使用
 * ⚠ v0.3.1 根因修复: QuickJS Proxy 封送不支持 Kotlin Float (primitive float) —
 *   一旦接口带 float 参数, js.set() 直接抛 "Unsupported Java type float"。
 *   桥签名必须用 Double (JS number 天然对应), 渲染层内部再转 Float。
 */
interface JsbBridge {
    fun log(level: String, msg: String)
    fun emit(event: String, data: String)
    fun currentScene(): String
    // ── v0.3.0 渲染指令桥 (排队到 GL 线程, 逻辑线程绝不直接碰 GL) ──
    fun drawQuad(x: Double, y: Double, w: Double, h: Double, r: Double, g: Double, b: Double, a: Double)
    fun setClearColor(r: Double, g: Double, b: Double)
    fun screenWidth(): Double
    fun screenHeight(): Double
    // ── v0.3.0 输入桥 (行为契约: RYGB 卡按键) ──
    fun cardPress(card: String)
    fun vibrate(ms: Int)
    // ── v0.3.0 存档桥 (WHITE/存档/, 只动数据不动 schema) ──
    fun saveRead(name: String): String
    fun saveWrite(name: String, content: String)
    fun saveList(): String
    // ── v0.3.3 游戏资源桥 (垫片 fetch 真读 WHITE/game/, 只读) ──
    fun readGameFile(path: String): String
    // ── v0.4.0 M3 图片桥 (Image 解码 → GL 纹理 → drawImage 真渲染) ──
    fun loadGameImage(path: String): Int          // -1 = 未命中/解码失败
    fun imageSize(texId: Int): String             // "w,h"
    // ── v4.4.3 data URI 图片 (game.js 内嵌 base64 PNG, 传路径会 404) ──
    fun loadImageB64(b64: String): Int            // base64 字节流 → 解码 → 纹理
    fun drawImage(texId: Int, x: Double, y: Double, w: Double, h: Double, u0: Double, v0: Double, u1: Double, v1: Double, alpha: Double)
    // ── v4.5.1 CPU 位图画布桥 (white-engine 立绘管线: 2d 裁剪 → getImageData alpha → texImage2D(canvas)) ──
    fun canvasCreate(w: Int, h: Int): Int         // 句柄, 0 = 失败
    fun canvasResize(id: Int, w: Int, h: Int): Boolean
    fun canvasDraw(cid: Int, srcTexId: Int, sx: Int, sy: Int, sw: Int, sh: Int, dx: Int, dy: Int, dw: Int, dh: Int, alpha: Double): Boolean
    fun canvasFillRect(cid: Int, x: Int, y: Int, w: Int, h: Int, r: Double, g: Double, b: Double, a: Double): Boolean
    fun canvasClearRect(cid: Int, x: Int, y: Int, w: Int, h: Int): Boolean
    fun canvasPixelsB64(cid: Int): String         // RGBA bytes → Base64 (getImageData 用)
    fun canvasPixelsB64Z(cid: Int): String        // v4.5.5 RGBA → Deflate → Base64 (压缩回传, shim puffZ 解压)
    fun canvasRegionB64(cid: Int, x: Int, y: Int, w: Int, h: Int): String  // v4.5.3 子区域像素 (部件裁剪热路径)
    fun canvasToTexture(cid: Int): Int            // 画布位图 → GL 纹理 texId (texImage2D(canvas) 源)
    fun canvasPutImageB64(cid: Int, b64: String, dx: Int, dy: Int, w: Int, h: Int): Boolean  // putImageData (填充遮罩)
    fun canvasDestroy(id: Int)
    // ── v4.6.0 DOM UI 层 (WebView 镜像) + 屏幕层合成 ──
    fun domSync(html: String)                     // shim DOM 序列化 → WebView innerHTML (UI 层上屏)
    fun canvasScreenLayer(name: String, cid: Int) // #ov/#white-static 2D 画布注册为屏幕合成层
    // ── v4.6.9 音频板块: shim WebAudio 桩 → 指令 JSON → WebView 真 WebAudio 执行 ──
    fun audioCmd(json: String): String            // 批量音频指令 (节点创建/连接/参数/播放), 返回保留字段
    // ── v4.6.10 动画管线专属日志 (JS 小核 → KT 大核 07-动画日志/intro.log) ──
    fun introLog(text: String)
}

/** v4.6.0: DOM UI 渲染汇 (MainActivity 的 WebView 实现; GL 线程 → UI 线程) */
interface DomUiSink {
    fun sync(html: String)
    fun ready(): Boolean
    fun audio(json: String)   // v4.6.9: 音频指令 → WebView evaluateJavascript
}

class WhiteEngine(val context: Context) {

    lateinit var modHost: ModHost
    val renderer = WhiteRenderer(this)

    // v4.6.0: DOM UI 汇 (WebView 镜像层, MainActivity 注入; null = 无 UI 层)
    @Volatile var domUi: DomUiSink? = null

    // ---- LogicHost: 原版逻辑层托管 (M2) ----
    // QuickJS/Hermes 运行未修改的原版 white-engine.js / game.js,
    // 本内核向它提供: 输入泵 / 计时 / 存储 / 渲染桥。剧情逻辑一个字节不动。
    val logic = LogicHost()

    // v4.6.10: KT 大核 — API/控制面 (探测/日志/兜底), 两核心架构的大核本体
    val ktCore = KtCore(this)

    // ---- 全局状态 (原版既有入口的官方化包装) ----
    var speed: Float = 1f
        set(v) { field = v.coerceIn(0.25f, 8f); emit("speed.change", field) }

    var contextMeter: Float = 3.41f
        private set

    var mistakeCount: Int = 0
        private set

    // ---- 内核服务桩 (M1~M4 逐个实装; 模组 API 依赖的接缝全部就位) ----
    val sched = Scheduler()                      // timer.*
    val commands = mutableMapOf<String, CommandDef>()
    val ui = UiHost()                            // ui.*
    val files = FileHost()                       // dat.*
    val audio = AudioHost()                      // audio.*
    val input = InputHost()                      // input.*
    val save = SaveHost()                        // save.*
    val kv = KvStore()                           // storage.*
    val services = ServiceRegistry()             // modcom.*
    val http = HttpHost()                        // net.*
    val scene = SceneProxy()                     // scene.* (只读观察 + jump 包装)
    val dialogue = DialogueObserver()            // dialogue.* (只读, 红线)
    val content = ContentProxy()                 // 资源清单只读访问 (红线: 不改写)

    // ---- 事件总线 ----
    private val listeners = mutableMapOf<String, MutableList<(Any?) -> Unit>>()

    // ═══ v4.8.0 多核架构: GL 指令队列 ═══
    // 逻辑线程把 __gl 无返回值调用 (bindBuffer/bufferData/uniform*/drawArrays/viewport/texImage...)
    // 录制成 lambda 入队; GL 线程每帧帧首回放。同步查询 (createShader/getUniformLocation 等)
    // 仍 latch 到 GL 线程取真值, 但会先排空本队列保证状态顺序。
    val glCmdQueue = java.util.concurrent.ConcurrentLinkedQueue<() -> Unit>()

    /** GL 线程: 回放本帧积攒的 GL 指令。返回回放条数 (perf 统计用) */
    fun flushGlCmds(): Int {
        var n = 0
        while (true) {
            val cmd = glCmdQueue.poll() ?: break
            try { cmd() } catch (e: Throwable) {
                FileLogger.w("Render", "GL 指令回放异常: ${e.javaClass.simpleName}: ${e.message}")
            }
            if (++n >= 100_000) break
        }
        return n
    }


    fun on(event: String, cb: (Any?) -> Unit) { listeners.getOrPut(event) { mutableListOf() }.add(cb) }

    fun emit(event: String, data: Any? = null) {
        listeners[event]?.forEach { fn ->
            try { fn(data) } catch (e: Exception) { android.util.Log.e("WHITE", "事件 $event 回调异常", e) }
        }
    }

    // ---- 行为契约 (官方包装原版既有入口, 不重实现) ----
    fun cardPress(card: Char) {
        require(card in "RYGB") { "非法按键: $card" }
        renderer.flashCard(card)
        emit("card.press", card.toString())
    }

    fun setContext(v: Float) { contextMeter = v.coerceIn(0f, 3.41f); emit("context.change", contextMeter) }

    fun registerMistake() { mistakeCount++; emit("mistake", mistakeCount) }

    fun sceneJump(id: String, skip: Boolean = false) = scene.jump(id, skip)

    fun tick(deltaSec: Float) {
        sched.tick(deltaSec)
        // v4.8.0: logic.tick 已迁逻辑线程自驱 (Choreographer VSync, runTick 内套 speed 倍率)
        renderer.tick(deltaSec)
    }

    // ═════════ 内核服务桩 (M1~M4 实装点) ═════════
    class Scheduler {
        private val tasks = mutableListOf<Task>()
        private var seq = 0
        data class Task(val id: Int, val every: Float, var left: Float, val fn: () -> Unit, var once: Boolean)
        fun after(ms: Long, fn: () -> Unit) { tasks.add(Task(++seq, -1f, ms / 1000f, fn, true)) }
        fun every(ms: Long, fn: () -> Unit) { tasks.add(Task(++seq, ms / 1000f, ms / 1000f, fn, false)) }
        fun cancel(handle: Int) { tasks.removeAll { it.id == handle } }
        fun tick(dt: Float) {
            val it = tasks.iterator()
            while (it.hasNext()) {
                val t = it.next()
                t.left -= dt
                if (t.left <= 0f) { try { t.fn() } catch (e: Exception) { android.util.Log.e("WHITE", "timer 异常", e) }; if (t.once) it.remove() else t.left = t.every }
            }
        }
    }

    class UiHost {
        private val buttons = mutableMapOf<String, Map<String, Any?>>()
        fun createButton(id: String, opts: Map<String, Any?>) { buttons[id] = opts; android.util.Log.i("WHITE", "[UI] 按钮 $id: $opts") }
        fun updateButton(id: String, patch: Map<String, Any?>) { buttons[id] = (buttons[id] ?: emptyMap()) + patch }
        fun removeButton(id: String) = buttons.remove(id)
        fun listButtons(): List<String> = buttons.keys.toList()
        fun openSettings(focusId: String?) { android.util.Log.i("WHITE", "[UI] 设置面板 focus=$focusId") }
    }

    class FileHost {
        private val base = "/storage/emulated/0/WHITE"
        private fun dir(type: String) = java.io.File("$base/${if (type == "saves") "存档" else "设置"}")
        fun list(type: String): List<String> = dir(type).list()?.toList() ?: emptyList()
        fun read(type: String, name: String): String = java.io.File(dir(type), name).readText()
        fun write(type: String, name: String, content: String, binary: Boolean) {
            val f = java.io.File(dir(type), name)
            f.parentFile?.mkdirs()
            f.writeText(content)
        }
    }

    class AudioHost {
        fun sfx(asset: String, volume: Float) { android.util.Log.i("WHITE", "[Audio] sfx $asset v=$volume") }
        fun bgm(asset: String, loop: Boolean) { android.util.Log.i("WHITE", "[Audio] bgm $asset loop=$loop") }
        fun stopAll() {}
    }

    class InputHost {
        private val gestures = mutableMapOf<String, MutableList<(Map<String, Float>) -> Unit>>()
        fun onGesture(type: String, cb: (Map<String, Float>) -> Unit) { gestures.getOrPut(type) { mutableListOf() }.add(cb) }
        fun dispatch(type: String, data: Map<String, Float>) = gestures[type]?.forEach { it(data) }
        fun vibrate(ms: Long) { android.util.Log.i("WHITE", "[Input] vibrate $ms") }
    }

    class SaveHost {
        private var state: Map<String, Any?> = mapOf("endings" to emptyList<String>())
        fun snapshot(): Map<String, Any?> = state
        fun restore(s: Map<String, Any?>) { state = s }
        fun exportTo(type: String, name: String) { android.util.Log.i("WHITE", "[Save] export $name") }
        fun registerMigrator(fn: (Int) -> Map<String, Any?>) { android.util.Log.i("WHITE", "[Save] migrator 注册") }
    }

    class KvStore {
        private val ns = mutableMapOf<String, MutableMap<String, String>>()
        fun get(namespace: String, k: String): String? = ns[namespace]?.get(k)
        fun put(namespace: String, k: String, v: String) { ns.getOrPut(namespace) { mutableMapOf() }[k] = v }
        fun keys(namespace: String): List<String> = ns[namespace]?.keys?.toList() ?: emptyList()
    }

    class ServiceRegistry {
        private val providers = mutableMapOf<String, (Array<Any?>) -> Any?>()   // "mod:名/服务"
        fun provide(mod: String, service: String, impl: (Array<Any?>) -> Any?) { providers["$mod/$service"] = impl }
        fun call(mod: String, service: String, args: Array<Any?>): Any? = providers["$mod/$service"]?.invoke(args)
    }

    class HttpHost {
        fun get(url: String): String = "TODO(M2)"
        fun post(url: String, body: String): String = "TODO(M2)"
    }

    // ---- 剧情层代理 (只读! 红线) ----
    class SceneProxy {
        var currentId: String = "intro"; private set
        fun jump(id: String, skip: Boolean) { currentId = id; android.util.Log.i("WHITE", "[Scene] jump→$id skip=$skip (M2: 转发 LogicHost 原版入口)") }
    }

    class DialogueObserver {
        fun currentLine(): Map<String, String> = mapOf("who" to "TODO", "text" to "TODO(M2)")   // 只读观察 LogicHost
        fun history(n: Int): List<Map<String, String>> = emptyList()
        fun skipTypewriter() { android.util.Log.i("WHITE", "[Dialogue] 快进") }
    }

    class ContentProxy {
        fun chapters(): List<String> = listOf("intro")   // 只读资源清单 (M2 读 content pack)
    }

    /**
     * LogicHost — 原版逻辑层托管 (M2)
     *
     * ⚠ 范围红线: 原版 JS 一个字节不改, 内核只提供只读桥 (console/emit/scene查询)
     * 线程模型 (v4.8.0 多核架构): QuickJS 全部操作在专用逻辑线程 (QJSLogic) 执行 —
     *   __gl 桥无返回值调用录制入 glCmdQueue, GL 线程帧首回放; 有返回值调用 latch 到
     *   GL 线程取真值 (先排空指令队列保证状态顺序)。tick 由逻辑线程 Choreographer
     *   (VSync) 驱动 — JS 解释与 GL 渲染双核并行, 互不饿死。
     * 输入/eval/音频事件等经 logicHandler.post 排队。
     */
    inner class LogicHost {

        // ═══ v4.8.0 多核架构: QuickJS 专用逻辑线程 ═══
        // QuickJS 上下文只在逻辑线程创建/访问; GL 线程只做渲染集合 (指令回放+合成+swap)。
        // tick 由逻辑线程的 Choreographer (VSync) 驱动, 自算 dt — 渲染与 JS 解耦后互不饿死。
        private val logicThread = android.os.HandlerThread("QJSLogic").also { it.start() }
        private val logicHandler = android.os.Handler(logicThread.looper)
        private var lastTickNs = 0L
        private var tickStarted = false
        private var tickAccNs = 0L; private var tickN = 0; private var pumpAcc = 0L

        // v4.9.1: 逻辑线程看门狗 — boot 脚本执行中静默死 (T83: SIGSEGV 无 tombstone) 时自动留线程栈尸检
        @Volatile private var lastProgressNs = 0L      // boot 脚本每加载/eval 一个更新
        @Volatile private var bootInProgress = false

        @Volatile private var qjs: QuickJSContext? = null
        @Volatile private var tickFnReady = false
        @Volatile private var touchFnReady = false
        @Volatile private var tickErrorsLogged = 0

        /** 输入泵: 主线程触摸事件 → 逻辑线程 (JS 所在线程) __onTouch(type,x,y) + 垫片 window 事件派发 */
        fun onTouch(type: String, x: Float, y: Float) {
            if (!touchFnReady) return
            logicHandler.post {
                try {
                    // 垫片事件层: window/document 的 touchstart/move/end 监听器 (若原版用 DOM 事件)
                    qjs?.evaluate("__shimDispatchInput && __shimDispatchInput('touch$type', $x, $y)")
                    // 原版契约: __onTouch(type,x,y)
                    qjs?.evaluate("__onTouch('$type', $x, $y)")
                    pumpJobs()
                } catch (e: Throwable) { FileLogger.w("LogicHost", "__onTouch 异常: ${e.message}") }
            }
        }

        /** v4.6.0: DOM 点击回桥 — WebView 按钮 → 按 eid 分发给垫片元素监听器 (逻辑线程) */
        fun domClick(eid: String) {
            FileLogger.w("LogicHost", "domClick 收到: '$eid'")   // v4.6.6 点击链诊断
            if (eid.isEmpty()) return
            logicHandler.post {
                try {
                    qjs?.evaluate("__shimDomClick && __shimDomClick('${eid.replace("'", "\\'")}')")
                    pumpJobs()
                } catch (e: Throwable) { FileLogger.w("LogicHost", "domClick 异常: ${e.message}") }
            }
        }

        /** v4.6.9: 音频事件回桥 — WebView 音频代理 → shim 派发 (ended/ready/retry; 逻辑线程) */
        fun onAudioEvent(type: String, data: String) {
            logicHandler.post {
                try {
                    val d = data.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
                    qjs?.evaluate("__shimAudioEvent && __shimAudioEvent('$type', '$d')")
                    pumpJobs()
                } catch (e: Throwable) { FileLogger.w("LogicHost", "onAudioEvent 异常: ${e.message}") }
            }
        }

        /**
         * v4.6.10: KT 大核 → JS 小核动画管线探测 (KtCore 每 3s 调用, 前 90s)
         * 询问 __introStatus() 快照: 模块加载计数/WL 挂载/canvas/audio 桥状态 — 结果写 07-动画日志
         */
        fun introProbe(n: Int) {
            logicHandler.post {
                try {
                    val r = qjs?.evaluate("(__introStatus && __introStatus()) || '\"探测接口未就绪\"'")
                    FileLogger.w("IntroLog", "KT探测#$n: $r")
                } catch (e: Throwable) { FileLogger.w("IntroLog", "KT探测#$n 异常: ${e.message}") }
            }
        }

        /**
         * 托管脚本链 (原版 index.html 加载顺序)
         * 每个脚本独立 try/catch — 浏览器行为对齐: 单个 <script> 报错不阻断后续脚本
         * v4.4.3: GL 上下文就绪前 boot 不得执行 — queueEvent 可先于 onSurfaceCreated 跑,
         *   无 EGL 上下文时 glCreateShader 全部无效 → shader 必败且 info log 全空 (4.4.2 实证)
         */
        @Volatile private var glContextReady = false
        private var pendingBoot: List<Pair<String, String>>? = null

        /** 渲染器 onSurfaceCreated (backend.init 完成) 后回调 — 触发延后的 boot + 启动 tick 循环 */
        fun onGlContextReady() {
            glContextReady = true
            startTickLoop()
            val p = pendingBoot
            if (p != null) { pendingBoot = null; boot(p) }
        }

        fun boot(scripts: List<Pair<String, String>>) {
            if (!glContextReady) {
                if (pendingBoot == null) FileLogger.w("LogicHost", "boot 延后: 等待 GL 上下文就绪 (${scripts.size - 1} 个脚本)")
                pendingBoot = scripts
                return
            }
            // v4.8.0: boot 迁逻辑线程 — shader 编译等同步 GL 调用经 latch 到 GL 线程执行
            bootInProgress = true; lastProgressNs = android.os.SystemClock.elapsedRealtimeNanos()
            logicHandler.post {
                // v4.8.1: KT 原生音频宿主 (音频线程) — 事件经 __shimAudioEvent 回派 shim
                com.white.engine.cores.audio.AudioHost.init(
                    { p -> resolveGameFile(p) },
                    { t, d -> this@WhiteEngine.logic.onAudioEvent(t, d) }
                )
                try {
                    val js = QuickJSContext.create()
                    val engineBridge = object : JsbBridge {
                        override fun log(level: String, msg: String) = FileLogger.w("LogicJS", "[$level] $msg")
                        override fun emit(event: String, data: String) { this@WhiteEngine.emit("logic.$event", data) }
                        override fun currentScene(): String = this@WhiteEngine.scene.currentId
                        override fun drawQuad(x: Double, y: Double, w: Double, h: Double, r: Double, g: Double, b: Double, a: Double) {
                            // v0.3.6 防护: 任何分量含 NaN/Infinity → 整条指令丢弃, 渲染队列绝不收脏数据
                            if (!(x.isFinite() && y.isFinite() && w.isFinite() && h.isFinite() && r.isFinite() && g.isFinite() && b.isFinite() && a.isFinite())) return
                            renderer.postRender { (renderer.backend as? com.white.engine.cores.gl.GlesBackend)?.pushQuad(x.toFloat(), y.toFloat(), w.toFloat(), h.toFloat(), r.toFloat(), g.toFloat(), b.toFloat(), a.toFloat()) }
                        }
                        override fun setClearColor(r: Double, g: Double, b: Double) {
                            if (!(r.isFinite() && g.isFinite() && b.isFinite())) return
                            renderer.postRender { renderer.backend.setClearColor(r.toFloat(), g.toFloat(), b.toFloat()) }
                        }
                        override fun screenWidth(): Double = renderer.surfaceWidth.toDouble()
                        override fun screenHeight(): Double = renderer.surfaceHeight.toDouble()
                        override fun cardPress(card: String) {
                            val c = card.uppercase().firstOrNull() ?: return
                            if (c in "RYGB") this@WhiteEngine.cardPress(c)
                        }
                        override fun vibrate(ms: Int) { this@WhiteEngine.input.vibrate(ms.toLong()) }
                        override fun saveRead(name: String): String = try { LOGIC_SAVE_DIR.resolve(name).readText() } catch (e: Exception) { "" }
                        override fun saveWrite(name: String, content: String) { try { LOGIC_SAVE_DIR.resolve(name).apply { parentFile?.mkdirs() }.writeText(content) } catch (e: Exception) { FileLogger.w("LogicHost", "存档写入失败: ${e.message}") } }
                        override fun saveList(): String = LOGIC_SAVE_DIR.list()?.joinToString(",") ?: ""
                        override fun readGameFile(path: String): String {
                            val f = resolveGameFile(path) ?: return GAME_FILE_MISS
                            return try { f.readText() } catch (e: Exception) { GAME_FILE_MISS }
                        }

                        override fun loadGameImage(path: String): Int {
                            val backend = renderer.backend as? com.white.engine.cores.gl.GlesBackend ?: return -1
                            val f = resolveGameFile(path) ?: return -1
                            return try {
                                // 先解边界: 超过 2048 的大图按 2 的幂降采样 (防 OOM / 超纹理上限)
                                val bounds = android.graphics.BitmapFactory.Options().apply { inJustDecodeBounds = true }
                                android.graphics.BitmapFactory.decodeFile(f.canonicalPath, bounds)
                                if (bounds.outWidth <= 0 && bounds.outHeight <= 0) return -1
                                var sample = 1
                                while (bounds.outWidth / sample > 2048 || bounds.outHeight / sample > 2048) sample *= 2
                                val bmp = android.graphics.BitmapFactory.decodeFile(f.canonicalPath,
                                    android.graphics.BitmapFactory.Options().apply { inSampleSize = sample })
                                if (bmp != null) backend.loadTexture(bmp) else -1
                            } catch (e: Throwable) { -1 }
                        }

                        override fun imageSize(texId: Int): String {
                            return (renderer.backend as? com.white.engine.cores.gl.GlesBackend)?.textureSize(texId) ?: "0,0"
                        }

                        override fun loadImageB64(b64: String): Int {
                            val backend = renderer.backend as? com.white.engine.cores.gl.GlesBackend ?: return -1
                            return try {
                                val bytes = java.util.Base64.getDecoder().decode(b64)
                                val bmp = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.size) ?: return -1
                                backend.loadTexture(bmp)
                            } catch (e: Throwable) { -1 }
                        }

                        override fun drawImage(texId: Int, x: Double, y: Double, w: Double, h: Double, u0: Double, v0: Double, u1: Double, v1: Double, alpha: Double) {
                            // NaN/∞ 整条丢弃 (同 drawQuad 防护策略)
                            if (texId <= 0) return
                            if (!(x.isFinite() && y.isFinite() && w.isFinite() && h.isFinite() && u0.isFinite() && v0.isFinite() && u1.isFinite() && v1.isFinite() && alpha.isFinite())) return
                            renderer.postRender { (renderer.backend as? com.white.engine.cores.gl.GlesBackend)?.drawTexture(texId, x.toFloat(), y.toFloat(), w.toFloat(), h.toFloat(), u0.toFloat(), v0.toFloat(), u1.toFloat(), v1.toFloat(), alpha.toFloat()) }
                        }

                        // ── v4.5.1 CPU 位图画布桥 ──
                        override fun canvasCreate(w: Int, h: Int): Int = com.white.engine.cores.gl.CanvasSurfaces.create(w, h)
                        override fun canvasResize(id: Int, w: Int, h: Int): Boolean = com.white.engine.cores.gl.CanvasSurfaces.resize(id, w, h)
                        override fun canvasDraw(cid: Int, srcTexId: Int, sx: Int, sy: Int, sw: Int, sh: Int, dx: Int, dy: Int, dw: Int, dh: Int, alpha: Double): Boolean {
                            val backend = renderer.backend as? com.white.engine.cores.gl.GlesBackend ?: return false
                            val src = backend.bitmapOf(srcTexId) ?: return false
                            return com.white.engine.cores.gl.CanvasSurfaces.drawTex(cid, src, sx, sy, sw, sh, dx.toFloat(), dy.toFloat(), dw.toFloat(), dh.toFloat(), alpha.toFloat())
                        }
                        override fun canvasFillRect(cid: Int, x: Int, y: Int, w: Int, h: Int, r: Double, g: Double, b: Double, a: Double): Boolean =
                            com.white.engine.cores.gl.CanvasSurfaces.fillRect(cid, x.toFloat(), y.toFloat(), w.toFloat(), h.toFloat(), r.toFloat(), g.toFloat(), b.toFloat(), a.toFloat())
                        override fun canvasClearRect(cid: Int, x: Int, y: Int, w: Int, h: Int): Boolean =
                            com.white.engine.cores.gl.CanvasSurfaces.clearRect(cid, x.toFloat(), y.toFloat(), w.toFloat(), h.toFloat())
                        override fun canvasPixelsB64(cid: Int): String = com.white.engine.cores.gl.CanvasSurfaces.pixelsB64(cid)
                        override fun canvasPixelsB64Z(cid: Int): String = com.white.engine.cores.gl.CanvasSurfaces.pixelsB64Z(cid)
                        override fun canvasRegionB64(cid: Int, x: Int, y: Int, w: Int, h: Int): String =
                            com.white.engine.cores.gl.CanvasSurfaces.regionB64(cid, x, y, w, h)
                        override fun canvasPutImageB64(cid: Int, b64: String, dx: Int, dy: Int, w: Int, h: Int): Boolean {
                            val bytes = try { java.util.Base64.getDecoder().decode(b64) } catch (e: Throwable) { return false }
                            return com.white.engine.cores.gl.CanvasSurfaces.putImage(cid, bytes, dx, dy, w, h)
                        }
                        override fun canvasToTexture(cid: Int): Int {
                            val backend = renderer.backend as? com.white.engine.cores.gl.GlesBackend ?: return -1
                            // v4.8.0: 调用方已迁逻辑线程 — 读像素上传与逻辑线程写位图互斥
                            return com.white.engine.cores.gl.CanvasSurfaces.locked {
                                val bmp = com.white.engine.cores.gl.CanvasSurfaces.bitmap(cid) ?: return -1
                                backend.loadTextureSync(bmp)
                            }
                        }
                        override fun canvasDestroy(id: Int) = com.white.engine.cores.gl.CanvasSurfaces.destroy(id)
                        // ── v4.6.0: DOM UI 镜像 + 屏幕合成层 ──
                        override fun domSync(html: String) { this@WhiteEngine.domUi?.sync(html) }
                        override fun canvasScreenLayer(name: String, cid: Int) { renderer.screenLayers[name] = cid }
                        // ── v4.8.1: 音频指令桥 — KT 原生优先 (AudioHost), 失败回退 WebView WebAudio ──
                        override fun audioCmd(json: String): String {
                            if (!com.white.engine.cores.audio.AudioHost.dispatch(json)) this@WhiteEngine.domUi?.audio(json)
                            return ""
                        }
                        // ── v4.6.10: 动画管线专属日志 (intro 模块/WL 挂载/canvas/audio 事件归集) ──
                        override fun introLog(text: String) { FileLogger.w("IntroLog", text) }
                    }
                    // v4.4.5: 换 HarlonWang 绑定 — 反射桥接 (cashapp 的接口绑定限制全解除)
                    bindObject(js, "__engine", engineBridge, mode = "LATCH_RET")
                    // v4.8.0 多核: WebGL2 直通桥 (__gl) — 无返回值调用录制回放, 同步查询 latch 到 GL 线程
                    val glBridge = com.white.engine.cores.gl.GlBridge(renderer)
                    bindObject(js, "__gl", glBridge, mode = "GL_QUEUE")
                    bindGlBatch(js, glBridge)
                    qjs = js
                    // M2.3: 浏览器环境垫片先于任何脚本挂载 (console/timers/rAF/URL/localStorage/DOM占位)
                    val shim = this@WhiteEngine.context.assets.open("logic/shim.js").bufferedReader().use { it.readText() }
                    js.evaluate(shim, "shim.js")
                    // 原版脚本链: 按序求值, 单脚本失败不阻断
                    // v4.5.3: 字节码预编译缓存 — compile() 一次存盘, 之后启动 execute(byte[]) 跳过解析
                    // (white-engine.js 1.3MB 解析 ~1.2s → 字节码加载 ~0.1s); 缓存按 versionName 隔离, 升级自动失效
                    val bcRoot = java.io.File(this@WhiteEngine.context.filesDir,
                        "jbcache/" + (this@WhiteEngine.context.packageManager.getPackageInfo(this@WhiteEngine.context.packageName, 0).versionName ?: "v"))
                    for ((name, src) in scripts) {
                        val t0 = android.os.SystemClock.elapsedRealtime()
                        try {
                            var loaded = false
                            if (src.length >= 50_000) {   // 小脚本编译开销不划算, 直接源码求值
                                try {
                                    val f = java.io.File(bcRoot, name.replace('/', '_') + ".qjsb")
                                    if (f.canonicalPath.startsWith(bcRoot.canonicalPath) && f.exists() && f.length() > 0) {
                                        js.execute(f.readBytes())
                                        loaded = true
                                        FileLogger.w("LogicHost", "脚本 $name 字节码直载 (${android.os.SystemClock.elapsedRealtime() - t0}ms, ${f.length() / 1024}KB)")
                                    }
                                } catch (bcFail: Throwable) {
                                    FileLogger.w("LogicHost", "脚本 $name 字节码加载失败, 回退源码: ${bcFail.message}")
                                    loaded = false
                                }
                                if (!loaded) {
                                    js.evaluate(src, name)
                                    try {
                                        val f = java.io.File(bcRoot, name.replace('/', '_') + ".qjsb")
                                        f.parentFile?.mkdirs()
                                        val bc = js.compile(src)
                                        if (bc != null && bc.size > 0) { f.writeBytes(bc); loaded = true }
                                        FileLogger.w("LogicHost", "脚本 $name 已编译缓存 (${(bc?.size ?: 0) / 1024}KB 字节码)")
                                    } catch (cFail: Throwable) {
                                        FileLogger.w("LogicHost", "脚本 $name 字节码编译失败 (不影响运行): ${cFail.message}")
                                    }
                                }
                            } else {
                                js.evaluate(src, name)
                            }
                            if (!loaded || src.length < 50_000)
                                FileLogger.w("LogicHost", "脚本 $name 已加载 (${android.os.SystemClock.elapsedRealtime() - t0}ms, ${src.length / 1024}KB)")
                        } catch (e: Throwable) {
                            FileLogger.w("LogicHost", "!! 脚本 $name 失败: ${deepDesc(e)}")
                            e.stackTrace.take(4).forEach { FileLogger.w("LogicHost", "    at $it") }
                            // T86-C: JS 侧异常消息也要落地 (QuickJS 异常的 stack/message 才是真凶口供)
                            try {
                                val jsErr = js.evaluate("globalThis.__lastBootErr === undefined ? '(无 JS 异常快照)' : __lastBootErr") as? String
                                FileLogger.w("LogicHost", "!! 脚本 $name JS侧: $jsErr")
                            } catch (ignored: Throwable) {}
                        }
                        lastProgressNs = android.os.SystemClock.elapsedRealtimeNanos()   // 看门狗: 脚本进度
                        com.white.engine.core.BlackBox.beat("小核JS", "boot:$name")
                    }
                    bootInProgress = false
                    lastProgressNs = android.os.SystemClock.elapsedRealtimeNanos()
                    val hasTick = (js.evaluate("typeof __tick === 'function' ? '1' : '0'") as? String) == "1"
                    tickFnReady = hasTick
                    touchFnReady = (js.evaluate("typeof __onTouch === 'function' ? '1' : '0'") as? String) == "1"
                    if (touchFnReady) FileLogger.w("LogicHost", "逻辑层已挂载 __onTouch (输入泵接通)")
                    FileLogger.w("LogicHost", "逻辑层已托管: ${scripts.size} 个脚本 (tick挂载=${if (hasTick) "√" else "×"})")
                    // v4.4.5: 排空 boot 期间积压的 promise job (loadEmbeddedAssets 等 async bootstrap)
                    val pumped = pumpJobs()
                    FileLogger.w("LogicHost", "boot 后微任务泵: $pumped 个 job 已执行")
                    this@WhiteEngine.emit("logic.ready", scripts.lastOrNull()?.first ?: "")
                    // v4.6.4: 模组真执行 — 逻辑层就绪后注入 WHITE/MODS/*.js (关联按钮/DAT 存档恢复)
                    if (this@WhiteEngine::modHost.isInitialized) modHost.evalAll()
                } catch (e: Throwable) {
                    FileLogger.w("LogicHost", "!! 逻辑层启动失败: ${deepDesc(e)}")
                    e.stackTrace.take(10).forEach { FileLogger.w("LogicHost", "    at $it") }
                }
            }
        }

        // ═══ v4.9.1: 逻辑线程看门狗 ═══
        // T83 教训: boot 脚本执行中静默死/挂死, 无 tombstone 无日志 — 定时体检:
        // boot 超 30s 无脚本进度, 或 tick 循环启动后 8s 无帧 → 打出逻辑线程完整栈 (尸检报告)
        private var watchdogStarted = false
        private fun startWatchdog() {
            if (watchdogStarted) return
            watchdogStarted = true
            Thread {
                while (true) {
                    Thread.sleep(5_000)
                    try {
                        val now = android.os.SystemClock.elapsedRealtimeNanos()
                        val stallMs = (now - lastProgressNs) / 1_000_000
                        if (bootInProgress && stallMs > 30_000) {
                            FileLogger.w("Watchdog", "!! boot 卡死 ${stallMs / 1000}s 无脚本进度 — 逻辑线程栈:")
                            dumpLogicStack()
                            lastProgressNs = now   // 只报一次, 除非又有进度
                        }
                        if (tickStarted && !bootInProgress && lastTickNs > 0) {
                            val idleMs = (now - lastTickNs) / 1_000_000
                            if (idleMs > 8_000) {
                                FileLogger.w("Watchdog", "!! tick 循环 ${idleMs / 1000}s 无帧 — 逻辑线程栈:")
                                dumpLogicStack()
                                lastTickNs = now
                            }
                        }
                    } catch (ignored: Throwable) {}
                }
            }.apply { isDaemon = true; name = "white-logic-watchdog"; priority = Thread.MIN_PRIORITY; start() }
        }
        private fun dumpLogicStack() {
            try { logicThread.stackTrace.take(30).forEach { FileLogger.w("Watchdog", "    at $it") } }
            catch (e: Throwable) { FileLogger.w("Watchdog", "栈获取失败: ${e.message}") }
        }

        // ═══ v4.8.0: tick 已从 GL 线程迁出 — 逻辑线程 Choreographer (VSync) 驱动 ═══

        /** 启动 tick 循环 (幂等): 逻辑线程上挂 Choreographer 帧回调, 自算 dt */
        fun startTickLoop() {
            if (tickStarted) return
            tickStarted = true
            startWatchdog()
            logicHandler.post {
                CpuAffinity.pin(big = false)   // 逻辑解释线程 → 小核
                lastTickNs = android.os.SystemClock.elapsedRealtimeNanos()
                val ch = android.view.Choreographer.getInstance()
                val cb = object : android.view.Choreographer.FrameCallback {
                    override fun doFrame(frameTimeNanos: Long) {
                        val now = android.os.SystemClock.elapsedRealtimeNanos()
                        var dt = (now - lastTickNs) / 1_000_000_000f
                        lastTickNs = now
                        if (dt <= 0f || dt > 0.25f) dt = 0.016f   // 跳变防护 (休眠恢复/卡顿)
                        val t0 = android.os.SystemClock.elapsedRealtimeNanos()
                        runTick(dt)
                        val t1 = android.os.SystemClock.elapsedRealtimeNanos()
                        tickAccNs += t1 - t0; tickN++
                        if (tickN >= 10) {
                            FileLogger.w("PerfLogic", "tick 分解(每帧均值 x$tickN): jsTick=%.1fms pump=%.0f".format(tickAccNs / 1_000_000.0 / tickN, pumpAcc.toDouble() / tickN))
                            tickAccNs = 0; tickN = 0; pumpAcc = 0
                        }
                        ch.postFrameCallback(this)
                    }
                }
                ch.postFrameCallback(cb)
                FileLogger.w("LogicHost", "tick 循环已启动 (逻辑线程 VSync 驱动)")
            }
        }

        /** 单次 tick: 推进调度器 + 跑 __tick + 排微任务 (仅逻辑线程); dt 乘 speed 倍率对齐原版语义 */
        private fun runTick(dt: Float) {
            try { sched.tick(dt * speed) } catch (e: Throwable) { FileLogger.w("LogicHost", "sched.tick 异常: ${e.message}") }
            if (!tickFnReady) return
            val scaled = dt * speed
            try { qjs?.evaluate("__tick($scaled)"); pumpAcc += pumpJobs() }
            catch (e: Throwable) {
                if (tickErrorsLogged++ < 3) FileLogger.w("LogicHost", "__tick 异常: ${e.message}")
            }
            com.white.engine.core.BlackBox.beat("小核JS", "tick=$tickN")
        }

        fun eval(script: String, onResult: ((Any?) -> Unit)? = null) {
            logicHandler.post {
                val r = try { qjs?.evaluate(script)?.also { pumpJobs() } } catch (e: Throwable) {
                    FileLogger.w("LogicHost", "eval 异常: ${e.message}"); null
                }
                onResult?.invoke(r)
            }
        }

        /**
         * v4.6.4: 模组真执行 — 模组 JS 注入与游戏同一 QuickJS 上下文
         * (模组可用 shim DOM 注入关联按钮; WHITE_NATIVE 原生桥读写存档/受限 shell)
         * 单模组失败不阻断其他模组。
         */
        fun evalMods(sources: List<Pair<String, String>>, bridge: Any) {
            logicHandler.post {
                val js = qjs ?: return@post
                try {
                    bindObject(js, "__modNative", bridge)
                    // 预置: 挂 WHITE_NATIVE 全局 + 把 WHITE_API.bash 重定向到原生 shell (native 版无 Node 后端)
                    js.evaluate(
                        "(function(){window.WHITE_NATIVE=__modNative;" +
                        // ABI 2.0: 对话覆写助手 — 官方 white-edits 机制的正道封装
                        "WHITE_NATIVE.edits={read:function(){try{return JSON.parse(WHITE_NATIVE.editsRead());}catch(e){return {kind:'white-edits',lines:{}};}}," +
                        "writeLines:function(lines){var cur=WHITE_NATIVE.edits.read();for(var k in lines){cur.lines=cur.lines||{};cur.lines[k]=lines[k];}cur.kind='white-edits';return WHITE_NATIVE.editsWrite(JSON.stringify(cur));}," +
                        "reset:function(){return WHITE_NATIVE.editsWrite(JSON.stringify({kind:'white-edits',lines:{}}));}};" +
                        // ABI 2.0: 游戏文件系统 (底层全开放 — 读写任意剧情/对话/配置文件, 自动备份)
                        "WHITE_NATIVE.game={list:function(p){try{return JSON.parse(WHITE_NATIVE.gameList(p||''));}catch(e){return [];}},read:function(p){return WHITE_NATIVE.gameRead(p);},write:function(p,c){return WHITE_NATIVE.gameWrite(p,c);}};" +
                        "if(window.WHITE_API){WHITE_API.bash={exec:function(c){try{return Promise.resolve({code:0,out:String(WHITE_NATIVE.bash(c||''))});}catch(e){return Promise.reject(e);}}," +
                        "sync:function(){return Promise.resolve({code:0});}};}" +
                        "try{var A=JSON.parse(WHITE_NATIVE.abi());console.log('[WHITE] 原生模组桥已挂载 (ABI '+A.abi+', 能力: '+A.caps.join('/')+')');}catch(e){console.log('[WHITE] 原生模组桥已挂载');}" +
                        "})();",
                        "mod-prelude.js")
                    for ((name, src) in sources) {
                        try {
                            js.evaluate("(function(){\n" + src + "\n})();", "mod:$name")
                            FileLogger.w("ModHost", "模组 $name 已执行")
                        } catch (e: Throwable) {
                            FileLogger.w("ModHost", "!! 模组 $name 执行失败: ${e.message}")
                        }
                    }
                    pumpJobs()
                } catch (e: Throwable) { FileLogger.w("ModHost", "evalMods 异常: ${e.message}") }
            }
        }

        /**
         * v4.4.5: 微任务泵 — 黑屏最终根因修复
         * cashapp quickjs-android 的 evaluate 从不执行 promise job → 引擎 async bootstrap
         * (await img.decode() 等) 的续体永远悬死, Renderer 永远创建不出来。
         * HarlonWang wrapper 暴露 executePendingJob, boot 后 + 每帧 tick 后主动排空。
         */
        private fun pumpJobs(): Int {
            val j = qjs ?: return 0
            var n = 0
            try { while (j.executePendingJob() > 0) { if (++n >= 20000) break } }
            catch (e: Throwable) { FileLogger.w("LogicHost", "微任务泵异常: ${e.message}") }
            return n
        }

        /**
         * v4.4.5: 反射桥接 — 把 Kotlin 对象的 public 方法绑为 JS 对象方法
         * (替代 cashapp 接口绑定: 无类型白名单, 无 byte[] 限制; 参数仅支持 Int/Double/Boolean/String)
         *
         * v4.8.0 多核架构: QuickJS 迁到专用逻辑线程, 桥调用按模式分流:
         *  · DIRECT    — 原行为: JS 线程内联执行 (仅限纯 CPU/线程安全桥)
         *  · LATCH_RET — __engine: 无返回值方法内联执行 (CPU 位图/DOM/音频, 本就线程安全);
         *                有返回值且触及 GL 的方法 (loadGameImage/imageSize/loadImageB64/canvasToTexture)
         *                latch 到 GL 线程取真值
         *  · GL_QUEUE  — __gl: 无返回值调用录制 lambda 入 glCmdQueue, GL 线程帧首回放 (零等待);
         *                有返回值调用 latch 到 GL 线程, 且先排空指令队列保证状态顺序
         */
        // T86-C: 异常深度解包 — QuickJS 桥的 InvocationTargetException.message=null 把真凶吞成 "失败: null",
        // T86-B 渲染黑屏就是 white-engine.js 顶层求值失败但日志只有 "null", 定位全靠猜
        private fun deepDesc(e: Throwable, depth: Int = 0): String {
            val sb = StringBuilder()
            var cur: Throwable? = e
            var d = 0
            while (cur != null && d < 5) {
                sb.append(if (d == 0) "" else " ← cause ").append(cur.javaClass.simpleName).append(": ").append(cur.message)
                cur = cur.cause; d++
            }
            return sb.toString()
        }

        private fun bindObject(js: QuickJSContext, name: String, target: Any, mode: String = "DIRECT") {
            val holder = js.parseJSON("{}") as JSObject
            val latchSet = if (mode == "LATCH_RET") setOf("loadGameImage", "imageSize", "loadImageB64", "canvasToTexture") else emptySet()
            // T87: 位图串行集 — 触碰 Skia 位图/CanvasSurfaces 的方法, 无论有无返回值一律 latch 到 GL 大核执行。
            // 背景: canvasDraw/canvasFillRect 等原为逻辑线程直调 (DIRECT), 小核写 Skia 位图的同时
            // 大核每帧 drawTexture 读同一位图 = Skia 并发读写。同一死点两种死法:
            //   T86-A (批量通道开, 时序错位) → SIGSEGV 全进程死;
            //   T86-B (直连, 时序复原) → Skia 内部状态坏 → KT 抛异常 → white-engine.js 顶层求值失败 → 黑屏。
            // 根治 = 这族调用全部串行到大核, 与渲染互斥。
            val glSerialSet = if (mode == "LATCH_RET") setOf(
                "canvasCreate", "canvasResize", "canvasDraw", "canvasFillRect", "canvasClearRect",
                "canvasPixelsB64", "canvasPixelsB64Z", "canvasRegionB64", "canvasPutImageB64",
                "canvasToTexture", "canvasDestroy", "canvasScreenLayer") else emptySet()
            for (m in target.javaClass.declaredMethods) {
                if (java.lang.reflect.Modifier.isStatic(m.modifiers) || m.isSynthetic) continue
                if (m.parameterTypes.any { it !in arrayOf(
                        java.lang.Integer::class.javaPrimitiveType, java.lang.Double::class.javaPrimitiveType,
                        java.lang.Boolean::class.javaPrimitiveType, java.lang.String::class.java) }) continue
                m.isAccessible = true
                val ptypes = m.parameterTypes
                val marshal = { args: Array<Any?> ->
                    val a = arrayOfNulls<Any?>(ptypes.size)
                    for (i in ptypes.indices) {
                        val v = args.getOrNull(i)
                        a[i] = when (ptypes[i]) {
                            java.lang.Integer::class.javaPrimitiveType -> (v as? Number)?.toInt() ?: 0
                            java.lang.Double::class.javaPrimitiveType -> (v as? Number)?.toDouble() ?: 0.0
                            java.lang.Boolean::class.javaPrimitiveType -> v as? Boolean ?: false
                            else -> v?.toString() ?: ""
                        }
                    }
                    a
                }
                val isVoid = m.returnType == Void.TYPE
                if (mode == "GL_QUEUE" && isVoid) {
                    // 无返回值 GL 调用 → 录制入队, GL 线程帧首回放 (热路径零跨线程等待)
                    holder.setProperty(m.name, JSCallFunction { args ->
                        com.white.engine.core.BlackBox.beat("小核JS", "GL队列:${m.name}")   // T86 逐调用心跳
                        val a = marshal(args)
                        glCmdQueue.add { m.invoke(target, *a) }
                        null
                    })
                    continue
                }
                if ((mode == "GL_QUEUE") || (mode == "LATCH_RET" && (m.name in glSerialSet || (!isVoid && m.name in latchSet)))) {
                    // 有返回值 GL 调用 / T87 位图串行调用 → latch 到 GL 线程取真值; 先排空队列保证状态顺序
                    holder.setProperty(m.name, JSCallFunction { args ->
                        com.white.engine.core.BlackBox.beat("小核JS", "latch:${m.name}")   // T86 逐调用心跳
                        val a = marshal(args)
                        var result: Any? = null
                        val latch = java.util.concurrent.CountDownLatch(1)
                        renderer.glRun {
                            com.white.engine.core.BlackBox.beat("大核GL", "执行:${m.name}")
                            result = try { flushGlCmds(); m.invoke(target, *a) } catch (e: Throwable) {
                                FileLogger.w("LogicHost", "GL 同步查询异常 ${m.name}: ${deepDesc(e)}"); null
                            }
                            latch.countDown()
                        }
                        try {
                            if (!latch.await(3, java.util.concurrent.TimeUnit.SECONDS))
                                FileLogger.w("LogicHost", "GL 同步查询超时 ${m.name} (3s)")
                        } catch (e: InterruptedException) { }
                        result
                    })
                    continue
                }
                // DIRECT (或 LATCH_RET 的非 GL 方法): 内联执行 (原逻辑)
                holder.setProperty(m.name, JSCallFunction { args ->
                    com.white.engine.core.BlackBox.beat("小核JS", "直调:${m.name}")   // T86 逐调用心跳
                    val a = marshal(args)
                    try {
                        m.invoke(target, *a)
                    } catch (e: Throwable) {
                        // T86-C: 真异常落地日志 (cause 链解包), 再原样抛回 JS — 不再让 "null" 掩尸
                        FileLogger.w("LogicHost", "!! 桥方法 $name.${m.name} 抛异常: ${deepDesc(e)}")
                        e.stackTrace.take(6).forEach { FileLogger.w("LogicHost", "    at $it") }
                        throw e
                    }
                })
            }
            js.getGlobalObject().setProperty(name, holder)
            FileLogger.w("LogicHost", "桥已绑定: $name mode=$mode (${holder.getProperty(name) != null})")
        }

        /**
         * v4.9.0: GL 批量通道 — 小核(逻辑线程)每帧一次跨核传输, 本端(逻辑线程)解析入队, GL 大核帧首回放。
         *
         * 核间合并语义 (v4.8 多核架构不变式):
         *  · shim 侧把一帧内所有"纯数值无返回值" GL 调用录成扁平段 [op, argc, args...]*;
         *  · 帧尾 (shim __tick 末尾) 一次 E2raw.batch(csv) → 本方法 → 逐条 lambda 入 glCmdQueue;
         *  · 与逐调用录制 (bindObject GL_QUEUE) 共用同一队列 → 全序与 JS 发起顺序一致;
         *  · 有返回值查询 (KT latch) 先排空队列 → 状态不乱序; shim 直通调用前也先 flush — 三重保序。
         *
         * 协议契约: op = BATCH_METHODS 数组下标, 与 shim.js batchOps **严格同序** (两端唯一共享契约);
         *          argc 随流携带; 参数类型按 GlBridge Method 反射封送 (Int/Double/Boolean) —
         *          新增/调整批量方法时只需两端各加一个名字, 个数与类型不用手抄。
         */
        private fun bindGlBatch(js: QuickJSContext, glBridge: com.white.engine.cores.gl.GlBridge) {
            val BATCH_METHODS = arrayOf(
                "viewport", "useProgram", "bindBuffer", "bindFramebuffer", "bindTexture", "bindRenderbuffer",
                "bindVertexArray", "activeTexture", "texParam", "enableVertexAttribArray", "disableVertexAttribArray",
                "vertexAttribPointer", "enable", "disable", "blendFunc", "blendEquation", "clearColor", "clear",
                "depthFunc", "cullFace", "frontFace", "generateMipmap", "drawArrays", "drawElements",
                "framebufferTexture2D", "framebufferRenderbuffer", "renderbufferStorageMultisample", "texStorage2D",
                "uniform1i", "uniform1f", "uniform2f", "uniform3f", "uniform4f", "uniformMatrix4n")
            val methods = BATCH_METHODS.map { name ->
                glBridge.javaClass.declaredMethods.firstOrNull { it.name == name }?.also { it.isAccessible = true }
                    ?: throw IllegalStateException("bindGlBatch: GlBridge 缺方法 '$name' — 与 shim.js batchOps 不同步!")
            }
            val holder = js.getGlobalObject().getProperty("__gl") as? JSObject
            if (holder == null) { FileLogger.w("LogicHost", "bindGlBatch: __gl 未绑定, 批量通道未启用"); return }
            var batchAcc = 0L; var batchN = 0L
            holder.setProperty("batch", JSCallFunction { args ->
                val csv = args.getOrNull(0)?.toString() ?: return@JSCallFunction null
                val toks = csv.split(',')
                var i = 0
                while (i < toks.size) {
                    val op = toks[i++].toIntOrNull() ?: break
                    val argc = toks[i++].toIntOrNull() ?: break
                    val m = methods.getOrNull(op)
                    if (m == null || i + argc > toks.size) { i += argc; continue }
                    val ptypes = m.parameterTypes
                    val a = arrayOfNulls<Any?>(argc)
                    for (k in 0 until argc) {
                        val s = toks[i + k]
                        a[k] = when (ptypes[k]) {
                            java.lang.Double::class.javaPrimitiveType -> s.toDoubleOrNull() ?: 0.0
                            java.lang.Boolean::class.javaPrimitiveType -> s != "0"
                            else -> s.toIntOrNull() ?: 0
                        }
                    }
                    i += argc
                    val mm = m
                    glCmdQueue.add { mm.invoke(glBridge, *a) }
                }
                batchAcc += toks.size / 2; batchN++
                if (batchN >= 300) {
                    FileLogger.w("PerfBatch", "批量通道(300帧均值): ${(batchAcc / batchN).toInt()} 指令/帧 → 1 次跨核")
                    batchAcc = 0; batchN = 0
                }
                null
            })
            FileLogger.w("LogicHost", "GL 批量通道 KT 端已挂载 (${BATCH_METHODS.size} ops) — 启用与否以 shim 端 GL_BATCH_CHANNEL 为准 (T87 默认直连)")
        }

        fun shutdown() {
            logicHandler.post { try { qjs?.destroyContext() } catch (ignored: Throwable) {}; qjs = null; tickFnReady = false }
            FileLogger.w("LogicHost", "逻辑层已卸载")
        }
    }
}
