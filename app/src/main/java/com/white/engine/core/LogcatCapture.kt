package com.white.engine.core

import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader

/**
 * LogcatCapture — 系统原生日志抓取 (v0.1.2)
 *
 * 启动一条守护线程跑 `logcat -v time --pid=<本进程>`, 把安卓系统在运行时
 * 打的原生日志 (ART/GC/渲染/ Binder/系统警告...) 全量流式落盘:
 *
 *   /storage/emulated/0/WHITE/日志/logcat.txt   (外部不可写 → 应用私有目录)
 *
 * 体积控制: 超 4MB 自动清空重写 (永远保留最新现场)
 */
object LogcatCapture {

    private var thread: Thread? = null
    private const val MAX_BYTES = 4_000_000L

    fun start(context: android.content.Context) {
        if (thread?.isAlive == true) return
        startMain(context)
        startCrash(context)   // v4.9.1: 黑匣子 — native SIGSEGV/abort 只进 crash 缓冲, main 抓不到
    }

    private fun startCrash(context: android.content.Context) {
        var target: File? = null
        try {
            val cat = File(FileLogger.EXTERNAL_DIR, "04-崩溃日志")
            if ((cat.isDirectory || cat.mkdirs()) && cat.canWrite()) target = File(cat, "crash.txt")
        } catch (ignored: Exception) {}
        if (target == null) {
            try { val fb = File(context.filesDir, "logs/04-崩溃日志"); fb.mkdirs(); target = File(fb, "crash.txt") }
            catch (ignored: Exception) { return }
        }
        val sink = target!!
        try { if (sink.exists() && sink.length() > MAX_BYTES) sink.writeText("") } catch (ignored: Exception) {}
        Thread {
            try {
                // -b crash: 系统崩溃缓冲 — FATAL EXCEPTION / SIGSEGV tombstone 摘要 / ART abort 全在这
                val p = Runtime.getRuntime().exec(arrayOf("logcat", "-v", "time", "-b", "crash", "--pid=${android.os.Process.myPid()}"))
                BufferedReader(InputStreamReader(p.inputStream)).use { r ->
                    sink.appendText("")
                    sink.bufferedWriter().use { w ->
                        var size = 0L
                        while (true) {
                            val line = r.readLine() ?: break
                            w.write(line); w.newLine(); w.flush()   // 逐行冲刷 — 崩溃瞬间来得及落盘
                            size += line.length + 1
                            if (size > MAX_BYTES) { w.flush(); sink.writeText("(超限轮转, 以下为最新)\n"); size = 0L }
                        }
                    }
                }
            } catch (e: Exception) { try { FileLogger.w("Logcat", "crash 缓冲抓取异常: ${e.message}") } catch (ignored: Exception) {} }
        }.apply { isDaemon = true; name = "white-logcat-crash"; priority = Thread.MIN_PRIORITY; start() }
    }

    private fun startMain(context: android.content.Context) {
        if (thread?.isAlive == true) return
        // 目标文件: v4.5.4 归集到 03-系统日志/ 文件夹 (外部不可写 → 私有目录同构镜像)
        var target: File? = null
        try {
            val cat = File(FileLogger.EXTERNAL_DIR, "03-系统日志")
            if ((cat.isDirectory || cat.mkdirs()) && cat.canWrite()) target = File(cat, "logcat.txt")
        } catch (ignored: Exception) {}
        if (target == null) {
            try {
                val fb = File(context.filesDir, "logs/03-系统日志")
                fb.mkdirs()
                target = File(fb, "logcat.txt")
            } catch (ignored: Exception) { return }
        }
        val sink = target!!
        // 体积控制: 启动时超限就重开
        try { if (sink.exists() && sink.length() > MAX_BYTES) sink.writeText("") } catch (ignored: Exception) {}

        FileLogger.w("Logcat", "系统日志抓取启动 → ${sink.absolutePath}")
        thread = Thread {
            try {
                val p = Runtime.getRuntime().exec(
                    arrayOf("logcat", "-v", "time", "--pid=${android.os.Process.myPid()}")
                )
                BufferedReader(InputStreamReader(p.inputStream)).use { r ->
                    var size = 0L
                    sink.appendText("")
                    sink.bufferedWriter().use { w ->
                        while (true) {
                            val line = r.readLine() ?: break
                            w.write(line); w.newLine()
                            size += line.length + 1
                            if (size > MAX_BYTES) {   // 运行中超限: 清空重写 (保留最新)
                                w.flush()
                                sink.writeText("(超限轮转, 以下为最新日志)\n")
                                size = 0L
                            }
                        }
                    }
                }
            } catch (e: Exception) {
                FileLogger.w("Logcat", "抓取异常退出: ${e.message}")
            }
        }.apply {
            isDaemon = true
            name = "white-logcat"
            priority = Thread.MIN_PRIORITY   // 日志抓取不许抢渲染帧
            start()
        }
    }
}
