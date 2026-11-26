package com.white.engine.core

/**
 * ═══════════════════════════════════════════════════════════════════════
 *  KtCore — KT 大核 (v4.6.10)
 *  两核心架构: 大核引导控制, 小核专注执行
 *
 *  ┌ KT 大核 (本模块, Kotlin) — API/控制面 ────────────────────────┐
 *  │  引导: GL 上下文就绪 → 才放行 JS 小核 boot (LogicHost.glContextReady) │
 *  │  控制: 周期探测 JS 动画管线状态 (__introStatus) → 结果写专属日志      │
 *  │  API:  模组 API (ApiBridge)/调度 (sched)/输入/存档/文件 全部 KT 直营  │
 *  │  日志: 07-动画日志/intro.log (模块加载/挂载/失败/KT探测 专属归集)      │
 *  │  兜底: JS 侧任何崩溃不影响 KT (渲染循环/输入/存档全是 KT 直营)         │
 *  └──────────────────────────────────────────────────────────────┘
 *  ┌ JS 小核 (logic/shim.js + 官方脚本链, QuickJS) — 执行面, 非网页 ─┐
 *  │  性质: 被托管的工作核 — shim 只模拟官方代码需要的浏览器表面,          │
 *  │        没有网络栈/没有标签页/没有真 DOM 引擎, 不是网页也不是浏览器    │
 *  │  逻辑: 官方脚本链原版执行 (一个字节不改)                              │
 *  │  动画: intro 11 模块 → __gl WebGL 直通桥 → 原生 GLES                │
 *  │  音频: WebAudio 桩 → audioCmd 指令桥 → WebView 真 WebAudio          │
 *  └──────────────────────────────────────────────────────────────┘
 *  ┌ WebView — 外设 (非控制面) ────────────────────────────────────┐
 *  │  DOM 镜像上屏 + 真 WebAudio 卸载执行, 点击/音频事件单向回桥          │
 *  └──────────────────────────────────────────────────────────────┘
 *
 *  大核绝不实现游戏语义; 小核绝不触碰线程/GL 上下文生命周期; WebView 无控制权。
 *  通信只有三条单向通道: KT→JS evaluate (探测/输入), JS→KT __engine 桥 (渲染/音频/日志),
 *  WebView→KT→JS (DOM 点击/音频事件回派)。
 */
class KtCore(private val engine: WhiteEngine) {

    private var probes = 0

    /** 探测窗口: boot 后 90 秒内每 3 秒问一次 JS 动画管线 (intro 全程约 8 秒, 90s 足够覆盖重试) */
    private val probeCount = 30

    fun start() {
        engine.sched.every(3000) {
            probes++
            if (probes <= probeCount) engine.logic.introProbe(probes)
        }
        FileLogger.w("IntroLog", "===== KT 大核启动: 动画管线探测已排程 (${probeCount} 次 × 3s) =====")
    }
}
