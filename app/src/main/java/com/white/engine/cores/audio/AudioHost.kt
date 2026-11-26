package com.white.engine.cores.audio

import com.white.engine.core.FileLogger

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.media.MediaPlayer
import android.os.Handler
import android.os.HandlerThread
import org.json.JSONArray
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.Base64

/**
 * AudioHost — v4.8.1 原生音频执行器 (KT 语言)
 *
 * shim WebAudio 桩把节点操作攒成 audioCmd 指令 JSON ([handle, op, ...args]) 发来,
 * 本宿主在 KT 音频线程同构执行 — 音频彻底脱离 WebView, 与 v4.8.0 多核架构对齐:
 *
 *  · <audio> deck (BGM)  → MediaPlayer (原声播放主通道)
 *  · bufferSrc           → AudioTrack (PCM Float32 静态流)
 *  · osc                 → AudioTrack 波形合成 (sine/square/saw/triangle)
 *  · gain / panner       → 音量图遍历 (播放时刻求值 + 250ms 定期重估支持 BGM fade)
 *  · biquad/compressor/convolver/delay/waveShaper/analyser → 直通 (保图拓扑, 不改响度)
 *
 * 事件 (ended/ready/error) → WhiteEngine → __shimAudioEvent 回派 shim。
 * init 失败 → dispatch 返回 false → 自动回退 WebView audio-proxy.js 通道。
 */
object AudioHost {
    private const val TAG = "AudioHost"

    private var resolver: ((String) -> java.io.File?)? = null
    private var onEvent: ((String, String) -> Unit)? = null
    @Volatile private var inited = false
    private var thread: HandlerThread? = null
    private var handler: Handler? = null
    private var originKt = 0.0   // shim 秒时钟 → KT 时钟换算: KT播放时刻 = shimT + originKt

    private val nodes = java.util.concurrent.ConcurrentHashMap<String, Nd>()

    /** shim 时钟秒 → KT 秒时钟 (elapsedRealtime) */
    private fun now(): Double = android.os.SystemClock.elapsedRealtime() / 1000.0
    private fun mapT(t: Double): Double = if (t.isFinite()) t + originKt else t

    /** 初始化 (仅一次; 幂等) */
    fun init(resolver: (String) -> java.io.File?, onEvent: (String, String) -> Unit): Boolean {
        if (inited) return true
        return try {
            this.resolver = resolver
            this.onEvent = onEvent
            val th = HandlerThread("AudioHost")
            th.start()
            thread = th
            handler = Handler(th.looper)
            inited = true
            FileLogger.w(TAG, "原生音频宿主就绪 (KT 通道)")
            true
        } catch (e: Throwable) {
            FileLogger.w(TAG, "原生音频宿主初始化失败 (回退 WebView): ${e.message}")
            false
        }
    }

    /** 音频线程执行; 返回 false = 宿主不可用 → 调用方回退 WebView */
    fun dispatch(json: String): Boolean {
        com.white.engine.core.BlackBox.beat("音频核", "cmd")
        // T87: 空闲心跳 — 音频核是事件驱动 (无指令不打心跳), 黑匣子 5s 超时警报会误报
        if (!this::idleBeat.isInitialized) {
            idleBeat = Thread {
                while (true) {
                    Thread.sleep(3_000)
                    com.white.engine.core.BlackBox.beat("音频核", "idle")
                }
            }.apply { isDaemon = true; name = "white-audio-idlebeat"; start() }
        }
        if (!inited) return false
        val h = handler ?: return false
        h.post {
            try {
                val list = JSONArray(json)
                for (i in 0 until list.length()) exec(list.optJSONArray(i) ?: continue)
            } catch (e: Throwable) {
                report("error", "KT音频指令解析失败: ${e.message}")
            }
        }
        return true
    }

    private lateinit var idleBeat: Thread

    private fun report(type: String, data: String) {
        try { onEvent?.invoke(type, data) } catch (e: Throwable) {}
        if (type == "error") FileLogger.w(TAG, "audio error: $data")
    }

    private fun dec(b64: String): FloatArray {
        val raw = Base64.getDecoder().decode(b64)
        val bb = ByteBuffer.wrap(raw).order(ByteOrder.LITTLE_ENDIAN)
        val fb = bb.asFloatBuffer()
        val out = FloatArray(fb.remaining())
        fb.get(out)
        return out
    }

