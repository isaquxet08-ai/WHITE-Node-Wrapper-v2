package com.white.engine.core

import java.io.File

/**
 * CpuAffinity — v4.8.0 多核架构: 线程钉核
 *
 * 大小核自动识别: /sys/devices/system/cpu/cpuN/cpufreq/cpuinfo_max_freq,
 * 最高频率 ≥ 全场 3/4 视为大核组, 其余小核组。
 * 反射调用 Os.sched_setaffinity (API 26+); 任何失败静默降级为线程优先级, 绝不影响启动。
 */
object CpuAffinity {
    @Volatile private var bigMask: IntArray? = null
    @Volatile private var litMask: IntArray? = null

    private fun detect() {
        if (bigMask != null) return
        synchronized(this) {
            if (bigMask != null) return
            val map = mutableMapOf<Int, Long>()
            try {
                File("/sys/devices/system/cpu").listFiles { f -> f.name.matches(Regex("cpu\\d+")) }?.forEach { f ->
                    val i = f.name.removePrefix("cpu").toIntOrNull() ?: return@forEach
                    val fr = try {
                        File(f, "cpufreq/cpuinfo_max_freq").readText().trim().toLongOrNull()
                    } catch (e: Throwable) { null } ?: return@forEach
                    map[i] = fr
                }
            } catch (e: Throwable) { /* 识别失败 → 不钉核 */ }
            if (map.size < 2) { bigMask = IntArray(0); litMask = IntArray(0); return }
            val maxF = map.values.max()
            bigMask = map.filterValues { it >= maxF * 3 / 4 }.keys.toIntArray()
            litMask = map.filterValues { it < maxF * 3 / 4 }.keys.toIntArray()
        }
    }

    /**
     * 把当前线程钉到指定核组。
     * big=true → 大核 (GL 渲染集合线程); big=false → 小核 (QuickJS 逻辑解释线程)。
     */
    fun pin(big: Boolean) {
        try {
            detect()
            val mask = (if (big) bigMask else litMask) ?: IntArray(0)
            if (mask.isEmpty()) return
            try {
                val os = Class.forName("android.system.Os")
                os.getMethod("sched_setaffinity", Int::class.javaPrimitiveType, IntArray::class.java)
                    .invoke(null, android.os.Process.myTid(), mask)
            } catch (e: Throwable) {
                // API < 26 或签名不符 — 降级: 仅调线程优先级 (大核组倾向高优先)
                try {
                    android.os.Process.setThreadPriority(if (big) -8 else 9)
                } catch (ignored: Throwable) {}
            }
        } catch (e: Throwable) { /* 钉核失败绝不影响启动 */ }
    }
}
