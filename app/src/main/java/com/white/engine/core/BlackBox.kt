package com.white.engine.core

import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.ConcurrentHashMap

/**
 * BlackBox — 全核黑匣子 (v4.9.2 / T85)
 *
 * 设计原则: **验尸官必须比病人活得久**。旧 LogcatCapture 的 crash 读取线程活在
 * App 进程内 — 进程 SIGSEGV 的瞬间验尸官跟着死, crash.txt 永远空 (T83/T84 两连败的教训)。
 *
 * v4.9.2 三层设计:
 *  1. **会话制**: App 一初始化 (onCreate 第一行) 就开出独立会话目录
 *     /storage/emulated/0/WHITE/黑匣子/会话-yyyyMMdd-HHmmss/ — 每次运行一份完整档案
 *  2. **全核心跳**: 大核GL/小核JS/主线程/音频核/模组核 各自上报心跳与状态,
 *     每秒落盘 心跳.log (哪个核最后活着、最后在干什么 — 死因范围立刻收窄)
 *  3. **进程外哨兵**: Runtime.exec 孵化独立 sh 进程监控 /proc/<pid>;
 *     App 死后它**仍然活着**, 自动写 死亡报告.txt (crash 缓冲全量 + 本进程 main 缓冲尾部
 *     + tombstone 列表) — 这是唯一能在 SIGSEGV 之后继续工作的验尸官
 *
 * 特殊权限说明: 哨兵是独立 OS 进程 (孤儿进程, 父死后被 init 收养继续运行),
 * 不需要任何 root/特殊权限 — 这是标准 Android 环境下进程外监控的唯一正道。
 */
object BlackBox {

    @Volatile private var booted = false
    lateinit var sessionDir: File
        private set

    /** T86-B: 会话是否暂落在私有目录 (外部存储权限未授予时), relocate() 用于授权后迁移 */
    private var sessionInPrivate = false

    // ── 全核心跳注册表: 核名 → (最后心跳时刻ns, 最后状态) ──
    private val beats = ConcurrentHashMap<String, Pair<Long, String>>()

    /** Boot: onCreate 的**第一个**调用 (先于一切) */
    fun boot(context: android.content.Context) {
        if (booted) return
        booted = true
        FileLogger.boot(context)   // 文件日志先通 (黑匣子的档案也要写到日志盘)
        val stamp = SimpleDateFormat("yyyyMMdd-HHmmss", Locale.US).format(Date())
        var dir: File? = null
        try {
            val root = File(FileLogger.EXTERNAL_DIR, "黑匣子")
            if ((root.isDirectory || root.mkdirs()) && root.canWrite()) {
                dir = File(root, "会话-$stamp")
                if (!dir.mkdirs()) dir = null
            }
        } catch (ignored: Exception) {}
        if (dir == null) {
            try {
                val root = File(context.filesDir, "黑匣子")
                root.mkdirs(); dir = File(root, "会话-$stamp"); dir.mkdirs()
                sessionInPrivate = true
            } catch (ignored: Exception) { return }
        }
        sessionDir = dir!!
        try {
            // 当前会话指针 (方便肉眼定位最新档案)
            File(sessionDir.parentFile, "当前会话.txt").writeText(sessionDir.name)
        } catch (ignored: Exception) {}
        w("═══ 黑匣子会话开启: ${sessionDir.name} ═══")

        // ★ T86: :blackbox 独立进程哨兵 — 主进程崩溃时唯一存活的验尸官 (sh 孤儿会被 AMS 进程组击杀)
        try {
            val svc = android.content.Intent(context, BlackBoxService::class.java)
                .putExtra("pid", android.os.Process.myPid())
            if (android.os.Build.VERSION.SDK_INT >= 26) context.startForegroundService(svc) else context.startService(svc)
        } catch (ignored: Exception) {}

        startHeartbeatWriter()
        startCrashBufferTap()
        startSentinel(android.os.Process.myPid())
    }

    /** 核心跳上报 — 各核心在主循环里廉价调用 (无锁 map put, 每帧一次开销可忽略) */
    fun beat(core: String, status: String) {
        beats[core] = System.nanoTime() to status
    }

    private fun w(s: String) = try { FileLogger.w("BlackBox", s) } catch (ignored: Exception) {}

    /** T86-B: 存储权限授予后调用 — 会话在私有目录时迁到 日志/黑匣子/, 心跳线程无缝续写 */
    fun relocate() {
        if (!sessionInPrivate || !this::sessionDir.isInitialized) return
        try {
            val root = File(FileLogger.EXTERNAL_DIR, "黑匣子")
            if (!((root.isDirectory || root.mkdirs()) && root.canWrite())) return
            val newDir = File(root, sessionDir.name)
            sessionDir.copyRecursively(newDir, overwrite = true)
            val old = sessionDir
            sessionDir = newDir
            sessionInPrivate = false
            File(newDir.parentFile, "当前会话.txt").writeText(newDir.name)
            w("会话已迁移到外部日志盘: ${old.name} → ${newDir.absolutePath} (心跳续写新位置)")
        } catch (e: Exception) {
            w("会话迁移失败: ${e.message}")
        }
    }

