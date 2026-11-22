// Animation Engine · WHITE logo: the stages, the transitions between them, the camera, and the events
// (flash, onset, blips, small glitches). Everything on screen comes from a handful of numbers (the
// "look"), worked out fresh every frame, so a stage's own loop can hand over to the next transition
// at any moment without a jump:
//
//   look = the stage's resting numbers, or the running transition's curves
//        + the events still fading (the flash, the onset effect, blips, small glitches, White's flash)
//        + the stage's own loop (breathing, drift)
//
// White (the character, engine/character.js) is one more of these numbers, "char": 0 = not there,
// 1 = in. It comes in at the end of 2 -> 3 (glitching in, then its flash), and its own motion and
// glitch breathing run in WL.CharacterMotion.
//
// A transition that starts from somewhere unexpected (you clicked half way through something) starts
// from where things are and blends into its own curves over a third of a second. The camera does the
// same: every move starts from wherever the camera is.
(function () {
  const WL = (window.WL = window.WL || {});
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const sstep = (a, b, x) => { if (a === b) return x < a ? 0 : 1; const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const smoother = (t) => { t = clamp(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
  WL.util = { clamp, lerp, sstep, smoother };

  // a cubic Bezier ease from (0,0) to (1,1) with handles (x1, 0) and (x2, 1), like CSS
  WL.bezier = function (x1, x2, u) { return WL.Cam.bezier(x1, 0, x2, 1, u); };
  WL.spreadEase = (P, u) => 1 - Math.pow(1 - clamp(u, 0, 1), 1 + 5 * P.t23.spreadEase);

  // ---------- 1 → 2: the contraction ----------
  // the rush (fast, braking hard), the slow part (a creep, still blurred), the whoosh (a sudden
  // collapse). The speed runs on from part to part without a jump.
  WL.contractTimes = function (P) {
    const T = P.t12, T1 = Math.max(0.02, T.rushTime), T2 = Math.max(0, T.crawlTime), T3 = Math.max(0.02, T.whooshTime);
    return { T1, T2, T3, dur: T1 + T2 + T3 };
  };
  // how far it has contracted at time t (0 = the whole blur, 1 = the logo)
  WL.contract = function (P, t) {
    const T = P.t12, tm = WL.contractTimes(P), T1 = tm.T1, T2 = tm.T2, T3 = tm.T3;
    if (t <= 0) return 0;
    if (t >= tm.dur) return 1;
    const a = clamp(T.rushTo, 0, 0.995);
    const b = T2 > 0 ? clamp(T.crawlTo, a, 0.999) : a;
    const ce = clamp(T.crawlEase, 0, 1);
    const vc = T2 > 0 ? (b - a) / T2 : 0;
    const v1 = Math.min((1 + ce) * vc, 0.9 * a / T1);           // the speed going into the slow part
    const v2 = Math.min((1 - ce) * vc, 0.9 * (1 - b) / T3);     // and coming out of it
    if (t < T1) { const u = t / T1, n = Math.max(1.01, T.rushBrake); return v1 * t + (a - v1 * T1) * (1 - Math.pow(1 - u, n)); }
    if (t < T1 + T2) { const s = (t - T1) / T2; return a + (b - a) * ((1 - ce) * s + ce * (1 - (1 - s) * (1 - s))); }
    const tw = t - T1 - T2, u = tw / T3, m = Math.max(1.01, T.whooshSharp);
    return b + v2 * tw + (1 - b - v2 * T3) * Math.pow(u, m);
  };

  // ---------- 2 → 3: the lines going in ----------
  // line j (0 = W, 1 = H, 2 = E) at s (0..1 of all the sliding): 0 = still outside, 1 = in place
  WL.lineIn = function (P, s, j) {
    const T = P.t23, it = Math.max(0.1, T.insTime), st = Math.max(0, T.insStagger), n = WL.LINE_COUNT || 3;
    const tot = it + st * (n - 1);
    const u = clamp((s * tot - j * st) / it, 0, 1);
    return WL.bezier(clamp(T.insSlowStart, 0, 1), clamp(1 - T.insSlowEnd, 0, 1), u);
  };

  // a small seeded random generator (so a pattern number replays the same glitches)
  function rng(seed) {
    let s = (seed >>> 0) || 1;
    const f = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
    return { f, range: (a, b) => a + (b - a) * f(), int: () => Math.floor(f() * 1e6) };
  }
  WL.rng = rng;
  WL.hash = function (a, b) { let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

  const CH = ['blur', 'bright', 'spread', 'spaces', 'bloom', 'bloomSize', 'bloomBr', 'chrome', 'final', 'breath', 'glitch', 'char'];
  WL.CHANNELS = CH;
  // going back, these go first (by this share of the way), so your PSD layers never ghost over moving letters
  // (and White glitches away)
  const FAST_BACK = { glitch: 0.3, final: 0.15, chrome: 0.3, char: 0.3 };
  const charOn = (P) => !!(P.white && P.white.on);

  // the resting numbers of each stage
  function rest(i, P) {
    if (i === 0) { const S = P.s1; return { blur: S.length, bright: S.bright, spread: 0, spaces: 0, bloom: S.bloom, bloomSize: S.bloomSize, bloomBr: S.bloomBreath, chrome: 0, final: 0, breath: S.breath, glitch: 0, char: 0 }; }
    if (i === 1) { const S = P.s2; return { blur: 0, bright: 1, spread: 0, spaces: 0, bloom: S.bloom, bloomSize: S.bloomSize, bloomBr: S.bloomBreath, chrome: 0, final: 0, breath: S.breath, glitch: 0, char: 0 }; }
    const S = P.s3;
    return { blur: 0, bright: 1, spread: 1, spaces: 1, bloom: S.bloom, bloomSize: S.bloomSize, bloomBr: S.bloomBreath, chrome: 1, final: S.look === 'psd' ? 1 : 0, breath: S.breath, glitch: 0, char: charOn(P) ? 1 : 0 };
  }
  WL.rest = rest;

  const STYLE_SIMPLE = { w: [1, 0, 1, 0] };     // while spreading: chrome splits and diverge rows only
  const STYLE_FLASH = { w: [1, 0.5, 1, 0.2] };

  // ---------- the transitions ----------
  // each: dur(P), curve(t, P, m) -> numbers (+ m.glStyle the glitch's style), done when t >= dur
  const TRANS = {
    '0>1': {
      sec: 't12',
      dur: (P) => WL.contractTimes(P).dur,
      curve(t, P) {
        const p = WL.contract(P, t), a = rest(0, P), b = rest(1, P);
        return {
          blur: a.blur * (1 - p), bright: lerp(a.bright, b.bright, p), spread: 0, spaces: 0,
          bloom: lerp(a.bloom, b.bloom, p), bloomSize: lerp(a.bloomSize, b.bloomSize, p), bloomBr: lerp(a.bloomBr, b.bloomBr, p),
          chrome: 0, final: 0, breath: lerp(a.breath, b.breath, p), glitch: 0, char: 0,
        };
      },
    },
    '1>2': {
      sec: 't23',
      // the spread, then (sliding) the lines going in, then the glitch phase, then the settle; then
      // (once the logo and the camera are done) White glitches in, and the transition ends at its flash
      times(P) {
        const T = P.t23, Ds = Math.max(0.05, T.spreadDur), slide = T.linesIn !== 'fade';
        const i0 = Math.max(0, Ds + T.insAt);
        const it = slide ? Math.max(0.1, T.insTime) + Math.max(0, T.insStagger) * ((WL.LINE_COUNT || 3) - 1) : 0;
        const I1 = slide ? i0 + it : Ds;
        const g0 = Math.max(0, I1 + T.glAfter), E = g0 + Math.max(0.1, T.glLen);
        const logoEnd = Math.max(Ds, I1, E + Math.max(0.02, T.settle));
        const chOn = charOn(P), C = P.white || {};
        const camEnd = Math.max(0, T.camAt) + Math.max(0.05, T.camTime);
        const c0 = Math.max(0, Math.max(logoEnd, camEnd) + (C.inAfter || 0)), cf = c0 + Math.max(0.05, C.inTime || 1);
        return { Ds, slide, i0, it, I1, g0, E, logoEnd, chOn, c0, cf, end: chOn ? Math.max(logoEnd, cf + 0.05) : logoEnd };
      },
      dur(P) { return this.times(P).end; },
      // the glitch phase's rhythm: calm and glitching stretches, more violent as it goes, then the last push
      plan(P, seed) {
        const T = P.t23, L = Math.max(0.1, T.glLen), r = rng(seed), segs = [];
        const push = Math.min(0.3, L * 0.25);
        let t = r.range(0, 0.08);
        while (t < L - push) {
          const v = t / L, V = lerp(T.glFrom, T.glTo, Math.pow(v, 1.3));
          const on = r.range(0.05, 0.22) * (0.6 + 0.8 * V) * (0.5 + T.glOn);
          segs.push({ t0: t, t1: Math.min(L - push, t + on), lvl: V * r.range(0.65, 1), seed: r.int() });
          t += on + r.range(0.04, 0.3) * (1.25 - 0.75 * V) * 2 * (1 - T.glOn);
        }
        segs.push({ t0: L - push, t1: L, lvl: T.glTo, seed: r.int() });
        return segs;
      },
      curve(t, P, m) {
        const T = P.t23, tm = this.times(P), a = rest(1, P), b = rest(2, P);
        const us = clamp(t / tm.Ds, 0, 1), es = WL.spreadEase(P, us);
        // the glitch: simple flickers while spreading, then the phase
        let gl = 0, style = STYLE_SIMPLE, clockRate = 10;
        if (t < tm.Ds && T.spreadGl > 0) {
          const k = Math.floor(t * 9), on = WL.hash(k, m.seed) < 0.45;
          if (on) gl = T.spreadGl * (0.6 + 0.4 * WL.hash(k, m.seed + 7));
        }
        const tau = t - tm.g0, L = Math.max(0.1, T.glLen);
        if (tau >= 0) {
          let g = 0, sd = 0;
          if (tau <= L) {
            for (const s of m.plan) if (tau >= s.t0 && tau < s.t1) { g = s.lvl * Math.min(1, (tau - s.t0) / 0.015, (s.t1 - tau) / 0.015 + 0.25); sd = s.seed; break; }
          } else {
            g = T.glTo * (1 - sstep(0, Math.max(0.02, T.settle), tau - L));
            sd = m.plan.length ? m.plan[m.plan.length - 1].seed : 0;
          }
          if (g >= gl) {
            gl = g;
            style = { w: [T.wChrome, T.wArtifact, T.wDiverge, T.wHalftone], seedBase: sd };
            clockRate = (8 + 22 * g) * T.glSpeed;
          }
        }
        m.glStyle = style; m.clockRate = clockRate;
        const fx = Math.max(T.settle, 0.25);
        const spaces = tm.slide ? clamp((t - tm.i0) / tm.it, 0, 1) : sstep(T.spacesFrom, 1, es);
        const sb = sstep(0, tm.Ds, t);
        return {
          blur: 0, bright: 1, spread: es, spaces,
          bloom: lerp(a.bloom, b.bloom, sb), bloomSize: lerp(a.bloomSize, b.bloomSize, sb), bloomBr: lerp(a.bloomBr, b.bloomBr, sb),
          chrome: sstep(tm.g0, tm.E, t), final: b.final * sstep(tm.E - fx, tm.E, t),
          breath: lerp(a.breath, b.breath, clamp(t / tm.logoEnd, 0, 1)), glitch: gl,
          char: tm.chOn ? WL.charIn(P.white, t - tm.c0) : 0,
        };
      },
    },
  };
  WL.TRANS = TRANS;

  // what the panel's graphs show for each transition
  WL.GRAPHS = {
    t12(P) {
      const tm = WL.contractTimes(P);
      return {
        dur: tm.dur,
        lines: [{ name: 'contraction', color: '#ffffff', f: (t) => WL.contract(P, t), speed: true }],
        bands: [
          { t0: 0, t1: tm.T1, name: 'rush', color: 'rgba(255,255,255,0.07)' },
          { t0: tm.T1, t1: tm.T1 + tm.T2, name: 'slow', color: 'rgba(255,255,255,0.03)' },
          { t0: tm.T1 + tm.T2, t1: tm.dur, name: 'whoosh', color: 'rgba(255,255,255,0.1)' },
        ],
        marks: [{ t: tm.dur, name: 'boom' }],
      };
    },
    t23(P) {
      const tm = TRANS['1>2'].times(P);
      const lines = [{ name: 'spread', color: '#ffffff', f: (t) => WL.spreadEase(P, t / tm.Ds) }];
      if (tm.slide) lines.push({ name: 'lines in', color: '#ffd27a', f: (t) => WL.lineIn(P, clamp((t - tm.i0) / tm.it, 0, 1), 0) });
      const bands = [{ t0: 0, t1: tm.Ds, name: 'spread', color: 'rgba(255,255,255,0.07)' }];
      if (tm.slide) bands.push({ t0: tm.i0, t1: tm.I1, name: 'lines', color: 'rgba(255,210,122,0.12)' });
      bands.push({ t0: tm.g0, t1: tm.E, name: 'glitch', color: 'rgba(255,90,140,0.13)' }, { t0: tm.E, t1: tm.logoEnd, name: '', color: 'rgba(255,255,255,0.04)' });
      const marks = [];
      if (tm.chOn) {
        bands.push({ t0: tm.c0, t1: tm.cf, name: 'White', color: 'rgba(196,170,255,0.14)' });
        lines.push({ name: 'White', color: '#c4aaff', f: (t) => WL.charIn(P.white, t - tm.c0) });
        marks.push({ t: tm.cf, name: 'flash' });
      }
      return { dur: tm.end, lines, bands, marks };
    },
  };

  WL.Anim = class {
    constructor(P) {
      this.P = P;
      this.t = 0;
      this.stage = 0;              // the stage we are at, or are leaving
      this.motion = null;
      this.queue = 0;              // clicks waiting for the running transition to finish
      this.events = [];
      this.base = rest(0, P);
      this.brT = 0;                // breathing flow time (already times the flow speed)
      this.brPh = 0;               // breaths so far
      this.clock = 0;              // the glitch pieces' clock
      this.glStyle = STYLE_SIMPLE;
      this.nextBlip = null; this.nextSpot = null;
      this.spotN = 1;
      this.rnd = Math.random;
      this.cam = { cur: this.frameOf(0), mv: null, user: false };
      // White: how far it is in (after "Come in again" too), and what moves it
      this.chC = 0;
      this.chm = WL.CharacterMotion ? new WL.CharacterMotion(() => this.rnd()) : null;
    }
    get last() { return 2; }
    // where we are, for the panel: 'stage' or 'trans' with from/to and progress
    status() {
      const m = this.motion;
      if (!m) return { kind: 'stage', stage: this.stage };
      return { kind: m.kind, from: m.from, to: m.to, u: clamp((this.t - m.t0) / m.dur, 0, 1), queue: this.queue };
    }

    // ---------- the camera ----------
    frameOf(i) { const s = this.P[WL.ANIMATION.stageSecs[i]]; return { z: s.camZoom, x: s.camX, y: s.camY }; }
    camTarget() { return this.motion ? this.motion.to : this.stage; }
    _camMove(to, sec, dur) { this.cam.mv = { a: { ...this.cam.cur }, to, t0: this.t, sec, dur }; this.cam.user = false; }
    // you moved the view (pinch, scroll, drag)
    camUser(f) { this.cam.cur = f; this.cam.mv = null; this.cam.user = true; }
    // the view on screen becomes stage i's frame (the stage you are at, or going to)
    camRecord(i) {
      if (i == null) i = this.camTarget();
      const s = this.P[WL.ANIMATION.stageSecs[i]], c = this.cam.cur;
      s.camZoom = +c.z.toFixed(3); s.camX = +c.x.toFixed(1); s.camY = +c.y.toFixed(1);
      if (i === this.camTarget()) { this.cam.user = false; this.cam.mv = null; }
      return i;
    }
    // back to the saved frame, smoothly
    camRevert() { this._camMove(this.camTarget(), null, 0.45); }
    camStatus() { const c = this.cam, i = this.camTarget(); return { user: c.user, moving: !!c.mv && !WL.Cam.same(c.cur, this.frameOf(i)), z: c.cur.z, target: i }; }
    _camUpdate() {
      const c = this.cam, t = this.t;
      if (c.mv) {
        const mv = c.mv, T = mv.sec ? this.P[mv.sec] : null;
        const at = T ? Math.max(0, T.camAt) : 0, dur = T ? Math.max(0.01, T.camTime) : Math.max(0.01, mv.dur);
        const u = clamp((t - mv.t0 - at) / dur, 0, 1);
        const e = T ? WL.Cam.bezier(T.camX1, T.camY1, T.camX2, T.camY2, u) : WL.Cam.bezier(0.42, 0, 0.58, 1, u);
        c.cur = WL.Cam.lerp(mv.a, this.frameOf(mv.to), e);
        if (u >= 1) c.mv = null;
      } else if (!c.user) c.cur = this.frameOf(this.camTarget());
    }

    // ---------- the breathing rhythm ----------
    // 0 = breathed out, 1 = breathed in (0.5 when it does not breathe)
    breathPulse() {
      const W = this.P.whole;
      if (!(W.brRate > 0)) return 0.5;
      const n = Math.floor(this.brPh), x = this.brPh - n, inh = clamp(W.brInhale, 0.05, 0.95);
      const v = x < inh ? 0.5 - 0.5 * Math.cos(Math.PI * x / inh) : 0.5 + 0.5 * Math.cos(Math.PI * (x - inh) / (1 - inh));
      return v * (1 - clamp(W.brUneven, 0, 1) * 0.45 * WL.hash(n, 313));
    }

    _start(kind, from, to) {
      const P = this.P, now = this.t;
      const m = { kind, from, to, t0: now, captured: { ...this.base }, offset: null, seed: 0, plan: null };
      if (kind === 'fwd') {
        m.tr = TRANS[from + '>' + to];
        m.dur = m.tr.dur(P);
        const sd = to === 2 ? (P.t23.seed > 0 ? Math.round(P.t23.seed) : Math.floor(this.rnd() * 1e6) + 1) : 1;
        m.seed = sd;
        if (to === 2) { m.plan = m.tr.plan(P, sd); this._onset(); }
        const c0 = m.tr.curve(0, P, m);
        m.offset = {};
        let any = false;
        for (const c of CH) { m.offset[c] = this.base[c] - c0[c]; if (Math.abs(m.offset[c]) > 1e-4) any = true; }
        if (!any) m.offset = null;
        this._camMove(to, m.tr.sec);
      } else {
        m.dur = kind === 'back' ? Math.max(0.05, P.whole.back) : 0.35;
        m.target = rest(to, P);
        if (kind === 'back') for (const e of this.events) if (e.kill == null) e.kill = now;
        this._camMove(to, null, m.dur);
      }
      this.motion = m;
      this.stage = from;
      this.nextBlip = this.nextSpot = null;
    }

    // right half: the next stage (during a transition it waits for it to finish)
    next() {
      const m = this.motion;
      if (m) {
        if (m.kind === 'fwd') { if (m.to + this.queue < this.last) this.queue++; return; }
        // half way back: turn round and go back to where we came from
        this._start('jump', m.to, m.from);
        this.motion.dur = this.cam.mv.dur = Math.max(0.2, 0.6 * this.P.whole.back);
        return;
      }
      if (this.stage < this.last) this._start('fwd', this.stage, this.stage + 1);
    }
    // left half: back to the previous stage, smoothly
    back() {
      const m = this.motion;
      this.queue = 0;
      let target;
      if (m) target = m.kind === 'fwd' ? m.from : Math.max(0, m.to - 1);
      else target = this.stage - 1;
      if (target < 0) return;
      this._start('back', m ? m.to : this.stage, target);
    }
    // straight to a stage (keys 1 2 3), with a short blend
    go(i) { this.queue = 0; for (const e of this.events) if (e.kill == null) e.kill = this.t; this._start('jump', this.stage, i); }
    // play a transition from its start (the panel's Play buttons)
    play(from) {
      this.queue = 0; this.events = []; this.motion = null;
      this.stage = from; this.base = rest(from, this.P);
      this.cam = { cur: this.frameOf(from), mv: null, user: false };
      this._start('fwd', from, from + 1);
    }
    restart() {
      this.queue = 0; this.events = []; this.motion = null; this.stage = 0; this.base = rest(0, this.P); this.nextBlip = this.nextSpot = null;
      this.cam = { cur: this.frameOf(0), mv: null, user: false };
    }

    // ---------- White ----------
    // its flash: a big bloom that cools down while the glitch effects come in; it wobbles as it arrives
    _chFlash(t0) { this.events.push({ kind: 'chFlash', t0 }); if (this.chm) this.chm.pop(this.P.white); }
    // the panel's buttons: come in again (at stage 3), a flash now, a glitch breath now
    charAgain() { if (!this.motion && this.stage === 2 && charOn(this.P)) { this.events = this.events.filter((e) => e.kind !== 'chIn' && e.kind !== 'chFlash'); this.events.push({ kind: 'chIn', t0: this.t }); } }
    charFlash() { if (this.chC > 0) this._chFlash(this.t); }
    charGlitch() { if (this.chm) this.chm.glitchNow(); }

    // ---------- events ----------
    _flash() { this.events.push({ kind: 'flash', t0: this.t }); }
    _onset() { const P = this.P.t23; if (P.onset !== 'none' && P.onsetStrength > 0) this.events.push({ kind: 'onset', t0: this.t, type: P.onset }); }
    blip() {
      const P = this.P.s1, r = this.rnd, ang = r() * Math.PI * 2;
      const withCA = r() < P.blipCA;
      this.events.push({ kind: 'blip', t0: this.t, len: lerp(P.blipLen, Math.max(P.blipLen, P.blipLenTo), r()), ca: withCA ? P.blipCADist * (0.6 + 0.4 * r()) * (r() < 0.75 ? 1 : -1) : 0, move: [Math.cos(ang) * P.blipMove * (0.5 + 0.5 * r()), Math.sin(ang) * P.blipMove * (0.5 + 0.5 * r())] });
    }
    spot(delay = 0) {
      const P = this.P.s3, r = this.rnd;
      const where = [];
      if (P.spE) where.push(WL.SPOTS.E); if (P.spI) where.push(WL.SPOTS.I); if (P.spH) where.push(WL.SPOTS.H);
      let s;
      if (!where.length || r() < P.spElse) {
        // a random part of a random letter (at the Separated places)
        const L = WL.ASSET_LETTERS[Math.floor(r() * WL.ASSET_LETTERS.length)];
        s = [L.x + L.dx + L.w * (0.2 + 0.6 * r()), L.y + L.dy + L.h * (0.2 + 0.6 * r()), 60];
      } else s = where[Math.floor(r() * where.length)];
      this.events.push({ kind: 'spot', t0: this.t + delay, len: lerp(P.spLen, Math.max(P.spLen, P.spLenTo), r()), x: s[0], y: s[1], r: s[2], id: this.spotN++ * 7919 });
    }

    // ---------- every frame ----------
    update(dt) {
      const P = this.P;
      this.t += dt;
      const t = this.t;
      this.brT += dt * P.whole.brSpeed;
      if (P.whole.brRate > 0) {
        const n = Math.floor(this.brPh), len = 1 + clamp(P.whole.brUneven, 0, 1) * 0.5 * (WL.hash(n, 911) * 2 - 1);
        this.brPh += dt * P.whole.brRate / 60 / Math.max(0.3, len);
      }

      // the running motion
      const m = this.motion;
      if (m) {
        const tm = t - m.t0;
        if (m.kind === 'fwd') {
          const c = m.tr.curve(Math.min(tm, m.dur), P, m);
          if (m.offset) { const k = 1 - sstep(0, 0.35, tm); for (const ch of CH) c[ch] += m.offset[ch] * k; }
          this.base = c;
          if (m.glStyle) this.glStyle = m.glStyle;
          this.clock += dt * (m.clockRate || 10);
          // White's flash, once, as it finishes glitching in
          if (m.to === 2 && !m.chFlashed) {
            const tt = m.tr.times(P);
            if (tt.chOn && tm >= tt.cf) { m.chFlashed = true; this._chFlash(m.t0 + tt.cf); }
          }
        } else {
          const u = clamp(tm / m.dur, 0, 1), c = {};
          for (const ch of CH) c[ch] = lerp(m.captured[ch], m.target[ch], FAST_BACK[ch] ? sstep(0, FAST_BACK[ch], u) : smoother(u));
          this.base = c;
          this.clock += dt * 10;
        }
        if (tm >= m.dur) {
          this.motion = null;
          this.stage = m.to;
          if (m.kind === 'fwd') {
            this.base = rest(m.to, P);
            if (m.to === 1) this._flash();
          } else this.base = { ...m.target };
          if (this.queue > 0 && m.kind === 'fwd') { this.queue--; this._start('fwd', this.stage, this.stage + 1); }
        }
      } else {
        this.base = rest(this.stage, P);
        this.clock += dt * 12;
      }
      this._camUpdate();

      // White: how far it is in ("Come in again" plays its coming in once more), and its motion
      let chC = clamp(this.base.char || 0, 0, 1);
      for (const e of this.events) {
        if (e.kind !== 'chIn') continue;
        const tau = t - e.t0, T = Math.max(0.05, P.white.inTime);
        chC = Math.min(chC, WL.charIn(P.white, tau));
        if (tau >= T && !e.flashed) { e.flashed = true; this._chFlash(e.t0 + T); }
      }
      this.events = this.events.filter((e) => e.kind !== 'chIn' || !e.flashed);
      this.chC = chC;
      if (this.chm) this.chm.update(dt, P.white, chC);

      // the stage's own loop
      const idle = !this.motion;
      if (idle && this.stage === 0 && P.s1.blipOn) {
        if (this.nextBlip == null) this.nextBlip = t + lerp(P.s1.blipEvery, Math.max(P.s1.blipEvery, P.s1.blipEveryTo), this.rnd());
        if (t >= this.nextBlip) { this.blip(); this.nextBlip = null; }
      } else this.nextBlip = null;
      if (idle && this.stage === 2 && P.s3.spOn) {
        if (this.nextSpot == null) this.nextSpot = t + lerp(P.s3.spEvery, Math.max(P.s3.spEvery, P.s3.spEveryTo), this.rnd());
        if (t >= this.nextSpot) {
          this.spot();
          if (this.rnd() < P.s3.spTwice) this.spot(0.08 + 0.15 * this.rnd());
          this.nextSpot = null;
        }
      } else this.nextSpot = null;

      return this.look();
    }

    look() {
      const P = this.P, b = this.base, t = this.t, W = P.whole;
      const pulse = this.breathPulse();
      const amp = Math.max(0, 1 + clamp(W.brDepth, 0, 1) * (2 * pulse - 1));
      const br = Math.max(0, b.breath) * amp;
      const L = {
        blur: Math.max(0, b.blur), bright: b.bright, spread: b.spread, spaces: clamp(b.spaces, 0, 1), spacesMode: P.t23.linesIn,
        bloom: Math.max(0, b.bloom), bloomSize: Math.max(0.05, b.bloomSize), bloomBr: clamp(b.bloomBr, 0, 1),
        chrome: clamp(b.chrome, 0, 1), final: clamp(b.final, 0, 1),
        breathLight: br * (1 - W.brMix) * 0.6, breathGlow: br * W.brMix * 1.4, brShift: clamp(W.brSwell, 0, 1) * (pulse - 0.5) * 0.3, pulse,
        flash: 0, halo: 0, ca: 0, glitch: clamp(b.glitch, 0, 1), htAll: 0, jitter: [0, 0], spots: [],
        brT: this.brT, clock: this.clock, glStyle: this.glStyle, cam: { ...this.cam.cur },
      };
      // drift: only while the blur is out (it fades as the blur contracts)
      const w1 = P.s1.length > 0 ? clamp(L.blur / P.s1.length, 0, 1) : 0;
      if (w1 > 0 && P.s1.drift > 0) {
        const s = t * P.s1.driftSpeed;
        L.jitter[0] += P.s1.drift * w1 * (0.6 * Math.sin(1.31 * s + 0.4) + 0.4 * Math.sin(2.93 * s + 1.7));
        L.jitter[1] += P.s1.drift * w1 * (0.6 * Math.sin(1.07 * s + 2.1) + 0.4 * Math.sin(2.41 * s + 0.3));
      }
      // the events
      let glEvt = 0, glEvtStyle = null, chFlash = 0, chHalo = 0, chEnv = 0;
      const keep = [];
      for (const e of this.events) {
        const tau = t - e.t0;
        let fade = 1;
        if (e.kill != null) { fade = 1 - (t - e.kill) / 0.2; if (fade <= 0) continue; }
        let alive = true;
        if (e.kind === 'flash') {
          const T = P.t12, att = 0.035, tt = Math.max(0, tau - att);
          const a = sstep(0, att, tau);
          const env = a * (T.flashFastShare * Math.exp(-tt / Math.max(0.01, T.flashFast)) + (1 - T.flashFastShare) * Math.exp(-tt / Math.max(0.01, T.flashSlow)));
          L.flash += T.flash * env * fade;
          L.halo += T.flash * T.flashHalo * env * fade;
          if (T.flashCAOn) L.ca = Math.max(L.ca, T.flashCA * a * Math.exp(-tt / Math.max(0.01, 1.2 * T.flashFast)) * fade);
          if (T.flashGlOn && tau < T.flashGlLen) { const g = T.flashGl * Math.pow(1 - tau / T.flashGlLen, 0.7) * a * fade; if (g > glEvt) { glEvt = g; glEvtStyle = STYLE_FLASH; } }
          alive = env > 0.002 || tau < T.flashGlLen;
        } else if (e.kind === 'onset') {
          const T = P.t23, len = Math.max(0.05, T.onsetLen), u = tau / len;
          if (u >= 1) alive = false;
          else {
            const env = sstep(0, 0.03, tau) * Math.pow(1 - u, 2) * T.onsetStrength * fade;
            const ty = e.type;
            if (ty === 'bloom' || ty === 'bloomchrome') { L.flash += 0.9 * env; L.halo += 0.35 * env; }
            if (ty === 'chrome' || ty === 'bloomchrome') L.ca = Math.max(L.ca, 40 * env);
            if (ty === 'glitch' && 0.6 * env > glEvt) { glEvt = Math.min(1, 0.6 * env); glEvtStyle = STYLE_FLASH; }
            if (ty === 'halftone') L.htAll = Math.max(L.htAll, Math.min(1, 0.85 * env));
          }
        } else if (e.kind === 'blip') {
          const u = tau / e.len;
          if (u >= 1) alive = false;
          else if (u > 0) {
            const env = (u < 0.2 ? sstep(0, 0.2, u) : 1 - sstep(0.2, 1, u)) * fade;
            if (Math.abs(e.ca * env) > Math.abs(L.ca)) L.ca = e.ca * env;   // (negative: the colours split the other way)
            L.jitter[0] += e.move[0] * env; L.jitter[1] += e.move[1] * env;
          }
        } else if (e.kind === 'chFlash') {
          const S = P.white, env = WL.charFlashEnv(S, tau) * fade;
          chFlash += S.flash * env; chHalo += S.flash * S.flashHalo * env; chEnv = Math.max(chEnv, env);
          alive = env > 0.002 || tau < 0.05;
        } else if (e.kind === 'chIn') {
          alive = true;
        } else if (e.kind === 'spot') {
          const u = tau / e.len;
          if (u >= 1) alive = false;
          else if (u >= 0 && L.spots.length < 3) {
            const a = Math.min(1, u / 0.08) * Math.pow(1 - u, 1.4) * P.s3.spStrength * fade;
            L.spots.push({ x: e.x, y: e.y, r: e.r * P.s3.spSize, w: a, seed: e.id + Math.floor(tau * 30) * 131 });
          }
        }
        if (alive) keep.push(e);
      }
      this.events = keep;
      if (glEvt > L.glitch) { L.glitch = glEvt; L.glStyle = glEvtStyle; }
      // White: what it looks like now (the glitch effects come in as its flash cools down)
      L.ch = null;
      if (this.chm && this.chC > 0) {
        const S = P.white;
        L.ch = { c: this.chC, burst: this.chm.burst, pose: this.chm.pose(S), tw: this.chm.tw, tide: this.chm.tideW(S), flash: chFlash, halo: chHalo, post: 1 - clamp(chEnv, 0, 1) };
      }
      return L;
    }
  };
})();
