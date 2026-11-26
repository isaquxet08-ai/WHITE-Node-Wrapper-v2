package com.white.engine

import android.os.Bundle
import android.app.Activity
import android.Manifest
import android.os.Build
import android.opengl.GLSurfaceView
import com.white.engine.core.WhiteEngine
import com.white.engine.core.KeepService
import com.white.engine.core.FileLogger
import com.white.engine.core.LogcatCapture
import com.white.engine.cores.mod.ModHost
import android.content.Intent

/**
 * 原生引擎入口 — 单 Activity + 单 GLSurfaceView
 * 对比网页版: 没有 30 个 canvas, 没有合成器开销, 渲染路径只有一条
 * 注意: 用平台 Activity (不用 AppCompatActivity) — 全屏 GL 游戏不需要 AndroidX,
 * 且规避了 Theme.AppCompat 校验闪退 (v0.1.0 的首崩原因)
 */
class MainActivity : Activity() {

    private lateinit var glView: GLSurfaceView

    private var domSyncN = 0   // v4.7.8: DOM 镜像留痕计数
    private var domWebView: android.webkit.WebView? = null
    private lateinit var engine: WhiteEngine

    /**
     * v4.6.0: DOM UI 镜像层
     * dom-view.html 放进 filesDir/game/ (与 index.html 同级, 相对引用 app/game.css + 真字体)。
     * WhiteDom JS 桥: input(原始触摸→输入泵) / click(eid→__shimDomClick)。
     * engine.domUi: shim domSync(html) → UI 线程 evaluateJavascript 注入 innerHTML。
     */
    private fun setupDomUi(below: android.view.View) {
        try {
            // 镜像页就位 — v4.6.2: 放独立目录 files/dom/ (game/ 会被版本重解压清空,
            // v4.6.1 首启即 ERR_FILE_NOT_FOUND)。写盘时注入 <base> 绝对路径指向 files/game/,
            // CSS/字体/logo 相对引用全部经由 base 解析到解压目录。
            val domDir = java.io.File(filesDir, "dom")
            domDir.mkdirs()
            val page = java.io.File(domDir, "dom-view.html")
            val gameDirAbs = "file://" + java.io.File(filesDir, "game").absolutePath + "/"
            // v4.6.3: game.css 内联 — WebView 从 file:// 相对加载 CSS 失败导致整站裸样式;
            // 字体 url(../assets/...) 替换为绝对路径, 手写体随 CSS 内联一并生效
            val css = assets.open("game/app/game.css").use { it.readBytes().toString(Charsets.UTF_8) }
                .replace("url(../", "url($gameDirAbs")
            assets.open("logic/dom-view.html").use { i ->
                val html = i.readBytes().toString(Charsets.UTF_8)
                val proxyJs = try { assets.open("logic/audio-proxy.js").use { it.readBytes().toString(Charsets.UTF_8) } } catch (e: Throwable) { "" }
                page.writeText(html
                    .replace("__GAME_CSS__", css)
                    .replace("__AUDIO_PROXY__", proxyJs)
                    .replace("__GAME_DIR_ABS__", gameDirAbs))
            }

            val wv = android.webkit.WebView(this)
            wv.setBackgroundColor(android.graphics.Color.TRANSPARENT)
            wv.settings.apply {
                javaScriptEnabled = true
                allowFileAccess = true
                allowFileAccessFromFileURLs = true
                allowUniversalAccessFromFileURLs = true
                mediaPlaybackRequiresUserGesture = false
                useWideViewPort = true
                loadWithOverviewMode = true
                cacheMode = android.webkit.WebSettings.LOAD_NO_CACHE
            }
            wv.isHorizontalScrollBarEnabled = false; wv.isVerticalScrollBarEnabled = false
            wv.addJavascriptInterface(object : Any() {
                @android.webkit.JavascriptInterface
                fun input(type: String, x: Float, y: Float) {
                    // CSS px → 物理像素: ×density (GL surface 与 view 同尺寸)
                    val d = resources.displayMetrics.density
                    engine.logic.onTouch(type, x * d, y * d)
                }
                @android.webkit.JavascriptInterface
                fun click(eid: String) = engine.logic.domClick(eid)
                @android.webkit.JavascriptInterface
                fun audioEvent(type: String, data: String) = engine.logic.onAudioEvent(type, data)   // v4.6.9
            }, "WhiteDom")
            val root = android.widget.FrameLayout(this)
            root.addView(below)
            root.addView(wv, android.widget.FrameLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT, android.view.ViewGroup.LayoutParams.MATCH_PARENT))
            setContentView(root)
            domWebView = wv

            // shim domSync → UI 线程注入 (GL 线程调用方)
            engine.domUi = object : com.white.engine.core.DomUiSink {
                override fun ready() = true
                override fun sync(html: String) {
                    // v4.7.8: DOM 镜像 KT 侧留痕 (前3次 + 每50次) — 确认 JS→KT→WebView 链通
                    domSyncN++
                    if (domSyncN <= 3 || domSyncN % 50 == 0) {
                        FileLogger.w("DomUi", "sync#${domSyncN} ${html.length}B → WebView __setDom")
                    }
                    val esc = org.json.JSONObject.quote(html)   // JSON 字符串安全转义
                    runOnUiThread { wv.evaluateJavascript("window.__setDom && window.__setDom($esc)", null) }
                }
                // v4.6.9: 音频指令 → WebView 真 WebAudio 执行
                override fun audio(json: String) {
                    val esc = org.json.JSONObject.quote(json)
                    runOnUiThread { wv.evaluateJavascript("window.__whiteAudio && window.__whiteAudio.cmd($esc)", null) }
                }
            }
            wv.loadUrl("file://" + page.absolutePath)
        } catch (e: Throwable) {
            FileLogger.w("MainActivity", "DOM UI 层初始化失败 (纯 GL 降级): ${e.message}")
            // v4.6.1: 降级兜底 — 直接把 glView 设为内容 (v4.6.0 因未 setContentView 黑屏风险)
            try { setContentView(below) } catch (ignored: Throwable) {}
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        // 📜 T85: 黑匣子第一个启动 — 会话目录/全核心跳/进程外哨兵 (内部先通 FileLogger, 先于一切)
        com.white.engine.core.BlackBox.boot(this)
        FileLogger.w("MainActivity", "onCreate 开始")
        // v4.9.1: Java 层崩溃黑匣子 — UncaughtExceptionHandler 落盘 04-崩溃日志/java.txt (native 崩溃走 logcat -b crash)
        val prevHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { t, e ->
            try {
                val dir = java.io.File(com.white.engine.core.FileLogger.EXTERNAL_DIR, "04-崩溃日志")
                dir.mkdirs()
                java.io.File(dir, "java.txt").appendText(
                    "==== ${java.text.SimpleDateFormat("MM-dd HH:mm:ss.SSS", java.util.Locale.US).format(java.util.Date())} thread=${t.name} ====\n" +
                    android.util.Log.getStackTraceString(e) + "\n")
            } catch (ignored: Throwable) {}
            prevHandler?.uncaughtException(t, e)
        }

        super.onCreate(savedInstanceState)

        // 存储权限 (日志/模组/存档都要用): 授予后日志自动迁到 WHITE/日志/
        if (Build.VERSION.SDK_INT < 29) {
            requestPermissions(arrayOf(
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.READ_EXTERNAL_STORAGE), 100)
        }

        // M5: 前台服务保活 (切后台引擎不死)
        startForegroundService(Intent(this, KeepService::class.java))
        FileLogger.w("MainActivity", "KeepService 已启动")

        engine = WhiteEngine(this)
        val modHost = ModHost(engine)

        glView = GLSurfaceView(this).apply {
            // 🎯 v0.1.4 根因修复: 显式要 ES 上下文 (默认 ES 1.x 调 GLES20 = SIGSEGV)
            // v0.4.0 M3.2: 升级 ES 3.0 — WebGL2 桥需要 VAO 等 ES3 能力 (ES2 API 在 ES3 上下文兼容)
            setEGLContextClientVersion(3)
            setRenderer(engine.renderer)
            renderMode = GLSurfaceView.RENDERMODE_CONTINUOUSLY   // 帧率自主控制 (后续接 Choreographer 限帧)
        }
        engine.renderer.glView = glView   // M3.2: GL 线程调度器接线 (QuickJS 迁 GL 线程)
        // v4.6.1: 不在此 setContentView — DOM UI 层需要把 glView 装进 FrameLayout 容器,
        // 先 setContentView(glView) 会让 glView 已有 parent → WebView 挂载必然失败 (v4.6.0 日志已证)
        FileLogger.w("MainActivity", "GLSurfaceView 已创建 (待 DOM 层容器统一挂载)")

        // ═══ v4.6.0: DOM UI 层 (WebView 镜像) ═══
        // 原版 WHITE 的标题/菜单/警告屏全是 HTML+CSS, 浏览器负责渲染 — 哑垫片画不出来 = 永久黑屏根因。
        // 方案: GLSurfaceView 上叠透明 WebView 加载真 game.css, shim DOM 树序列化成 HTML 同步进来;
        // 点击/触摸经 JS 桥回 QuickJS 分发, 拼图区域触摸转发输入泵。game.js 一个字节不动。
        setupDomUi(glView)
        FileLogger.w("MainActivity", "DOM UI 层 (WebView) 已挂载")

        // 🖥 系统原生日志抓取: logcat 本进程全量流 → WHITE/日志/logcat.txt
        LogcatCapture.start(this)

        // 心跳 (GL 帧驱动): 每 3s — 若 GL 循环死了就不再出现
        engine.sched.every(3000) {
            FileLogger.w("Heartbeat", "alive fps=${engine.renderer.fps} backend=${engine.renderer.backend.name}")
        }

        // v4.6.10: KT 大核 (两核心架构) — 启动动画管线探测/专属日志归集
        engine.ktCore.start()

        // v0.1.3: 进程心跳 (独立线程, 不依赖 GL): 进程活着但 GL 死了时, 它会一直跳
        // → 两种心跳都在 = 一切正常; 只有进程心跳 = GL 线程死/卡; 都没了 = 进程被杀 (native 崩溃)
        Thread {
            var n = 0
            while (true) {
                try { Thread.sleep(5000) } catch (e: InterruptedException) { return@Thread }
                FileLogger.w("Heartbeat", "process alive #${++n} (独立线程)")
            }
        }.apply { isDaemon = true; name = "white-alive"; start() }

        // 模组系统: 扫描 WHITE/MODS/*.js (L2) 与 WHITE/MODS/native/*.so (L1)
        modHost.boot()

        engine.modHost = modHost

        // v0.4.1: 游戏本体随 APK 分发 — 首启解压 assets/game → filesDir/game (私有目录, 免存储权限)
        // 版本戳变更才重解压; 外部 /storage/emulated/0/WHITE/game 降级为回退
        val bundledOk = try {
            val stamp = java.io.File(filesDir, "game/.bundle-version")
            val expected = "game-" + (packageManager.getPackageInfo(packageName, 0).versionName ?: "?")
            if (!stamp.exists() || stamp.readText() != expected) {
                val dst = java.io.File(filesDir, "game")
                dst.deleteRecursively(); dst.mkdirs()
                copyAssetsRec("game", dst)
                stamp.writeText(expected)
            }
            true
        } catch (e: Throwable) {
            FileLogger.w("MainActivity", "内置游戏解压失败 (回退外部目录): ${e.message}"); false
        }
        if (bundledOk) com.white.engine.core.GAME_DIR = java.io.File(filesDir, "game")
        FileLogger.w("MainActivity", "游戏本体: ${com.white.engine.core.GAME_DIR.path} (bundled=$bundledOk)")

        // M2: 逻辑层托管 — 严格复刻 1.4.12 官方 index.html 静态链 (v4.6.6):
        //     内联全局 → assets.js → white-engine.js → game.js → ai-chat.js → system-menu.js
        //     (mod-loader/console/terminal 已随纯净本体移除 — 社组功能走 ModHost 的 MODS 路线)
        val gameDir = com.white.engine.core.GAME_DIR
        val scriptChain = listOf(
            "app/assets.js", "app/white-engine.js", "app/game.js", "app/ai-chat.js",
            "app/system-menu.js")
        val inlineGlobals = "window.WHITE_SITE = true; window.WHITE_V = \"c097d26409\"; window.WHITE_ALPHA = true;"
        var hostedChain = false
        if (gameDir.exists()) {
            val scripts = mutableListOf<Pair<String, String>>("inline-globals" to inlineGlobals)
            for (n in scriptChain) {
                val f = gameDir.resolve(n)
                if (f.exists() && f.isFile) scripts.add(n to f.readText())
            }
            // 回退: 无 app/ 脚本链但有顶层 game.js (旧式单文件托管)
            if (scripts.size == 1) {
                val solo = gameDir.resolve("game.js")
                if (solo.exists()) scripts.add("game.js" to solo.readText())
            }
            if (scripts.size > 1) {
                // v4.6.6 三板块自检 — 官方静态链 + 动画资源, 一个都不能缺
                run {
                    val names = scripts.map { it.first }
                    val official = listOf("inline-globals", "app/assets.js", "app/white-engine.js",
                        "app/game.js", "app/ai-chat.js", "app/system-menu.js")
                    val missing = official.filter { it !in names }
                    FileLogger.w("MainActivity", "静态链自检: ${if (missing.isEmpty()) "OK (内联全局+5脚本 与官方一致)" else "缺: $missing"}")
                    val introDir = java.io.File(gameDir, "assets/intro")
                    val introFiles = introDir.walkTopDown().filter { it.isFile && it.extension == "js" }.toList()
                    val animIdx = java.io.File(gameDir, "assets/animations/index.json")
                    val animFiles = java.io.File(gameDir, "assets/animations").listFiles { f -> f.extension == "json" } ?: emptyArray()
                    FileLogger.w("MainActivity", "动画板块自检: intro 模块 ${introFiles.size}/11 (需11: engine×5+logo×6), animations ${animFiles.size} 个 JSON + index=${animIdx.exists()}")
                    if (introFiles.size < 11 || !animIdx.exists())
                        FileLogger.w("MainActivity", "!! 动画板块缺失 — 开场动画/表情动画将不可用")
                }
                engine.logic.boot(scripts)
                FileLogger.w("MainActivity", "原版逻辑层已托管: ${scripts.size - 1} 个脚本 @ ${gameDir.path}")
                hostedChain = true
            }
        }
        if (!hostedChain) {
            val selftest = assets.open("logic/selftest.js").bufferedReader().use { it.readText() }
            engine.logic.boot(listOf("selftest.js" to selftest))
            FileLogger.w("MainActivity", "自检逻辑层已托管 (原版脚本链未找到)")
        }

        FileLogger.w("MainActivity", "onCreate 完成")
    }

