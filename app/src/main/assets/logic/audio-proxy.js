// v4.6.9 音频板块 — WebView 真执行器
// QuickJS shim 的 AudioContext 桩把节点操作攒成指令 JSON 发来, 这里在真 WebAudio 上同构执行。
// 指令: [handle, op, ...args]。二进制 (buffer/curve) 以 {"b64":...} (LE Float32) 传输。
// 时间: shim 用 Date.now 模拟 ctx.currentTime, ctx 创建时下发 shim 时钟 t0, 此后 origin = ctxNow - t0,
//       所有调度时间 mapT(t)=t+origin (两种时钟同源线性, 漂移分钟级 <0.1s, 音效无感)。
(function () {
  var ctx = null, origin = 0;
  var nodes = {};   // handle → 真节点 / Audio 元素

  function report(type, data) { try { WhiteDom.audioEvent(type, data || ''); } catch (e) {} }

  function ensureCtx(t0) {
    if (ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { report('error', 'WebView 无 AudioContext'); return; }
    ctx = new AC();
    origin = ctx.currentTime - (t0 || 0);
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume().catch(function () {});
    // 自动播放策略兜底: WebView 上任意触摸都尝试 resume (解锁后 game 会再发 resume)
    document.addEventListener('pointerdown', function () {
      if (ctx && ctx.state === 'suspended' && ctx.resume) ctx.resume().catch(function () {});
    }, { passive: true });
    report('ready', String(ctx.sampleRate));
  }

  function dec(b64) {
    var s = atob(b64), n = s.length, u8 = new Uint8Array(n);
    for (var i = 0; i < n; i++) u8[i] = s.charCodeAt(i);
    return new Float32Array(u8.buffer);
  }

  function mapT(t) { return (typeof t === 'number' && isFinite(t)) ? t + origin : t; }

  function realNode(h) {
    var n = nodes[h];
    if (!n) throw new Error('音频句柄不存在: ' + h);
    return n;
  }

  function exec(c) {
    var h = c[0], op = c[1], a = c.slice(2);
    if (h === 'ctx') {
      if (op === 'new') { ensureCtx(a[0]); return; }
      if (op === 'resume') { if (ctx && ctx.resume) ctx.resume().catch(function () {}); return; }
      if (op === 'suspend') { if (ctx && ctx.suspend) ctx.suspend().catch(function () {}); return; }
      return;
    }
    if (op === 'new') {
      ensureCtx(a[1]); if (!ctx) return;
      var kind = a[0], n = null;
      switch (kind) {
        case 'gain': n = ctx.createGain(); break;
        case 'osc': n = ctx.createOscillator(); break;
        case 'bufferSrc': n = ctx.createBufferSource(); break;
        case 'biquad': n = ctx.createBiquadFilter(); break;
        case 'panner': n = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain(); break;
        case 'compressor': n = ctx.createDynamicsCompressor(); break;
        case 'convolver': n = ctx.createConvolver(); break;
        case 'analyser': n = ctx.createAnalyser(); break;
        case 'waveShaper': n = ctx.createWaveShaper(); break;
        case 'delay': n = ctx.createDelay ? ctx.createDelay(6) : ctx.createDelay(); break;
        case 'mediaSrc': n = ctx.createMediaElementSource(realNode(a[2])); break;   // args: [kind, t0, audioHandle]
        case 'audio': {   // <audio> 元素 (BGM deck)
          var el = new window.Audio();
          el.preload = 'auto'; el.crossOrigin = 'anonymous';
          el.__paused = true;
          el.addEventListener('ended', function () { nodes[h] && (nodes[h].__paused = true); report('ended', h); });
          el.addEventListener('play', function () { nodes[h] && (nodes[h].__paused = false); });
          el.addEventListener('pause', function () { nodes[h] && (nodes[h].__paused = true); });
          nodes[h] = el; return;
        }
        default: report('error', '未知节点类型 ' + kind); return;
      }
      nodes[h] = n;
      if (n.onended !== undefined && n.start) n.onended = function () { report('ended', h); };
      return;
    }
    if (!ctx) return;
    var node = realNode(h);
    if (op === 'buffer') {   // args: [b64ch0, b64ch1|null, sampleRate, length]
      var sr = a[2] || ctx.sampleRate, len = a[3] || 1;
      var buf = ctx.createBuffer(a[1] ? 2 : 1, len, sr);
      try { buf.copyToChannel(dec(a[0]), 0); if (a[1]) buf.copyToChannel(dec(a[1]), 1); } catch (e2) {}
      node.buffer = buf; return;
    }
    if (op === 'connect') { node.connect(realNode(a[0]), a[1], a[2]); return; }
    if (op === 'connectCtx') { node.connect(ctx.destination, a[0], a[1]); return; }
    if (op === 'disconnect') { try { node.disconnect(); } catch (e3) {} return; }
    if (op === 'src') { node.src = a[0]; try { node.load(); } catch (e4) {} return; }
    if (op === 'play') { var p = node.play(); if (p && p.catch) p.catch(function () {}); return; }
    if (op === 'pause') { node.pause(); return; }
    if (op === 'loop') { node.loop = !!a[0]; return; }
    if (op === 'seek') { try { node.currentTime = a[0]; } catch (e5) {} return; }
    if (op === 'volume') { node.volume = a[0]; return; }
    if (op === 'prop') { node[a[0]] = a[1]; return; }
    if (op === 'param') {   // [paramName, method, ...margs] — 时间下标: cancel*→0, 其余→1
      var pn = a[0], m = a[1], ma = a.slice(2), p = node[pn];
      if (!p || !p[m]) return;
      for (var i = 0; i < ma.length; i++) {
        if (ma[i] && typeof ma[i] === 'object' && ma[i].b64) ma[i] = dec(ma[i].b64);
      }
      var tIdx = (m === 'cancelScheduledValues' || m === 'cancelAndHoldAtTime') ? 0 : 1;
      if (typeof ma[tIdx] === 'number') ma[tIdx] = mapT(ma[tIdx]);
      try { p[m].apply(p, ma); } catch (e6) {}
      return;
    }
    if (op === 'start' || op === 'stop') {   // 源节点直接调度
      var aa = a.slice();
      if (typeof aa[0] === 'number') aa[0] = mapT(aa[0]);
      try { node[op].apply(node, aa); } catch (e7) {}
      return;
    }
    report('error', '未知 op ' + op);
  }

  window.__whiteAudio = {
    cmd: function (json) {
      var list;
      try { list = JSON.parse(json); } catch (e) { report('error', '指令 JSON 解析失败'); return; }
      if (list && list.length) {
        for (var i = 0; i < list.length; i++) {
          try { exec(list[i]); } catch (err) { report('error', 'op 失败: ' + (list[i] || [])[1] + ' ' + err.message); }
        }
      }
    },
    state: function () { return ctx ? ctx.state : 'none'; }
  };
  console.log('[audio-proxy] 执行器就绪');
})();
