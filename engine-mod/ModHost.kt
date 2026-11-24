package com.white.engine.mod

import android.util.Log
import com.white.engine.core.FileLogger
import com.white.engine.core.WhiteEngine
import java.io.File

/**
 * Mod 宿主 — WebView 版模组加载器的原生平移
 *
 * 四步不变: 扫描目录 → 注入上下文 → 真执行 → 事件总线
 * v4.6.4 关键修复: loadScript 原为占位空壳 (eval 被注释), 模组只打日志不执行
 * → 模组注入的关联按钮全部消失、DAT 存档功能失效。
 * 现在: boot() 登记 pending → logic.ready 后 evalAll() 把模组源码注入 QuickJS
 * (与游戏同一上下文, 模组可用 shim DOM 注入按钮)。
 *
 * 模组目录: /storage/emulated/0/WHITE/MODS/
 *   *.js            → L2 脚本模组 (QuickJS 同上下文执行)
 *   *.json          → 模组清单 (权限声明)
 */
class ModHost(private val engine: WhiteEngine) {

    companion object {
        const val ABI_VERSION = "2.0.0"   // v4.6.7: 全开放 — 底层文件/对话文本/运行时钩子全部可用
        const val MODS_DIR = "/storage/emulated/0/WHITE/MODS"
    }

    val loaded = mutableMapOf<String, ModInfo>()

    data class ModInfo(val name: String, val version: String, val file: File, val permissions: List<String>)

    /** ABI 2.0 能力面 (桥全部 String→String JSON, 语言无关 — 未来 Java 模组走同一协议) */
    val abi = """{\"abi\":\"2.0.0\",\"caps\":[\"dat\",\"game.fs\",\"edits\",\"bash\",\"dom\",\"engine.hooks\",\"ui\"]}"""

    private data class PendingMod(val name: String, val src: String, val permissions: List<String>)
    private val pending = mutableListOf<PendingMod>()
    private val nativeBridge = ModNativeBridge(engine)

    /** 引擎启动时调用: 扫描 + 登记全部模组 (真执行在 logic.ready 后的 evalAll) */
    fun boot() {
        val dir = File(MODS_DIR).apply { mkdirs() }
        val scripts = dir.listFiles { f -> f.extension == "js" } ?: emptyArray()
        FileLogger.w("ModHost", "扫描 ${MODS_DIR}: ${scripts.size} 个模组")
        Log.i("WHITE", "[ModHost] 扫描到 ${scripts.size} 个模组")
        pending.clear()
        scripts.forEach { f ->
            try {
                val src = f.readText()
                pending.add(PendingMod(f.nameWithoutExtension, src, readManifest(f)?.permissions ?: emptyList()))
            } catch (e: Exception) {
                Log.e("WHITE", "[ModHost] 模组读取失败: ${f.name}: ${e.message}")
                FileLogger.w("ModHost", "模组读取失败: ${f.name}: ${e.message}")
                recordError(e)
            }
        }
    }

    /** v4.6.4: 逻辑层就绪后调用 — 模组源码注入 QuickJS 真执行 (按钮注入/DAT 存档由此生效) */
    fun evalAll() {
        if (pending.isEmpty()) { FileLogger.w("ModHost", "无待执行模组"); return }
        val mods = pending.map { it.name to it.src }
        engine.logic.evalMods(mods, nativeBridge)
        pending.forEach {
            loaded[it.name] = ModInfo(it.name, ABI_VERSION, File(MODS_DIR, it.name + ".js"), it.permissions)
            FileLogger.w("ModHost", "已执行: ${it.name} (ABI $ABI_VERSION)")
            Log.i("WHITE", "[ModHost] 已执行: ${it.name} (ABI $ABI_VERSION)")
        }
        pending.clear()
    }

    /** 热加载单个模组 (MOD 面板刷新调用) */
    fun reload(fileName: String) {
        val f = File(MODS_DIR, fileName)
        if (!f.exists()) return
        loaded.remove(f.nameWithoutExtension)
        pending.clear()
        try {
            pending.add(PendingMod(f.nameWithoutExtension, f.readText(), readManifest(f)?.permissions ?: emptyList()))
            evalAll()
        } catch (e: Exception) { recordError(e) }
    }

    private fun readManifest(jsFile: File): ModManifest? = try {
        val mf = File(jsFile.parentFile, jsFile.nameWithoutExtension + ".json")
        if (mf.exists()) {
            val raw = mf.readText()
            val perms = Regex("\"permissions\"\\s*:\\s*\\[([^]]*)]").find(raw)
                ?.groupValues?.get(1)?.split(",")?.map { it.trim().trim('"') } ?: emptyList()
            ModManifest(perms)
        } else null
    } catch (e: Exception) { null }

    data class ModManifest(val permissions: List<String>)

    // ---- 崩溃登记 (对齐 WebView 版 ⚠ 指示灯机制) ----
    val errorLog = mutableListOf<Map<String, String>>()
    private fun recordError(e: Exception) {
        errorLog.add(mapOf("kind" to "mod", "message" to (e.message ?: ""), "at" to System.currentTimeMillis().toString()))
        if (errorLog.size > 20) errorLog.removeAt(0)
    }
}