    /** 心跳落盘线程: 每秒一帧全核快照 + 卡死核警报 (>5s 无心跳)
     *  T87: 快照每 5 帧同步打进主日志一行 — 崩死时用户导出的 日志/ 目录必含主日志,
     *       不再依赖会话目录被文件管理器正确复制 (T86-A 包里 黑匣子/ 为空, 心跳数据全丢)。 */
    private fun startHeartbeatWriter() {
        Thread {
            var n = 0
            while (true) {
                try {
                    Thread.sleep(1_000)
                    n++
                    val sb = StringBuilder()
                    val now = System.nanoTime()
                    for ((k, v) in beats) {
                        val age = (now - v.first) / 1_000_000
                        sb.append("${k.padEnd(10)} 心跳龄=${age}ms 状态=${v.second}\n")
                        if (age > 5_000) sb.append("  ⚠ [$k] 超过 5s 无心跳!\n")
                    }
                    sb.append("--- 快照#$n ---\n")
                    sessionDir.resolve("心跳.log").appendText(sb.toString())
                    if (n % 5 == 0) {
                        // 主日志镜像: 单行摘要 (各核最新状态), 保证随 native-engine.log 一定被导出
                        val one = beats.entries.joinToString(" / ") { (k, v) ->
                            val age = (now - v.first) / 1_000_000
                            "$k=${v.second}(龄${age}ms)"
                        }
                        w("心跳#$n ${if (one.isEmpty()) "(各核尚无上报)" else one}")
                    }
                } catch (ignored: Exception) {}
            }
        }.apply { isDaemon = true; name = "white-blackbox-hb"; priority = Thread.MIN_PRIORITY; start() }
    }

    /** crash 缓冲直通 (尽力而为: 进程内读取, 秒杀前来得及落多少算多少; 兜底靠哨兵) */
    private fun startCrashBufferTap() {
        Thread {
            try {
                val sink = sessionDir.resolve("crash-缓冲直通.txt")
                val p = Runtime.getRuntime().exec(arrayOf("logcat", "-v", "time", "-b", "crash", "--pid=${android.os.Process.myPid()}"))
                sink.bufferedWriter().use { w ->
                    val r = p.inputStream.bufferedReader()
                    while (true) {
                        val line = r.readLine() ?: break
                        w.write(line); w.newLine(); w.flush()
                    }
                }
            } catch (ignored: Exception) {}
        }.apply { isDaemon = true; name = "white-blackbox-crash"; priority = Thread.MIN_PRIORITY; start() }
    }

    /**
     * ★ 进程外哨兵 — 本黑匣子的灵魂。
     * 独立 sh 进程盯着 /proc/<pid>; App 无论怎么死 (SIGSEGV/abort/LMK), 它都活着,
     * 死后立刻把系统崩溃缓冲全量收进会话目录。
     */
    private fun startSentinel(pid: Int) {
        val s = sessionDir.absolutePath
        // 孤儿进程脚本: 等进程消失 → 收尸。grep 限定本进程, tail 限体量。
        val script =
            "while [ -d /proc/$pid ]; do sleep 0.5; done; " +
            "{ echo \"═══ 死亡报告 (哨兵独立进程自动收尸) ═══\"; " +
            "echo \"进程 $pid 消失时刻: \$(date '+%F %T')\"; " +
            "echo \"会话: $s\"; echo; " +
            "echo \"═══ crash 缓冲 (SIGSEGV/abort/tombstone 摘要) ═══\"; " +
            "logcat -d -b crash -v time 2>/dev/null | grep \"$pid\" | tail -500; " +
            "echo; echo \"═══ main 缓冲尾部 (死亡前最后 400 行) ═══\"; " +
            "logcat -d -v time 2>/dev/null | grep \"($pid)\" | tail -400; " +
            "echo; echo \"═══ tombstones 目录 (无 root 时为空, 忽略) ═══\"; " +
            "ls -la /data/tombstones/ 2>/dev/null | tail -6; " +
            "} > \"$s/死亡报告.txt\" 2>&1; " +
            // T87: 镜像到 04-崩溃日志/ — 用户导出的日志目录必带, 一眼可见
            "cp \"$s/死亡报告.txt\" \"${FileLogger.EXTERNAL_DIR}/04-崩溃日志/死亡报告.txt\" 2>/dev/null; " +
            "cp \"$s/心跳.log\" \"${FileLogger.EXTERNAL_DIR}/04-崩溃日志/黑匣子心跳.log\" 2>/dev/null"
        try {
            val p = Runtime.getRuntime().exec(arrayOf("sh", "-c", script))
            w("进程外哨兵已孵化 (pid=${reflectPid(p)}, 监控目标=$pid)")
        } catch (e: Exception) {
            w("!! 哨兵孵化失败: ${e.message} — 退化到仅进程内监控")
        }
    }

    private fun reflectPid(p: Process): Int = try {
        p.javaClass.getDeclaredField("pid").let { it.isAccessible = true; it.getInt(p) }
    } catch (ignored: Throwable) { -1 }
}
