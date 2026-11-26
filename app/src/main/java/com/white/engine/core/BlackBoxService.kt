package com.white.engine.core

import java.io.File

/**
 * BlackBoxService — 独立进程黑匣子哨兵 (v4.9.3 / T86)
 *
 * 跑在 android:process=":blackbox" 的**独立 ProcessRecord** 里:
 * 主进程 SIGSEGV 时 AMS 只杀主进程的进程组, :blackbox 不受牵连 → 唯一能在死后写尸检的验尸官。
 * (v4.9.2 的 sh 孤儿哨兵被 AMS killProcessGroup 一并处决的教训)
 *
 * 职责: 盯主进程 pid → 消失即写 死亡报告.txt (crash 缓冲全量 + main 缓冲尾部)。
 * 若 死亡报告.txt 缺失 = 主进程是被 force-stop 杀的 (冻结后用户强关), 本进程会一起死 —
 * 这本身就是重要诊断: 「没有尸检报告 = 不是崩溃, 是冻结」。
 */
class BlackBoxService : android.app.Service() {

    private var watching = true

    override fun onCreate() {
        super.onCreate()
        // 低优先级常驻通知 (前台服务, 防 cached-process 被回收)
        try {
            val pi = if (android.os.Build.VERSION.SDK_INT >= 26)
                android.app.NotificationChannel("blackbox", "黑匣子", android.app.NotificationManager.IMPORTANCE_MIN).let {
                    (getSystemService(android.app.NotificationManager::class.java) as android.app.NotificationManager).createNotificationChannel(it); it
                } else null
            val b = if (android.os.Build.VERSION.SDK_INT >= 26)
                android.app.Notification.Builder(this, pi!!.id) else android.app.Notification.Builder(this)
            b.setSmallIcon(android.R.drawable.ic_menu_info_details).setContentTitle("WHITE 黑匣子").setContentText("进程外哨兵运行中")
            startForeground(0xB0, b.build())
        } catch (ignored: Throwable) {}
        FileLogger.w("BlackBox", ":blackbox 哨兵进程就绪 (pid=${android.os.Process.myPid()})")
    }

    @Volatile private var intentPid = 0

    override fun onStartCommand(intent: android.content.Intent?, flags: Int, startId: Int): Int {
        val pid = intent?.getIntExtra("pid", 0) ?: 0
        if (pid > 0) { intentPid = pid; startWatching(pid) }
        return android.app.Service.START_STICKY
    }

    private fun startWatching(pid: Int) {
        if (pid <= 0) return
        synchronized(this) {
            if (watching && intentPid == pid) return
            intentPid = pid; watching = true
        }
        Thread {
            val t0 = System.currentTimeMillis()
            while (watching && t0 + 6 * 60 * 60_000L > System.currentTimeMillis()) {
                try { Thread.sleep(300) } catch (ignored: InterruptedException) { return@Thread }
                if (!File("/proc/$pid").exists()) {
                    writeDeathReport(pid)
                    watching = false
                    return@Thread
                }
            }
        }.apply { isDaemon = true; name = "blackbox-watch"; priority = Thread.MIN_PRIORITY; start() }
        FileLogger.w("BlackBox", ":blackbox 开始监控主进程 $pid")
    }

    /** 主进程已消失 — 写尸检报告 (此刻我们仍活着, 这是与 sh 孤儿哨兵的本质区别) */
    private fun writeDeathReport(pid: Int) {
        val dir = File(FileLogger.EXTERNAL_DIR, "黑匣子")
        val session = File(dir, "当前会话.txt").takeIf { it.exists() }?.readText()?.trim()
        val sdir = if (session != null) File(dir, session) else dir
        val out = File(sdir, "死亡报告.txt")
        try {
            out.bufferedWriter().use { w ->
                w.write("═══ 死亡报告 (:blackbox 独立进程哨兵) ═══\n")
                w.write("主进程 $pid 消失时刻: ${java.text.SimpleDateFormat("MM-dd HH:mm:ss.SSS", java.util.Locale.US).format(java.util.Date())}\n")
                w.write("会话: ${sdir.name}\n\n")
                w.write("═══ crash 缓冲 (SIGSEGV/abort/tombstone 摘要) ═══\n")
                dump("logcat -d -b crash -v time", pid, w)
                w.write("\n═══ main 缓冲尾部 (死亡前最后 500 行) ═══\n")
                dump("logcat -d -v time", pid, w)
            }
            FileLogger.w("BlackBox", "死亡报告已写: ${out.absolutePath}")
        } catch (e: Throwable) {
            FileLogger.w("BlackBox", "死亡报告写失败: ${e.message}")
        }
        stopSelf()
    }

    private fun dump(cmd: String, pid: Int, w: java.io.Writer) {
        try {
            val p = Runtime.getRuntime().exec(arrayOf("sh", "-c", cmd))
            val r = p.inputStream.bufferedReader()
            var n = 0
            val buf = StringBuilder()
            while (true) {
                val line = r.readLine() ?: break
                if (line.contains("($pid)") || line.contains("$pid)") || cmd.contains("crash")) {
                    buf.append(line).append('\n'); n++
                    if (n > 500) { w.write(buf.toString()); buf.setLength(0); n = 0 }
                }
            }
            w.write(if (buf.isEmpty()) "(无匹配行)\n" else buf.toString())
        } catch (e: Throwable) { w.write("dump 失败: ${e.message}\n") }
    }

    override fun onBind(intent: android.content.Intent?) = null
}