/**
 * v4.6.4: 原生模组桥 — 注入 QuickJS 全局 WHITE_NATIVE
 * bindObject 兼容约束: 方法参数只能是 String/Int/Double/Boolean
 * bash 走真 sh (工作目录 /storage/emulated/0/WHITE), 对齐 WebView 版 Node 后端语义
 */
class ModNativeBridge(private val engine: WhiteEngine) {

    fun modLog(level: String, msg: String) {
        FileLogger.w("WHITE-MOD", "[$level] $msg")
        Log.println(if (level == "error") Log.ERROR else if (level == "warn") Log.WARN else Log.INFO, "WHITE-MOD", msg)
    }

    /** 存档/设置文件列表 → JSON 数组字符串 (type: "saves"|"settings") */
    fun datList(type: String): String = try {
        val list = engine.files.list(type)
        "[" + list.joinToString(",") { "\"" + it.replace("\\", "\\\\").replace("\"", "\\\"") + "\"" } + "]"
    } catch (e: Throwable) { "[]" }

    fun datRead(type: String, name: String): String = try {
        engine.files.read(type, name)
    } catch (e: Throwable) { "" }

    fun datWrite(type: String, name: String, content: String): Boolean = try {
        engine.files.write(type, name, content, false)
        true
    } catch (e: Throwable) {
        FileLogger.w("WHITE-MOD", "datWrite 失败: $name: ${e.message}")
        false
    }

    /** 受限 shell — 模组 bash.exec 兼容层 (cat/ls/cp/echo>/mkdir 等, 根目录锁 WHITE/) */
    fun bash(cmd: String): String = try {
        val p = ProcessBuilder("sh", "-c", cmd)
            .directory(File("/storage/emulated/0/WHITE"))
            .start()
        val out = p.inputStream.bufferedReader().readText()
        val err = p.errorStream.bufferedReader().readText()
        p.waitFor()
        out + if (err.isNotBlank()) "\n[stderr] $err" else ""
    } catch (e: Throwable) { "[bash error] ${e.message}" }

    // ══════ ABI 2.0: 底层文件系统全开放 (游戏本体目录 files/game, 首次修改自动备份) ══════

    private fun gameDir(): File = com.white.engine.core.GAME_DIR

    /** 列游戏文件 → JSON 数组 (subpath 如 "app" / "assets/animations", 空=根) */
    fun gameList(subpath: String): String = try {
        val d = if (subpath.isBlank()) gameDir() else File(gameDir(), subpath)
        val names = d.listFiles()?.map { f ->
            val kind = if (f.isDirectory) "d" else "f"
            val n = f.name.replace("\\", "\\\\").replace("\"", "\\\"")
            "{\"$kind\":\"$n\",\"s\":${f.length()}}"
        } ?: emptyList()
        "[" + names.joinToString(",") + "]"
    } catch (e: Throwable) { "[]" }

    /** 读任意游戏文件 (对话/剧情/配置/JS/JSON 全可读) */
    fun gameRead(path: String): String = try {
        File(gameDir(), path).readText()
    } catch (e: Throwable) { "" }

    private val backedUp = mutableSetOf<String>()

    /** 写任意游戏文件 — 首次修改某路径前自动备份到 /storage/emulated/0/WHITE/BACKUP/<相对路径> */
    fun gameWrite(path: String, content: String): Boolean = try {
        val f = File(gameDir(), path)
        if (!backedUp.contains(path) && f.exists()) {
            val bak = File("/storage/emulated/0/WHITE/BACKUP/$path")
            bak.parentFile?.mkdirs()
            f.copyTo(bak, overwrite = true)
            backedUp.add(path)
            FileLogger.w("WHITE-MOD", "gameWrite 自动备份: $path → BACKUP/")
        }
        f.parentFile?.mkdirs()
        f.writeText(content)
        true
    } catch (e: Throwable) {
        FileLogger.w("WHITE-MOD", "gameWrite 失败: $path: ${e.message}")
        false
    }

    /** 能力自描述 — 模组运行时探测 ABI 版本与可用能力 */
    fun abi(): String =
        "{\"abi\":\"2.0.0\",\"caps\":[\"dat\",\"game.fs\",\"edits\",\"bash\",\"dom\",\"engine.hooks\",\"ui\"],\"gameDir\":\"" + gameDir().absolutePath.replace("\\", "/") + "\"}"

    // ══════ ABI 2.0: 对话文本正道 — 官方 white-edits 机制 (edits.json) ══════

    /** 读当前对话覆写表 (官方 edits.json, kind=white-edits) */
    fun editsRead(): String = try {
        File(gameDir(), "edits.json").readText()
    } catch (e: Throwable) { "{\"kind\":\"white-edits\",\"lines\":{}}" }

    /** 写对话覆写表 — 传入完整 JSON; 游戏下次启动经 assets.js 官方链路生效 */
    fun editsWrite(jsonStr: String): Boolean = try {
        gameWrite("edits.json", jsonStr)
    } catch (e: Throwable) { false }
}
