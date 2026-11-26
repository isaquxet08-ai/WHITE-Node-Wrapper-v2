package com.white.engine.core

import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * FileLogger — 原生引擎全量日志归集 (v4.5.4)
 *
 * 结构: 日志根目录下按类别分文件夹, 全量 + 分类副本双轨:
 *
 *   WHITE/日志/                      (外部不可写 → filesDir/logs/ 同构镜像)
 *   ├── 01-应用日志/native-engine.log   — 全量 (所有通道都在这里)
 *   ├── 02-游戏输出/logic.log           — 逻辑层 JS (shim/console/游戏脚本输出)
 *   ├── 03-系统日志/logcat.txt          — 原生态 logcat 全量抓取 (LogcatCapture)
 *   ├── 04-崩溃日志/crash.log           — CRASH 标记行 (闪退尸检)
 *   ├── 05-性能日志/perf.log            — [perf] 探针 / Heartbeat FPS
 *   └── 06-模组日志/mod.log             — ModHost (MOD 加载/执行)
 *
 * 设计原则:
 *   - 全量文件永远先行落盘 (保命); 分类副本是分析视角, 每类独立文件夹
 *   - 超长行截断 (防 base64 日志风暴把盘写爆), 长度信息保留
 *   - 崩溃钩子: 未捕获异常 → 先写文件再交系统
 */
object FileLogger {

    const val EXTERNAL_DIR = "/storage/emulated/0/WHITE/日志"

    // 分类文件夹 → 文件名 (01/02/... 前缀保证文件管理器里按序排列)
    val CATEGORIES = linkedMapOf(
        "02-游戏输出" to "logic.log",
        "04-崩溃日志" to "crash.log",
        "05-性能日志" to "perf.log",
        "06-模组日志" to "mod.log",
        "07-动画日志" to "intro.log"
    )

    private const val NAME = "native-engine.log"
    private const val MAX_LINE = 2000   // 单行截断阈值 (base64 等巨型行防风暴)

    private var file: File? = null      // 全量 — 私有 (保命)
    private var extFile: File? = null   // 全量 — 外部镜像
    private var privRoot: File? = null  // 分类私有根 (filesDir/logs)
    private val catLock = Any()
    private val fmt = SimpleDateFormat("MM-dd HH:mm:ss.SSS", Locale.CHINA)
    private var previousHandler: Thread.UncaughtExceptionHandler? = null

    /** 最早调用: Activity.onCreate 的第一行之前 */
    fun boot(context: android.content.Context) {
        if (file != null) return
        // 1) 私有目录: 永远可写, 保命底线
        try {
            val fb = File(context.filesDir, "logs")
            fb.mkdirs()
            privRoot = fb
            file = File(fb, NAME)
        } catch (e: Exception) { file = null }
        // 2) 外部存储: 可写则双写镜像 (WHITE/日志/, 用户可直接拷走)
        try {
            val ext = File(EXTERNAL_DIR)
            if ((ext.isDirectory || ext.mkdirs()) && ext.canWrite()) {
                extFile = File(ext, NAME)
                // 首次接通时把私有目录里攒的旧日志迁过来
                file?.takeIf { it.exists() && it.length() > 0 }?.copyTo(extFile!!, true)
                w("FileLogger", "外部日志镜像已接通: ${extFile!!.absolutePath} (分类: ${CATEGORIES.keys.joinToString("/")})")
            }
        } catch (ignored: Exception) {}
        if (extFile == null) w("FileLogger", "外部存储暂不可写 (权限未授予), 日志暂存私有目录: ${file?.absolutePath}")
        // 3) 崩溃钩子: 任何未捕获异常 → 先写文件再交给系统 (这样"闪退"也有尸检报告)
        previousHandler = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { t, e ->
            try {
                w("CRASH", "!! 线程 ${t.name}: ${e.javaClass.name}: ${e.message}")
                e.stackTrace.take(30).forEach { w("CRASH", "    at $it") }
                w("CRASH", "!! 崩溃现场已存档 (以上即闪退原因)")
            } catch (ignored: Exception) {}
            previousHandler?.uncaughtException(t, e)
        }
        w("FileLogger", "===== WHITE Native Engine 启动 (全量日志归集 v4.5.4) =====")
    }

    /** 权限授予后重试外部存储 (自动接通镜像, 旧日志一并迁过去) */
    fun relocate() {
        if (extFile != null) return
        try {
            val ext = File(EXTERNAL_DIR)
            if (ext.isDirectory && ext.canWrite()) {
                extFile = File(ext, NAME)
                file?.takeIf { it.exists() && it.length() > 0 }?.copyTo(extFile!!, true)
                w("FileLogger", "权限已授予, 外部日志镜像接通: ${extFile!!.absolutePath}")
            }
        } catch (ignored: Exception) {}
    }

    /** 分类路由: 返回 null = 只进全量 */
    private fun categoryOf(tag: String, msg: String): String? = when {
        tag == "CRASH" -> "04-崩溃日志"
        tag == "LogicJS" -> "02-游戏输出"
        tag == "IntroLog" -> "07-动画日志"   // v4.6.10: KT 大核动画管线专属日志
        tag == "ModHost" -> "06-模组日志"
        tag == "Heartbeat" || msg.contains("[perf]") || tag == "Perf" -> "05-性能日志"
        else -> null
    }

    /** 分类副本落点: 外部可写用外部, 否则私有目录同构镜像 */
    private fun catFile(cat: String): File? {
        return try {
            val base = File(EXTERNAL_DIR, cat)
            if (base.isDirectory || base.mkdirs()) File(base, CATEGORIES[cat] ?: "log.log")
            else null
        } catch (ignored: Exception) { null }
    }

    fun w(tag: String, msg: String) {
        // 超长行截断 (base64 dataURI 等防日志风暴; 保留全长信息)
        val m = if (msg.length > MAX_LINE) msg.substring(0, MAX_LINE) + " …(截断, 全长 " + msg.length + " 字符)" else msg
        val line = "${fmt.format(Date())} [$tag] $m\n"
        // 1) 全量: 私有保命 + 外部镜像
        try { file?.appendText(line) } catch (ignored: Exception) {}
        try { extFile?.appendText(line) } catch (ignored: Exception) {}
        // 2) 分类副本: 外部可写时写入对应文件夹 (不可写则忽略 — 全量里都有)
        val cat = categoryOf(tag, msg) ?: return
        try { catFile(cat)?.appendText(line) } catch (ignored: Exception) {}
        // 3) 私有同构镜像 (外部未接通时的分析兜底)
        try {
            val rb = privRoot ?: return
            val f = File(File(rb, cat), CATEGORIES[cat] ?: "log.log")
            if (extFile == null) f.appendText(line)
        } catch (ignored: Exception) {}
    }
}