    override fun onRequestPermissionsResult(code: Int, perms: Array<out String>, results: IntArray) {
        super.onRequestPermissionsResult(code, perms, results)
        if (code == 100) {
            val granted = results.isNotEmpty() && results[0] == android.content.pm.PackageManager.PERMISSION_GRANTED
            FileLogger.w("MainActivity", "存储权限: " + if (granted) "已授予" else "被拒绝 (日志暂存私有目录)")
            if (granted) {
                FileLogger.relocate()
                com.white.engine.core.BlackBox.relocate()   // T86-B: 黑匣子会话一并迁到日志盘
            } else {
                // T86-B: 弹窗被拒 (尤其是"不再询问") → 引导到应用详情页手动开权限, 日志系统必须接通
                try {
                    startActivity(android.content.Intent(
                        android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                        android.net.Uri.fromParts("package", packageName, null)))
                    FileLogger.w("MainActivity", "已跳转应用详情页 — 请开启存储权限后返回, 日志将自动接通")
                } catch (e: Exception) {
                    FileLogger.w("MainActivity", "跳转设置页失败: ${e.message}")
                }
            }
        }
    }

    // v0.3.0: 输入泵 — 触摸事件转发逻辑层 __onTouch
    override fun onTouchEvent(event: android.view.MotionEvent): Boolean {
        val type = when (event.actionMasked) {
            android.view.MotionEvent.ACTION_DOWN -> "down"
            android.view.MotionEvent.ACTION_MOVE -> "move"
            android.view.MotionEvent.ACTION_UP -> "up"
            else -> return super.onTouchEvent(event)
        }
        engine.logic.onTouch(type, event.x, event.y)
        return true
    }

