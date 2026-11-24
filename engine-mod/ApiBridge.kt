package com.white.engine.mod

import android.util.Log
import com.white.engine.core.WhiteEngine

/**
 * ApiBridge — 注入给每个模组的 api.* 对象
 *
 * ═══════════════════════════════════════════════════════
 *  API 大扩容: 不限于 WebView 版的 5 组, 开放 14 组
 *  (标 ★ = 原生引擎新增, 网页版做不到/做不好的)
 *  范围红线: dialogue/scene/content 为只读观察, 剧情推动由原版逻辑负责
 * ═══════════════════════════════════════════════════════
 */
class ApiBridge(
    private val engine: WhiteEngine,
    private val host: ModHost,
    private val modName: String,
    private val permissions: List<String>
) {
    private fun requirePerm(p: String) {
        check(p in permissions) { "模组未声明权限: $p (请在模组清单 .json 中声明)" }
    }

    // ═══ 1. console — 日志与命令 (对齐) ═══
    val console = object {
        fun log(text: String, type: String = "info") { Log.println(severity(type), "WHITE-MOD", text) }
        fun registerCommand(name: String, desc: String, fn: (Array<String>) -> Unit) { engine.commands[name] = CommandDef(desc, fn) }
    }

    // ═══ 2. ui — 全定制按钮 (对齐, 原生绘制零合成开销) ═══
    val ui = object {
        fun createButton(id: String, opts: Map<String, Any?>) = engine.ui.createButton(id, opts)
        fun update(id: String, patch: Map<String, Any?>) = engine.ui.updateButton(id, patch)
        fun removeButton(id: String) = engine.ui.removeButton(id)
        fun listButtons(): List<String> = engine.ui.listButtons()
        fun openSettings(focusId: String? = null) = engine.ui.openSettings(focusId)
    }

    // ═══ 3. dat — 存档/设置文件 (对齐) ═══
    val dat = object {
        fun list(type: String): List<String> = engine.files.list(type)
        fun read(type: String, name: String): String = engine.files.read(type, name)
        fun write(type: String, name: String, content: String, binary: Boolean = false) = engine.files.write(type, name, content, binary)
    }

    // ═══ 4. events — 事件总线 ★升级为一等公民 ═══
    val events = object {
        fun on(event: String, cb: (Any?) -> Unit) = engine.on(event, cb)
        fun emit(event: String, data: Any? = null) = engine.emit("mod:" + event, data)   // 模组事件带命名空间
    }

    // ═══ 5. scene — 场景控制 ★(只读观察 + jump 官方包装) ═══
    val scene = object {
        fun jump(id: String, skip: Boolean = false) = engine.sceneJump(id, skip)
        fun current(): String = engine.scene.currentId
        fun listChapters(): List<String> = engine.content.chapters()
        fun speed(n: Float) { engine.speed = n }
    }

    // ═══ 6. dialogue — 对话观察 ★(只读! 红线: 剧情推动由原版逻辑负责, 模组不可注入) ═══
    val dialogue = object {
        fun currentLine(): Map<String, String> = engine.dialogue.currentLine()
        fun history(n: Int = 20): List<Map<String, String>> = engine.dialogue.history(n)
        fun skipTypewriter() = engine.dialogue.skipTypewriter()
    }

    // ═══ 7. render — 渲染钩子 ★(原生独占, 双后端全双工) ═══
    val render = object {
        fun addOverlay(id: String, asset: String, z: Int, alpha: Float = 1f) { requirePerm("render"); engine.renderer.addOverlay(id, asset, z, alpha) }
        fun removeOverlay(id: String) = engine.renderer.removeOverlay(id)
        fun screenEffect(effect: String, durationSec: Float) = engine.renderer.screenEffect(effect, durationSec)
        fun backend(): String = engine.renderer.backend.name        // "GLES" | "VULKAN"
        fun fps(): Int = engine.renderer.fps
    }

    // ═══ 8. audio — 音频 ★ ═══
    val audio = object {
        fun sfx(asset: String, volume: Float = 1f) { requirePerm("audio"); engine.audio.sfx(asset, volume) }
        fun bgm(asset: String, loop: Boolean = true) { requirePerm("audio"); engine.audio.bgm(asset, loop) }
        fun stopAll() = engine.audio.stopAll()
    }

    // ═══ 9. input — 输入扩展 ★ ═══
    val input = object {
        fun pressCard(c: Char) = engine.cardPress(c)                                // 替代 __game.press
        fun onGesture(type: String, cb: (Map<String, Float>) -> Unit) = engine.input.onGesture(type, cb)
        fun vibrate(ms: Long) { requirePerm("haptic"); engine.input.vibrate(ms) }
    }

    // ═══ 10. save — 存档系统 ★(schema 级访问) ═══
    val save = object {
        fun get(): Map<String, Any?> = engine.save.snapshot()
        fun put(s: Map<String, Any?>) = engine.save.restore(s)
        fun exportTo(type: String, name: String) = engine.save.exportTo(type, name)
    }

    // ═══ 11. net — 本机通道 ★(过渡期与 node 后端握手) ═══
    val net = object {
        fun get(url: String): String { requirePerm("net"); check(url.startsWith("http://127.0.0.1") || url.startsWith("https://")); return engine.http.get(url) }
        fun post(url: String, body: String): String { requirePerm("net"); return engine.http.post(url, body) }
    }

    // ═══ 12. timer — 定时器 ★ ═══
    val timer = object {
        fun setTimeout(ms: Long, fn: () -> Unit) = engine.sched.after(ms, fn)
        fun setInterval(ms: Long, fn: () -> Unit) = engine.sched.every(ms, fn)
        fun clear(handle: Int) = engine.sched.cancel(handle)
    }

    // ═══ 13. storage — 模组私有 KV ★(引擎级隔离) ═══
    val storage = object {
        fun get(k: String): String? = engine.kv.get(hostNamespace(), k)
        fun set(k: String, v: String) = engine.kv.put(hostNamespace(), k, v)
        fun keys(): List<String> = engine.kv.keys(hostNamespace())
    }

    // ═══ 14. modcom — 模组间通信 ★ ═══
    val modcom = object {
        fun provide(service: String, impl: (Array<Any?>) -> Any?) = engine.services.provide(hostNamespace(), service, impl)
        fun call(mod: String, service: String, args: Array<Any?>): Any? = engine.services.call(mod, service, args)
    }

    private fun hostNamespace() = "mod:$modName"

    private fun severity(t: String) = when (t) {
        "error" -> Log.ERROR; "warn" -> Log.WARN; "success" -> Log.INFO; else -> Log.DEBUG
    }

}

/** 控制台命令定义 (顶层, 供 WhiteEngine.commands 与 ApiBridge 共用) */
data class CommandDef(val desc: String, val fn: (Array<String>) -> Unit)