    /** 参数自动化 — setValueAtTime / 线性 / 指数 ramp / setTarget 简化近似 */
    private class AutoParam(val def: Double) {
        var base = def
        val pts = mutableListOf<Triple<Double, String, DoubleArray>>()   // (ktT, kind, [v, extra])
        fun set(kind: String, ktT: Double, v: Double, extra: Double) {
            pts.add(Triple(ktT, kind, doubleArrayOf(v, extra)))
            pts.sortBy { it.first }
        }
        fun cancel(t: Double) { pts.removeAll { it.first > t } }
        fun valueAt(t: Double): Double {
            var v = base; var vt = 0.0
            for (p in pts) {
                if (p.first > t) break
                val target = p.third[0]
                v = when (p.second) {
                    "linearRampToValueAtTime" ->
                        if (p.first > vt) { val f = ((t - vt) / (p.first - vt)).coerceIn(0.0, 1.0); v + (target - v) * f } else target
                    "exponentialRampToValueAtTime" ->
                        if (p.first > vt && v > 0 && target > 0) { val f = ((t - vt) / (p.first - vt)).coerceIn(0.0, 1.0); v * Math.pow(target / v, f) } else target
                    else -> target
                }
                vt = p.first
            }
            return v
        }
    }

    private class Nd(val h: String, val kind: String) {
        // <audio> deck
        var media: MediaPlayer? = null
        var srcPath: String = ""
        var elVolume = 1.0
        var elLoop = false
        var elPrepared = false
        // bufferSrc
        var ch0: FloatArray? = null; var ch1: FloatArray? = null
        var bufSr = 48000; var bufLoop = false
        var track: AudioTrack? = null
        var oscType = "sine"
        var oscFreq = AutoParam(440.0)
        // 通用
        var gain = AutoParam(1.0)
        var pan = AutoParam(0.0)
        val outs = mutableListOf<Triple<String, Int, Int>>()   // (toHandle, outIdx, inIdx)
        var connectedCtx = false
        var volTimerOn = false
    }

    /** 从源节点沿图走到 ctx.destination, 乘 gain 值 (宽容语义: 无路径按直通) */
    private fun chainGain(h: String, seen: MutableSet<String> = HashSet()): Double {
        val n = nodes[h] ?: return 1.0
        var prod = 1.0
        if (n.kind == "gain") prod *= n.gain.valueAt(now()).coerceIn(0.0, 4.0)
        if (n.connectedCtx) return prod
        if (n.outs.isEmpty()) return prod
        var best = 0.0
        for (e in n.outs) {
            if (e.first in seen) continue
            seen.add(e.first)
            best = maxOf(best, chainGain(e.first, seen))
            seen.remove(e.first)
        }
        return prod * (if (best > 0.0) best else 1.0)
    }

    private fun exec(c: JSONArray) {
        val h = c.optString(0, "")
        val op = c.optString(1, "")
        if (h.isEmpty()) return
        if (h == "ctx") {
            when (op) {
                "new" -> { originKt = now() - c.optDouble(2, 0.0); report("ready", "48000") }
                "resume", "suspend" -> {}   // 原生无自动播放策略限制, 恒可播
            }
            return
        }
        if (op == "new") {
            val kind = c.optString(2, "")
            val n = Nd(h, kind)
            if (kind == "mediaSrc") { /* args: [kind, t0, audioHandle] — 图桥, 元素状态在 audio 句柄上 */ }
            nodes[h] = n
            return
        }
        val n = nodes[h] ?: return
        val t = now()
        when (op) {
            "buffer" -> {   // [b64ch0, b64ch1|null, sr, len]
                n.ch0 = try { dec(c.optString(2)) } catch (e: Throwable) { null }
                n.ch1 = if (c.optString(3, "null") != "null" && !c.isNull(3)) try { dec(c.optString(3)) } catch (e: Throwable) { null } else null
                n.bufSr = c.optInt(4, 48000).coerceIn(8000, 96000)
            }
            "connect" -> n.outs.add(Triple(c.optString(2), c.optInt(3, 0), c.optInt(4, 0)))
            "connectCtx" -> n.connectedCtx = true
            "disconnect" -> { n.outs.clear(); n.connectedCtx = false }
            "src" -> {
                n.srcPath = c.optString(2, "")
                n.elPrepared = false
            }
            "play" -> playElement(n)
            "pause" -> { try { n.media?.pause() } catch (e: Throwable) {} }
            "loop" -> {
                n.elLoop = c.optBoolean(2, false)
                try { n.media?.isLooping = n.elLoop } catch (e: Throwable) {}
            }
            "volume" -> {
                n.elVolume = c.optDouble(2, 1.0)
                try { n.media?.setVolume(elVol(n).toFloat().coerceIn(0f, 1f), elVol(n).toFloat().coerceIn(0f, 1f)) } catch (e: Throwable) {}
            }
            "seek" -> { try { n.media?.seekTo((c.optDouble(2, 0.0) * 1000).toInt()) } catch (e: Throwable) {} }
            "prop" -> setProp(n, c.optString(2, ""), c.opt(3))
            "param" -> setParam(n, c)
            "start" -> startSource(n, c)
            "stop" -> stopSource(n, c)
            else -> report("error", "KT音频未知 op $op")
        }
    }