    override fun onPause() { super.onPause(); FileLogger.w("MainActivity", "onPause (切后台)") }
    override fun onStop() { super.onStop(); FileLogger.w("MainActivity", "onStop") }
    override fun onDestroy() {
        if (::engine.isInitialized) engine.logic.shutdown()
        FileLogger.w("MainActivity", "onDestroy")
        super.onDestroy()
    }
    override fun onResume() {
        super.onResume()
        glView.onResume()
        // T86-B: 从应用详情页授权回来 → 自动重试接通外部日志 (黑匣子会话同盘, 一并恢复)
        if (Build.VERSION.SDK_INT < 29 &&
            checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
                == android.content.pm.PackageManager.PERMISSION_GRANTED) {
            FileLogger.relocate()
            com.white.engine.core.BlackBox.relocate()   // T86-B
        }
    }

    override fun onBackPressed() { /* 引擎内处理返回键 (对话快进等), 不直接退出 */ }

    /** v0.4.1: 递归拷贝 assets/<src> → dstDir (游戏本体首启解压; aapt 不会压缩大文件, 一次性成本可控) */
    private fun copyAssetsRec(src: String, dstDir: java.io.File) {
        val children = assets.list(src) ?: return
        if (children.isEmpty()) {
            // 叶子: 文件直接落 dstDir
            dstDir.parentFile?.mkdirs()
            assets.open(src).use { input -> dstDir.outputStream().use { input.copyTo(it) } }
            return
        }
        dstDir.mkdirs()
        for (c in children) copyAssetsRec("$src/$c", java.io.File(dstDir, c))
    }
}
