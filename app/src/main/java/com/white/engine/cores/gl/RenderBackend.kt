package com.white.engine.cores.gl

/**
 * RenderBackend — 双后端统一契约 (全双工)
 * GLES 与 Vulkan 实现同一接口, 场景指令层对后端无感。
 *
 * 约束 (范围红线): 后端只画"逻辑层给出的视觉状态", 不理解剧情。
 */
interface RenderBackend {
    val name: String                       // "GLES" | "VULKAN"

    fun init(surface: Any?, width: Int, height: Int): Boolean
    fun resize(width: Int, height: Int)
    fun beginFrame()
    fun endFrame()

    // 视觉指令 (场景指令层的落点)
    fun setClearColor(r: Float, g: Float, b: Float)
    fun drawOverlay(id: String, z: Int, alpha: Float)
    fun removeOverlay(id: String)
    fun screenEffect(effect: String, durationSec: Float)
    fun shutdown()
}

/**
 * 后端选择器 — 启动时能力检测
 * 默认 GLES (全设备兼容); Vulkan 仅在检测通过时启用, 失败自动回落。
 */
object BackendSelector {
    fun detect(hasVkSurface: Boolean, apiLevel: Int): String {
        // Vulkan: API 24+ 且设备有 VK surface 支持才候选; 首选可由设置覆盖
        return if (hasVkSurface && apiLevel >= 24) "VULKAN" else "GLES"
    }
}