    private fun elVol(n: Nd): Double = (n.elVolume * chainGain(n.h)).coerceIn(0.0, 1.0)

    /** <audio> deck: MediaPlayer 原声播放 */
    private fun playElement(n: Nd) {
        val m = n.media
        if (m != null && n.elPrepared) {
            try { if (m.isPlaying) return; m.start() } catch (e: Throwable) {}
            startVolLoop(n)
            return
        }
        val f = resolver?.invoke(n.srcPath)
        if (f == null) { report("error", "KT音频找不到源: ${n.srcPath}"); return }
        try {
            val mp = MediaPlayer()
            mp.setAudioAttributes(AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA).setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build())
            mp.setDataSource(f.canonicalPath)
            mp.isLooping = n.elLoop
            mp.setVolume(elVol(n).toFloat().coerceIn(0f, 1f), elVol(n).toFloat().coerceIn(0f, 1f))
            mp.setOnCompletionListener { mm ->
                if (!n.elLoop) { report("ended", n.h) }
            }
            mp.setOnErrorListener { _, what, extra -> report("error", "MediaPlayer $what/$extra ${n.srcPath}"); true }
            mp.prepare()
            mp.start()
            n.media?.release()
            n.media = mp
            n.elPrepared = true
            startVolLoop(n)
            FileLogger.w(TAG, "BGM 播放: ${f.name} vol=${"%.2f".format(elVol(n))}")
        } catch (e: Throwable) {
            report("error", "KT音频播放失败 ${n.srcPath}: ${e.message}")
        }
    }

    /** 250ms 定期重估音量 — 支持 gain fade (linearRamp) 对 BGM 生效 */
    private fun startVolLoop(n: Nd) {
        if (n.volTimerOn) return
        n.volTimerOn = true
        handler?.postDelayed(object : Runnable {
            override fun run() {
                val m = n.media ?: run { n.volTimerOn = false; return }
                try {
                    if (m.isPlaying) {
                        val v = elVol(n).toFloat().coerceIn(0f, 1f)
                        m.setVolume(v, v)
                        handler?.postDelayed(this, 250)
                    } else n.volTimerOn = false
                } catch (e: Throwable) { n.volTimerOn = false }
            }
        }, 250)
    }

    private fun setProp(n: Nd, k: String, v: Any?) {
        when {
            k == "loop" && n.kind == "bufferSrc" -> n.bufLoop = v == true
            k == "type" && (n.kind == "osc" || n.kind == "biquad") -> n.oscType = v?.toString() ?: "sine"
        }
    }

    private fun setParam(n: Nd, c: JSONArray) {
        val pn = c.optString(2, "")
        val method = c.optString(3, "")
        val p0 = when (pn) {
            "gain" -> n.gain
            "pan" -> n.pan
            "frequency" -> if (n.kind == "osc") n.oscFreq else null
            else -> null
        }
        val p = p0 ?: return
        val v = c.optDouble(4, 0.0)
        val t = c.optDouble(5, 0.0)
        when (method) {
            "setValueAtTime" -> p.set("setValueAtTime", mapT(t), v, 0.0)
            "linearRampToValueAtTime" -> p.set("linearRampToValueAtTime", mapT(t), v, 0.0)
            "exponentialRampToValueAtTime" -> p.set("exponentialRampToValueAtTime", mapT(t), v, 0.0)
            "setTargetAtTime" -> p.set("setTargetAtTime", mapT(t), v, c.optDouble(6, 0.1))
            "cancelScheduledValues" -> p.cancel(mapT(v))
            else -> {}
        }
    }

    /** bufferSrc / osc → AudioTrack */
    private fun startSource(n: Nd, c: JSONArray) {
        val whenT = if (c.length() > 2 && !c.isNull(2)) c.optDouble(2, 0.0) else 0.0
        val delayMs = if (whenT <= 0.0) 0L else ((mapT(whenT) - now()) * 1000).toLong().coerceAtLeast(0)
        handler?.postDelayed({
            try {
                val pcm = renderPcm(n) ?: return@postDelayed
                val stereo = n.ch1 != null
                val chCfg = if (stereo) AudioFormat.CHANNEL_OUT_STEREO else AudioFormat.CHANNEL_OUT_MONO
                val frames = n.ch0?.size ?: return@postDelayed
                val minBuf = AudioTrack.getMinBufferSize(n.bufSr, chCfg, AudioFormat.ENCODING_PCM_FLOAT)
                val track = AudioTrack.Builder()
                    .setAudioAttributes(AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA).setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build())
                    .setAudioFormat(AudioFormat.Builder().setSampleRate(n.bufSr).setChannelMask(chCfg).setEncoding(AudioFormat.ENCODING_PCM_FLOAT).build())
                    .setTransferMode(AudioTrack.MODE_STATIC)
                    .setBufferSizeInBytes(maxOf(minBuf, pcm.size * 4))
                    .build()
                // FloatArray 无 write 重载 (compileSdk) → 转 LE byte 通道写入
                val bb = java.nio.ByteBuffer.allocate(pcm.size * 4).order(ByteOrder.LITTLE_ENDIAN)
                bb.asFloatBuffer().put(pcm)
                val bytes = bb.array()
                track.write(bytes, 0, bytes.size)
                // 静态流恒循环: osc 播到 stop 为止; bufferSrc 按 loop 标志 (噪声循环全靠它)
                track.setLoopPoints(0, frames, -1)
                track.play()
                n.track?.release()
                n.track = track
                // 非循环 bufferSrc: 时长后报 ended (onended 对齐)
                if (n.kind == "bufferSrc" && !n.bufLoop) {
                    val durMs = (frames.toDouble() / n.bufSr * 1000).toLong()
                    handler?.postDelayed({
                        try { track.stop(); track.release() } catch (e: Throwable) {}
                        if (n.track === track) n.track = null
                        report("ended", n.h)
                    }, durMs + 50)
                }
            } catch (e: Throwable) { report("error", "AudioTrack 启动失败: ${e.message}") }
        }, delayMs)
    }

    private fun stopSource(n: Nd, c: JSONArray) {
        val whenT = if (c.length() > 2 && !c.isNull(2)) c.optDouble(2, 0.0) else 0.0
        val delayMs = if (whenT <= 0.0) 0L else ((mapT(whenT) - now()) * 1000).toLong().coerceAtLeast(0)
        handler?.postDelayed({
            try { n.track?.stop(); n.track?.release() } catch (e: Throwable) {}
            n.track = null
        }, delayMs)
    }

    /** 生成 PCM 交错浮点 (静态流一次写死): bufferSrc 用录音 buffer, osc 按类型合成 1s 循环 */
    private fun renderPcm(n: Nd): FloatArray? {
        if (n.kind == "bufferSrc") {
            val c0 = n.ch0 ?: return null
            val c1 = n.ch1
            if (c1 == null) return c0
            val out = FloatArray(c0.size * 2)
            for (i in c0.indices) { out[2 * i] = c0[i]; out[2 * i + 1] = c1[i] }
            return out
        }
        if (n.kind == "osc") {
            val sr = 48000
            val f = n.oscFreq.valueAt(now()).coerceIn(1.0, 20000.0)
            val out = FloatArray(sr)
            val w = 2.0 * Math.PI * f / sr
            for (i in out.indices) {
                val ph = w * i
                out[i] = when (n.oscType) {
                    "square" -> (if (Math.sin(ph) >= 0) 0.5 else -0.5).toFloat()
                    "sawtooth" -> (((ph / Math.PI) % 2.0) - 1.0).toFloat() * 0.5f
                    "triangle" -> (0.5 * (2.0 * Math.abs(((ph / Math.PI) % 2.0) - 1.0) - 1.0)).toFloat()
                    else -> (0.4 * Math.sin(ph)).toFloat()
                }
            }
            return out
        }
        return null
    }
}
