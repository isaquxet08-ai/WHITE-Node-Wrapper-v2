// Animation Engine: characters ("putting characters in"). A character is a picture of one figure (a
// PNG with transparency, already through its own Bloom and Chrome, like a White Engine export), put
// into an animation and brought to life:
//   - its rig, found from the picture by source/tools/export_character.py: the head (a circle), the
//     neck (where the head turns), the eyes, its feet (the middle of where the picture is cut off)
//   - a mesh over the picture that bends: the head turns like a ball on the neck (the face moves, the
//     outline stays), nods and tilts; the body breathes and sways; it wobbles like jelly as it arrives
//   - White Engine's post effects after it, worked out live every frame: Glitch Artifact under it,
//     Glitch Diverge over it, and the glitch breathing (bands jump, colours split, the head jerks)
//   - how it comes in: glitches that build up, a flash (a big bloom), the bloom cools down while the
//     effects come in, and then the constant state, which stays
// Distances of the effects are White Engine pixels (so your White Engine numbers mean the same here),
// times "Effect scale" (the character's head here against White Engine's head) and the character's size.
(function () {
  const WL = (window.WL = window.WL || {});
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const c01 = (v) => clamp(v, 0, 1);
  const smooth = (a, b, x) => { const t = c01((x - a) / Math.max(1e-6, b - a)); return t * t * (3 - 2 * t); };
  const DEG = Math.PI / 180;
  // a slow wandering number in about -1..1 (as in White Engine)
  const wave = (t, a, b, c) => (Math.sin(t + a) + 0.6 * Math.sin(2.3 * t + b) + 0.35 * Math.sin(4.1 * t + c)) / 1.95;
  // the share of a Gaussian beyond z sigmas: erfc(z / sqrt 2) / 2 (as in White Engine)
  function tail(z) {
    const x = z / Math.SQRT2, t = 1 / (1 + 0.5 * Math.abs(x));
    const y = t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return 0.5 * (x >= 0 ? y : 2 - y);
  }
  // which half-size level to blur at for a blur of sigma px, and the sigma there (as in White Engine)
  function pickLevel(sigma, maxL = 6) {
    let L = 1;
    while (L < maxL && sigma / 2 ** L > 3) L++;
    const s = sigma / 2 ** L;
    return { L, sigma: Math.sqrt(Math.max(0, s * s - 0.35)) };
  }

  // ---------------------------------------------------------------------------------------------
  // The settings. The standard ones are White's: the post effects and the glitch breathing are your
  // White Engine tuning (settings v15), the rest was chosen here.
  WL.CHAR_DEFAULTS = {
    name: 'the character', fx: 0.452,
    on: true, inAfter: 0.2, inTime: 1.4, inSlow: 0.5, inViolence: 0.85, inSize: 1,
    flash: 2.6, flashSize: 110, flashHalo: 0.9, flashFast: 0.14, flashFastShare: 0.7, flashSlow: 1.4,
    pop: 1, popSpeed: 2.6, popSettle: 0.22,
    x: 0, y: 0, size: 1, mirror: false, rig: false,
    turn: 3.5, nod: 2.5, tilt: 2.5, moveSpeed: 1, breathe: 1, breathLen: 2.6, sway: 0.6,
    artOn: true, artGlitch: 1, artAmount: 1, artBlock: 3.9, artZoom: 0.55, artGrain: 1.25, artReach: 450, artEvaporate: 980,
    artStrength: 4.6, artOpacity: 0.87, artRate: 29, artSeed: 1,
    tide: true, tidePeriod: 27.5, tideHold: 0.6, tideSoft: 0.3, tideLean: 0,
    charMask: true, charExpand: 95, charFade: 114, charStrength: 1,
    divOn: true, divGlitch: 1, divZoom: 0, divRed: 8, divGreen: -7.5, divBlue: 5, wander: true, wanderMin: 18, wanderMax: 15,
    dust: 0.3, dustReach: 116, divOpacity: 0.58, divRate: 50, divSeed: 1, eraseEyes: 0.75, eraseNeck: 0.48, eraserSize: 1.49, eraserSoft: 0.52,
    brOn: true, brSize: 0.45, brViolence: 0.37, brEvery: 2.3, brEveryTo: 8, brLongChance: 0.49, brLong: 14, brLen: 0.1, brLenTo: 0.5,
    brJump: 160, brPieces: 0.48, brJolt: 75, brSplit: 2.45, brSpeed: 10.5, brTwitch: 1,
  };

  // A character's settings for its panel section. d: its own defaults (anything left out takes the
  // standard ones above).
  WL.characterItems = function (d) {
    const D = { ...WL.CHAR_DEFAULTS, ...(d || {}) };
    const n = (k, label, min, max, step, unit, hint) => ({ k, label, min, max, step, def: D[k], unit, hint });
    const tog = (k, label, hint) => ({ k, label, type: 'toggle', def: D[k], hint });
    return [
      { group: 'Comes in: glitches that build up, a flash (a big bloom), the bloom cools down while the glitch effects come in, then it stays' },
      tog('on', 'Show ' + D.name),
      n('inAfter', 'Comes in after', -8, 8, 0.01, 's', 'Seconds after the logo and the camera have finished in 2 → 3. Below 0 = while they are still going.'),
      n('inTime', 'Glitching in', 0.1, 6, 0.01, 's', 'How long the glitches go on before the flash.'),
      n('inSlow', 'Builds up slowly', 0, 1, 0.01, '', 'How slowly the glitches build up: 0 = evenly; 1 = only a few at first, then a rush just before the flash.'),
      n('inViolence', 'Glitch violence', 0, 1, 0.01, '', 'How wild the glitches get just before the flash: how fast they change and how much of it breaks.'),
      n('inSize', 'Glitch size', 0, 3, 0.01, '', 'How far the bands jump, the picture jolts and the head jerks while it glitches in (1 = the glitch breathing\'s sizes, at Size 1).'),
      { group: 'The flash and the cool-down' },
      n('flash', 'Flash strength', 0, 8, 0.05, '', 'How hard it blooms.'),
      n('flashSize', 'Flash size', 10, 400, 1, 'px', 'How far the glow reaches (PSD pixels, at size 1).'),
      n('flashHalo', 'Wide halo', 0, 3, 0.01, '', 'A second glow, four times wider.'),
      n('flashFast', 'Fast cool-down', 0.02, 1.5, 0.01, 's', 'Most of the flash is gone after about this long.'),
      n('flashFastShare', 'Fast share', 0, 1, 0.01, '', 'The rest of the glow cools down slowly, and the glitch effects come in as it does.'),
      n('flashSlow', 'Slow cool-down', 0.05, 6, 0.05, 's'),
      n('pop', 'Wobble as it arrives', 0, 3, 0.01, '', 'At the flash it wobbles like jelly: it stretches up and squashes down, the head turns and tilts, and it settles. 0 = none.'),
      n('popSpeed', 'Wobble speed', 0.3, 10, 0.05, 'Hz', 'How fast the wobble goes back and forth.'),
      n('popSettle', 'Wobble settles', 0.03, 1, 0.01, '', 'How fast the wobble dies away (1 = at once).'),
      { type: 'buttons', items: [['Come in again', 'chAgain'], ['Flash now', 'chFlash']] },
      { group: 'Where it is. Shift + drag on the picture moves it; Shift + scroll (or Shift + pinch) sizes it.' },
      n('x', 'Across', -4000, 4000, 1, 'px', 'PSD pixels from where your picture has it.'),
      n('y', 'Down', -3000, 3000, 1, 'px'),
      n('size', 'Size', 0.1, 4, 0.01, '', 'Round its feet (the middle of the bottom). 1 = as in your picture.'),
      tog('mirror', 'Mirror (face the other way)'),
      tog('rig', 'Show the head and neck it found', 'Draws the head circle, the neck line (the head turns there), the eyes and the feet over the picture.'),
      { type: 'buttons', items: [['Back to your picture\'s place', 'chPlace']] },
      { group: 'Alive: a little movement all the time' },
      n('turn', 'Head turn', 0, 20, 0.1, '°', 'How far the head turns left and right. It turns like a ball on the neck: the face moves, the outline stays.'),
      n('nod', 'Head nod', 0, 20, 0.1, '°'),
      n('tilt', 'Head tilt', 0, 20, 0.1, '°', 'It tilts on the neck.'),
      n('moveSpeed', 'Speed', 0, 4, 0.01, '', 'How fast the head and the sway move (1 = slow and calm; 0 = still).'),
      n('breathe', 'Breathing', 0, 4, 0.01, '', 'The body breathes: a little taller and wider, then back. 0 = still.'),
      n('breathLen', 'Breath length', 0.5, 12, 0.05, 's', 'One breath in and out (White Engine\'s is 2.6 s).'),
      n('sway', 'Sway', 0, 6, 0.05, '°', 'It leans a little from side to side, round its feet.'),
      { group: 'Glitch Artifact, under it (your White Engine numbers; distances follow the character, see Effect scale)' },
      tog('artOn', 'Glitch Artifact'),
      n('artGlitch', 'Glitch', 0, 1, 0.01),
      n('artAmount', 'Amount', 0, 1, 0.01, '', 'How many streaks.'),
      n('artBlock', 'Block Size (%)', 0.05, 5, 0.05),
      { ...n('artZoom', 'Zoom (%)', 0.1, 15, 0.05, '', 'The size of the whole pattern: blocks, streaks and grain.'), scale: 'log' },
      n('artGrain', 'Grain', 0, 2, 0.01),
      n('artReach', 'Reach (px)', 0, 2000, 10, '', 'How far out from the character a streak can carry colour.'),
      n('artEvaporate', 'Evaporate (px)', 0, 3000, 10, '', 'How far the mask (the silhouette) is blurred outward: bigger lets the streaks fade out further away.'),
      n('artStrength', 'Mask strength', 0.5, 15, 0.05, '', 'How solid the blurred mask is near the character. Higher keeps the streaks strong further out.'),
      n('artOpacity', 'Opacity', 0, 1, 0.01),
      n('artRate', 'Changes per second', 0, 60, 1, '', '0 = frozen.'),
      n('artSeed', 'Seed', 1, 999, 1),
      tog('charMask', 'Character mask', 'The silhouette as a mask, grown a little, with soft edges: right by the character the streaks are gone; only further out do they show.'),
      n('charExpand', 'Expand (px)', 0, 400, 1, '', 'How far past the edge the streaks are fully gone.'),
      n('charFade', 'Fade (px)', 1, 800, 1, '', 'How far, after that, they take to fade back in.'),
      n('charStrength', 'Strength', 0, 1, 0.01, '', '1 = clear near the character; lower leaves some of the streaks there.'),
      tog('tide', 'Tide (erase one side)'),
      n('tidePeriod', 'Tide period (s)', 1, 60, 0.5, '', 'About how long one breath takes: left side to right side and back.'),
      n('tideHold', 'Tide hold', 0, 0.95, 0.01, '', 'How long it stays on one side before it slides over.'),
      n('tideSoft', 'Tide softness', 0, 1, 0.01),
      n('tideLean', 'Tide lean', -1, 1, 0.01, '', '-1 = always erase the left side, +1 = always the right.'),
      { group: 'Glitch Diverge, over it (your White Engine numbers)' },
      tog('divOn', 'Glitch Diverge'),
      n('divGlitch', 'Glitch', 0, 1, 0.01),
      n('divZoom', 'Zoom (%)', 0, 3, 0.05, '', 'How tall the shifted rows are.'),
      n('divRed', 'Red Shift', -20, 20, 0.5),
      n('divGreen', 'Green Shift', -20, 20, 0.5),
      n('divBlue', 'Blue Shift', -20, 20, 0.5),
      tog('wander', 'Shifts wander', 'Each shift wanders between the two values below, in its own direction (the sign above).'),
      n('wanderMin', 'Wander from', 0, 20, 0.5),
      n('wanderMax', 'Wander to', 0, 20, 0.5),
      n('dust', 'Dust', 0, 2, 0.01, '', 'Fine specks that fly out from the edges. They only add light, so the character stays clean inside.'),
      n('dustReach', 'Dust reach (px)', 0, 400, 1),
      n('divOpacity', 'Opacity', 0, 1, 0.01),
      n('divRate', 'Changes per second', 0, 60, 1, '', '0 = frozen.'),
      n('divSeed', 'Seed', 1, 999, 1),
      n('eraseEyes', 'Erase the eyes', 0, 1, 0.01),
      n('eraseNeck', 'Erase the head-to-neck joint', 0, 1, 0.01),
      n('eraserSize', 'Eraser size', 0.3, 3, 0.01, '', 'Round each eye: times the eye. At the neck: times the neck.'),
      n('eraserSoft', 'Eraser softness', 0, 1, 0.01),
      { group: 'Glitch breathing: now and then, for an instant, it all glitches (your White Engine numbers)' },
      tog('brOn', 'Glitch breathing'),
      n('brSize', 'Size', 0, 2, 0.01, '', 'How big: how far the bands jump and the picture jolts, how much further the colours split, how far the head jerks.'),
      n('brViolence', 'Violence', 0, 1, 0.01, '', 'How violent: how fast everything moves and how often the pattern changes during it, how much of the picture breaks.'),
      n('brEvery', 'Usually every (s), from', 0.5, 20, 0.1),
      n('brEveryTo', 'Usually every (s), to', 0.5, 20, 0.1),
      n('brLongChance', 'Sometimes waits longer', 0, 1, 0.01, '', 'How often it waits longer (0.25: about one time in four).'),
      n('brLong', 'The longer wait (s)', 2, 30, 0.5),
      n('brLen', 'Lasts (s), from', 0.03, 1, 0.01),
      n('brLenTo', 'Lasts (s), to', 0.03, 1, 0.01),
      n('brJump', 'Bands jump (px)', 0, 600, 1, '', 'How far bands of the picture jump sideways.'),
      n('brPieces', 'Pieces from elsewhere', 0, 1, 0.01, '', 'Bands that show the picture from above or below.'),
      n('brJolt', 'Whole picture jolts (px)', 0, 200, 1),
      n('brSplit', 'Colour split', 0, 3, 0.01, '', 'How much further the colours split (its Chrome and Glitch Diverge).'),
      n('brSpeed', 'Speed-up', 0, 40, 0.5, '', 'The glitch effects and the Tide move this many times faster (plus 1) during it.'),
      n('brTwitch', 'Head jerks', 0, 1, 0.01, '', 'The head jumps to random places during it, and comes back after.'),
      { type: 'buttons', items: [['Glitch now', 'chGlitch']] },
      { group: 'Scale' },
      n('fx', 'Effect scale', 0.05, 3, 0.001, '', 'White Engine pixels to this picture\'s pixels: its head here against White Engine\'s head (radius 488 px). Every effect distance above is times this, and times Size.'),
    ];
  };

  // How far it has come in, tau seconds after it started to (0 = not there, 1 = in).
  WL.charIn = function (S, tau) {
    const T = Math.max(0.05, S.inTime);
    if (tau <= 0) return 0;
    if (tau >= T) return 1;
    return Math.pow(tau / T, 1 + 2 * c01(S.inSlow));
  };
  // The flash's envelope at tau seconds (0..1): a quick attack, then a fast and a slow cool-down.
  WL.charFlashEnv = function (S, tau) {
    if (tau < 0) return 0;
    const att = 0.035, tt = Math.max(0, tau - att), a = smooth(0, att, tau);
    const sh = c01(S.flashFastShare);
    return a * (sh * Math.exp(-tt / Math.max(0.01, S.flashFast)) + (1 - sh) * Math.exp(-tt / Math.max(0.01, S.flashSlow)));
  };

  // ---------------------------------------------------------------------------------------------
  // The bend: where a point of the picture goes (PSD px, y down). Mirrors the mesh's vertex shader.
  // pose: { yaw, pitch, roll (degrees), sy, sx (breathing), sq (jelly squash), sway (degrees) }
  WL.charGeom = function (rig) {
    const H = rig.head, N = rig.neck;
    return {
      head: [H.x, H.y, H.r, N.y],
      pivot: [N.x, N.y - 0.05 * H.r, 0.12 * H.r],
      feet: [rig.body, rig.bottom],
      bodyH: Math.max(1, rig.bottom - N.y),
    };
  };
  // (the face turns on a ball; near the edge the turn fades out smoothly, so the head's own outline
  // and its colour fringes stay where they are)
  WL.charDeform = function (g, pose, S, x, y) {
    const [hx, hy, r, ny] = g.head;
    const qx = (x - hx) / r, qy = (y - hy) / r, rr = qx * qx + qy * qy;
    const z = Math.sqrt(Math.max(0, 1 - rr)) * (1 - smooth(0.78, 0.95, Math.sqrt(rr)));
    const wx = x + r * z * Math.sin(pose.yaw * DEG), wy = y + r * z * Math.sin(pose.pitch * DEG);
    const w = (1 - smooth(ny - g.pivot[2], ny + g.pivot[2], y)) * (1 - smooth(1.2, 1.7, Math.sqrt(rr)));
    const c = Math.cos(pose.roll * DEG), s = Math.sin(pose.roll * DEG);
    const dx = wx - g.pivot[0], dy = wy - g.pivot[1];
    const h = [g.pivot[0] + c * dx - s * dy, g.pivot[1] + s * dx + c * dy];
    const p1 = [x + (h[0] - x) * w, y + (h[1] - y) * w];
    let rx = p1[0] - g.feet[0], ry = p1[1] - g.feet[1];
    const up = clamp(-ry / g.bodyH, 0, 1.5), chest = smooth(0.25, 0.95, up) * (1 - w);
    ry *= 1 + pose.sy + pose.sq;
    rx *= 1 + pose.sx * chest - 0.5 * pose.sq;
    const cs = Math.cos(pose.sway * DEG), sn = Math.sin(pose.sway * DEG);
    let ux = cs * rx - sn * ry, uy = sn * rx + cs * ry;
    const size = Math.max(0.05, S.size);
    ux *= size * (S.mirror ? -1 : 1); uy *= size;
    return [g.feet[0] + ux + S.x, g.feet[1] + uy + S.y];
  };

  // ---------------------------------------------------------------------------------------------
  // What moves it, frame by frame (no drawing here, so it runs in the tests too).
  WL.CharacterMotion = class {
    constructor(rnd) { this.rnd = rnd || Math.random; this.reset(); }
    reset() {
      this.t = 0;          // its own clock
      this.tw = 0;         // the effects' clock (runs faster during a glitch)
      this.mv = 0;         // the head and the sway
      this.tide = 0;       // the Tide's phase
      this.br = { next: null, start: -1, end: -1, forced: false, step: -1, cur: null, count: 0 };
      this.inStep = -1; this.inCur = null;
      this.jel = { sq: 0, vsq: 0, yaw: 0, vyaw: 0, roll: 0, vroll: 0 };
      this.burst = null;
      this.here = false;
    }
    // the flash: it wobbles as it arrives (it stretches up, the head turns and tilts, then it all
    // settles), and the Tide starts with the streaks behind it (the side it faces away from)
    pop(S) {
      const a = Math.max(0, S.pop), sg = this.rnd() < 0.5 ? -1 : 1;
      this.jel.sq += 0.05 * a; this.jel.yaw += 6 * a * sg; this.jel.roll -= 3.5 * a * sg;
      this.tide = S.mirror ? 0 : 0.5;
    }
    glitchNow() { this.br.forced = true; }
    _gap(S) {
      const lo = Math.max(0.2, S.brEvery), hi = Math.max(lo, S.brEveryTo);
      if (this.rnd() < c01(S.brLongChance)) { const L = Math.max(lo, S.brLong); return L * (0.85 + 0.3 * this.rnd()); }
      return lo + (hi - lo) * this.rnd();
    }
    // a glitch's pattern for now (it changes many times a second): bands that jump, pieces from
    // above or below, a jolt, the colours split, everything faster, the head jerks
    _pattern(size, vio, lvl, S) {
      const r = this.rnd, ang = r() * 2 * Math.PI, jump = Math.max(0, S.brJump), jolt = Math.max(0, S.brJolt);
      const tw = c01(S.brTwitch) * size;
      return {
        amount: lvl * (0.35 + 0.65 * vio), band: 6 + r() * (4 + 70 * size), seed: Math.floor(r() * 100000),
        shift: size * jump * lvl, pieces: c01(S.brPieces) * 0.25 * lvl * (0.3 + 0.7 * vio), piece: 1.5 * size * jump,
        jolt: [Math.cos(ang) * size * jolt * lvl, Math.sin(ang) * size * jolt * lvl],
        split: 1 + Math.max(0, S.brSplit) * 3 * size * lvl,
        speed: 1 + Math.max(0, S.brSpeed) * vio,
        twitch: tw > 0 ? [(r() * 2 - 1) * 20 * tw, (r() * 2 - 1) * 14 * tw, (r() * 2 - 1) * 12 * tw] : null,
      };
    }
    // the glitch breathing (White Engine's): now and then, for a moment
    _breath(S) {
      const B = this.br, t = this.t, off = !S.brOn;
      if (off && !B.forced && !(t < B.end)) { B.next = null; B.end = -1; B.cur = null; return null; }
      if (!off && B.next == null) B.next = t + this._gap(S);
      if (B.forced || (!off && t >= B.next && t >= B.end)) {
        const lo = Math.max(0.02, S.brLen), hi = Math.max(lo, S.brLenTo);
        B.start = t; B.end = t + lo + (hi - lo) * this.rnd();
        B.next = off ? null : B.end + this._gap(S);
        B.forced = false; B.step = -1; B.cur = null; B.count++;
      }
      if (t >= B.end) { B.cur = null; return null; }
      const size = Math.max(0, S.brSize), vio = c01(S.brViolence);
      const n = Math.floor((t - B.start) * (12 + 48 * vio));
      if (n !== B.step || !B.cur) { B.step = n; B.cur = this._pattern(size, vio, 0.6 + 0.4 * this.rnd(), S); }
      return B.cur;
    }
    // the glitches while it comes in (or goes away): c = how far it is in. They build up as it comes
    // in; only some bands of it show, more and more of them; now and then it all flickers off or on.
    _entrance(S, c) {
      const vio = c01(S.inViolence) * (0.4 + 0.6 * c), size = Math.max(0, S.inSize) * (0.45 + 0.55 * c);
      const n = Math.floor(this.t * (12 + 48 * vio));
      if (n !== this.inStep || !this.inCur) {
        this.inStep = n;
        const g = this._pattern(size, vio, 0.6 + 0.4 * this.rnd(), S), f = this.rnd();
        g.reveal = f < 0.16 * (1 - c) ? 0 : f > 0.9 ? 1 : 0.06 + 0.88 * c;
        g.revealBand = this.rnd() < 0.5 ? 4 + this.rnd() * 26 : 20 + this.rnd() * (60 + 140 * size);
        g.revealSeed = Math.floor(this.rnd() * 100000);
        this.inCur = g;
      }
      return this.inCur;
    }
    // every frame. c: how far it is in (0 = not there .. 1 = in)
    update(dt, S, c) {
      if (!(c > 0)) { if (this.here) this.reset(); return; }
      this.here = true;
      this.t += dt;
      let g = null;
      if (c < 1) { g = this._entrance(S, c); this.br.next = null; }
      else { this.inCur = null; this.inStep = -1; g = this._breath(S); }
      this.burst = g;
      const dw = dt * (g ? g.speed : 1);
      this.tw += dw;
      if (S.tide) this.tide += (dw / Math.max(0.5, S.tidePeriod)) * (1 + 0.35 * wave(0.37 * this.tw, 1.1, 2.3, 0.4));
      this.mv += dt * Math.max(0, S.moveSpeed);
      // the wobble's springs
      const w = 2 * Math.PI * Math.max(0.1, S.popSpeed), z = c01(S.popSettle) * 2, J = this.jel;
      const n = Math.max(1, Math.ceil(dt * 480)), h = dt / n;
      for (let i = 0; i < n; i++) {
        J.vsq += (-w * w * J.sq - z * w * J.vsq) * h; J.sq += J.vsq * h;
        J.vyaw += (-w * w * J.yaw - z * w * J.vyaw) * h; J.yaw += J.vyaw * h;
        J.vroll += (-w * w * J.roll - z * w * J.vroll) * h; J.roll += J.vroll * h;
      }
    }
    // the pose now (degrees and shares)
    pose(S) {
      const s = this.mv, J = this.jel;
      let yaw = S.turn * wave(0.5 * s, 0.3, 1.9, 4.1) + J.yaw;
      let pitch = S.nod * wave(0.41 * s, 2.2, 0.7, 5.3);
      let roll = S.tilt * wave(0.33 * s, 4.4, 2.8, 1.2) + J.roll;
      const tw = this.burst && this.burst.twitch;
      if (tw) { yaw += tw[0]; pitch += tw[1]; roll += tw[2]; }
      const b = Math.sin(2 * Math.PI * this.t / Math.max(0.3, S.breathLen));
      return {
        yaw: clamp(yaw, -60, 60), pitch: clamp(pitch, -60, 60), roll,
        sy: Math.max(0, S.breathe) * 0.008 * b, sx: Math.max(0, S.breathe) * 0.006 * b, sq: clamp(J.sq, -0.5, 0.5),
        sway: S.sway * wave(0.27 * s, 1.4, 3.3, 0.2),
      };
    }
    // the Tide now: 0 = erase the left side .. 1 = the right (as in White Engine)
    tideW(S) {
      const base = 0.5 - 0.5 * Math.cos(2 * Math.PI * this.tide);
      const hold = clamp(S.tideHold, 0, 0.96);
      const w = smooth(hold / 2, 1 - hold / 2, base);
      const lean = clamp(S.tideLean, -1, 1);
      return lean >= 0 ? w + (1 - w) * lean : w * (1 + lean);
    }
  };

  // ---------------------------------------------------------------------------------------------
  // The shaders. Images are premultiplied RGBA on a transparent background; "px" are the screen's
  // device pixels, y up (as gl_FragCoord), unless it says PSD px.
  const VS = `#version 300 es
in vec2 aPos;
out vec2 vUV;
void main() { vUV = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const HEAD = `#version 300 es
precision highp float;
precision highp int;
in vec2 vUV;
out vec4 o;
uint pcg(uint v) { uint s = v * 747796405u + 2891336453u; uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u; return (w >> 22u) ^ w; }
float h3(vec3 p) { uvec3 q = uvec3(ivec3(floor(p))); return float(pcg(q.x + pcg(q.y + pcg(q.z)))) * (1.0 / 4294967295.0); }
`;

  // the picture on its mesh, bent (see WL.charDeform, which does the same in JavaScript)
  const VS_MESH = `#version 300 es
precision highp float;
in vec2 aPos;               // a point of the picture, PSD px
out vec2 vUV;
uniform vec4 uCrop;         // the picture's place on its canvas: x, y, w, h (PSD px)
uniform vec4 uHead;         // head centre x, y, radius; neck y (PSD px)
uniform vec3 uPivot;        // where the head tilts x, y; the neck's bend (px either side)
uniform vec3 uTurn;         // turn, nod (sines), tilt (radians)
uniform vec3 uFeet;         // feet x, y; body height (feet to neck)
uniform vec4 uBody;         // breathing taller, breathing wider, sway (radians), jelly squash
uniform vec4 uPlace;        // shift x, y (PSD px), size, mirror (1 or -1)
uniform vec3 uMap;          // screen px per PSD px, screen offset x, y
uniform vec2 uView;         // the screen, px
vec2 deform(vec2 p) {
  vec2 q = (p - uHead.xy) / uHead.z;
  float rr = dot(q, q);
  float z = sqrt(max(0.0, 1.0 - rr)) * (1.0 - smoothstep(0.78, 0.95, sqrt(rr)));
  vec2 pw = p + uHead.z * z * uTurn.xy;
  float w = (1.0 - smoothstep(uHead.w - uPivot.z, uHead.w + uPivot.z, p.y)) * (1.0 - smoothstep(1.2, 1.7, sqrt(rr)));
  float c = cos(uTurn.z), s = sin(uTurn.z);
  vec2 d = pw - uPivot.xy;
  vec2 h = uPivot.xy + vec2(c * d.x - s * d.y, s * d.x + c * d.y);
  vec2 p1 = mix(p, h, w);
  vec2 r = p1 - uFeet.xy;
  float up = clamp(-r.y / uFeet.z, 0.0, 1.5);
  float chest = smoothstep(0.25, 0.95, up) * (1.0 - w);
  r.y *= 1.0 + uBody.x + uBody.w;
  r.x *= 1.0 + uBody.y * chest - 0.5 * uBody.w;
  float cs = cos(uBody.z), sn = sin(uBody.z);
  r = vec2(cs * r.x - sn * r.y, sn * r.x + cs * r.y);
  r *= uPlace.z;
  r.x *= uPlace.w;
  return uFeet.xy + r + uPlace.xy;
}
void main() {
  vUV = (aPos - uCrop.xy) / uCrop.zw;
  vec2 s = uMap.yz + deform(aPos) * uMap.x;
  gl_Position = vec4(s.x / uView.x * 2.0 - 1.0, 1.0 - s.y / uView.y * 2.0, 0.0, 1.0);
}`;
  const FS_MESH = `#version 300 es
precision highp float;
in vec2 vUV;
out vec4 o;
uniform sampler2D uTex;
void main() { o = texture(uTex, vUV); }`;

  // half size (a 2 x 2 average); and the first step for the character mask: the solid silhouette
  // (the picture's own glow left out), in every channel
  const FS_DOWN = HEAD + `
uniform sampler2D uSrc;
uniform vec2 uTexel;
void main() {
  vec2 d = 0.5 * uTexel;
  o = 0.25 * (texture(uSrc, vUV + vec2(-d.x, -d.y)) + texture(uSrc, vUV + vec2(d.x, -d.y)) + texture(uSrc, vUV + vec2(-d.x, d.y)) + texture(uSrc, vUV + vec2(d.x, d.y)));
}`;
  const FS_DOWN_SIL = HEAD + `
uniform sampler2D uSrc;
uniform vec2 uTexel;
float sil(vec2 uv) { return smoothstep(0.4, 0.6, texture(uSrc, uv).a); }
void main() {
  vec2 d = 0.5 * uTexel;
  o = vec4(0.25 * (sil(vUV + vec2(-d.x, -d.y)) + sil(vUV + vec2(d.x, -d.y)) + sil(vUV + vec2(-d.x, d.y)) + sil(vUV + vec2(d.x, d.y))));
}`;
  const FS_BLUR = HEAD + `
uniform sampler2D uSrc;
uniform vec2 uDir;
uniform float uSigma;
uniform int uR;
void main() {
  vec4 acc = texture(uSrc, vUV);
  float ws = 1.0, k = -0.5 / (uSigma * uSigma);
  for (int i = 1; i <= 40; i++) {
    if (i > uR) break;
    float f = float(i), w = exp(k * f * f);
    acc += w * (texture(uSrc, vUV + uDir * f) + texture(uSrc, vUV - uDir * f));
    ws += 2.0 * w;
  }
  o = acc / ws;
}`;

  // White Engine's batch: a Glitch Artifact copy of the picture under it, the picture, a Glitch
  // Diverge copy over it (the eyes and the head-to-neck joint softly erased).
  const FS_BATCH = HEAD + `
uniform sampler2D uC, uM, uCM;
uniform vec2 uRes;
uniform float uArtOn, uArtGlitch, uArtAmount, uArtSeed, uArtOpacity, uArtGrain, uArtGrainPx;
uniform vec2 uArtBlock;
uniform float uArtRow, uArtReach, uMaskGain, uCx;
uniform vec3 uTide;
uniform float uDivOn, uDivGlitch, uDivSeed, uDivRow, uDivOpacity, uDivDust, uDivDustPx;
uniform vec3 uDivShift;
uniform vec4 uEyeL, uEyeR, uNeck;
uniform vec3 uErase;
uniform vec4 uCMask;
uniform vec2 uCMask2;
vec4 C(vec2 px) { return texture(uC, px / uRes); }
vec4 artifact(vec2 px) {
  vec2 cell = floor(px / uArtBlock);
  float row = floor(px.y / uArtRow);
  float side = px.x < uCx ? -1.0 : 1.0;
  vec3 k = vec3(cell.x * 7.0 + cell.y * 131.0 + side, row, uArtSeed);
  float lit = step(h3(k), 0.55 * uArtAmount);
  float pull = uArtReach * pow(h3(k + vec3(0.0, 0.0, 11.0)), 0.75);
  float seg = mix(0.12, 1.0, h3(k + vec3(0.0, 0.0, 23.0))) * uArtBlock.x;
  float dash = floor((px.x - cell.x * uArtBlock.x + h3(k + vec3(0.0, 0.0, 31.0)) * seg) / seg);
  lit *= step(h3(vec3(dash, row, uArtSeed + 41.0 + cell.x)), 0.72);
  vec4 s = C(px - vec2(side * pull, 0.0));
  float tp = h3(k + vec3(0.0, 0.0, 53.0));
  vec3 tint = tp < 0.45 ? vec3(1.0) : tp < 0.65 ? vec3(0.55, 1.0, 1.0) : tp < 0.8 ? vec3(1.0, 1.0, 0.45) : tp < 0.9 ? vec3(1.0, 0.45, 1.0) : vec3(0.7);
  float bright = mix(0.35, 1.0, h3(k + vec3(0.0, 0.0, 67.0)));
  vec4 streak = vec4(s.rgb * tint, s.a) * (lit * bright * uArtGlitch);
  vec4 c = C(px);
  vec2 g = floor(px / uArtGrainPx);
  vec3 n = vec3(h3(vec3(g, uArtSeed + 101.0)), h3(vec3(g, uArtSeed + 131.0)), h3(vec3(g, uArtSeed + 151.0))) - 0.5;
  vec4 grain = vec4(clamp(c.rgb * (1.0 + 2.0 * uArtGrain * uArtGlitch * n), 0.0, c.a), c.a);
  return streak + grain * (1.0 - streak.a);
}
vec4 diverge(vec2 px) {
  float row = floor(px.y / uDivRow);
  float gate = step(h3(vec3(row, 4.0, uDivSeed)), uDivGlitch);
  vec3 r = vec3(h3(vec3(row, 1.0, uDivSeed)), h3(vec3(row, 2.0, uDivSeed)), h3(vec3(row, 3.0, uDivSeed)));
  vec3 off = uDivShift * (0.25 + 1.25 * r * r) * gate;
  vec4 cr = C(px - vec2(off.r, 0.0)), cg = C(px - vec2(off.g, 0.0)), cb = C(px - vec2(off.b, 0.0));
  vec4 d = vec4(cr.r, cg.g, cb.b, max(cr.a, max(cg.a, cb.a)));
  if (uDivDust > 0.0) {
    vec2 q = floor(px);
    if (h3(vec3(q, uDivSeed + 7.0)) < 0.5 * uDivDust) {
      float ang = (h3(vec3(q, uDivSeed + 13.0)) - 0.5) * 1.6 + (h3(vec3(q, uDivSeed + 17.0)) < 0.5 ? 0.0 : 3.14159);
      float dist = uDivDustPx * pow(h3(vec3(q, uDivSeed + 19.0)), 1.5);
      vec4 sp = C(px - dist * vec2(cos(ang), 0.5 * sin(ang)));
      float pick = h3(vec3(q, uDivSeed + 23.0));
      vec3 ch = pick < 0.25 ? vec3(0.0, 1.0, 1.0) : pick < 0.4 ? vec3(0.0, 0.0, 1.0) : pick < 0.5 ? vec3(1.0, 0.0, 1.0) : pick < 0.6 ? vec3(1.0, 1.0, 0.0) : vec3(1.0);
      d = vec4(max(d.rgb, sp.rgb * ch), max(d.a, sp.a * max(ch.r, max(ch.g, ch.b))));
    }
  }
  return d;
}
float erfinv(float x) {
  float w = -log(max(1e-12, (1.0 - x) * (1.0 + x))), p;
  if (w < 5.0) {
    w -= 2.5;
    p = 2.81022636e-08; p = 3.43273939e-07 + p * w; p = -3.5233877e-06 + p * w; p = -4.39150654e-06 + p * w;
    p = 0.00021858087 + p * w; p = -0.00125372503 + p * w; p = -0.00417768164 + p * w; p = 0.246640727 + p * w; p = 1.50140941 + p * w;
  } else {
    w = sqrt(w) - 3.0;
    p = -0.000200214257; p = 0.000100950558 + p * w; p = 0.00134934322 + p * w; p = -0.00367342844 + p * w;
    p = 0.00573950773 + p * w; p = -0.0076224613 + p * w; p = 0.00943887047 + p * w; p = 1.00167406 + p * w; p = 2.83297682 + p * w;
  }
  return p * x;
}
float charMask() {
  float b = texture(uCM, vUV).a;
  if (b <= uCMask2.y) return 0.0;
  float x = uCMask2.x * 1.41421356 * erfinv(clamp(1.0 - 2.0 * b, -0.9999, 0.9999));
  return 1.0 - smoothstep(uCMask.x, uCMask.y, x);
}
float eyeErase(vec2 px, vec4 e) {
  if (e.z <= 0.0) return 0.0;
  return 1.0 - smoothstep(e.z, e.z * (1.0 + e.w) + 0.5, length(px - e.xy));
}
void main() {
  vec2 px = gl_FragCoord.xy;
  vec4 c = C(px);
  vec4 a = vec4(0.0), d = vec4(0.0);
  if (uArtOn > 0.5) {
    float m = clamp(texture(uM, vUV).a * uMaskGain, 0.0, 1.0);
    float keep = 1.0;
    if (uTide.z > 0.5) {
      float x = px.x - uCx;
      float eraseL = 1.0 - smoothstep(-uTide.y, uTide.y, x), eraseR = smoothstep(-uTide.y, uTide.y, x);
      keep = 1.0 - mix(eraseL, eraseR, uTide.x);
    }
    if (uCMask.w > 0.5 && keep * m > 0.002) keep *= 1.0 - uCMask.z * charMask();
    float v = m * keep * uArtOpacity;
    if (v > 0.002) a = artifact(px) * v;
  }
  if (uDivOn > 0.5 && uDivOpacity > 0.0) {
    float er = max(eyeErase(px, uEyeL), eyeErase(px, uEyeR)) * uErase.x;
    if (uNeck.z > 0.0) {
      float dn = length((px - uNeck.xy) / uNeck.zw);
      er = max(er, (1.0 - smoothstep(1.0, 1.0 + uErase.z + 0.01, dn)) * uErase.y);
    }
    if (er < 0.999) d = diverge(px) * ((1.0 - er) * uDivOpacity);
  }
  vec4 ca = c + a * (1.0 - c.a);
  o = d + ca * (1.0 - d.a);
}`;

  // onto the screen: the glitch (bands jump, pieces from above or below, a jolt; White Engine's),
  // the colours split further, the flash's glow screened over, and while it comes in only some
  // bands of it show
  const FS_SHOW = HEAD + `
uniform sampler2D uB, uG1, uG2;
uniform vec2 uRes;
uniform vec4 uBurst;        // x: share of bands that jump, y: band height px, z: seed, w: jump px
uniform vec4 uBurst2;       // x: share of bands from elsewhere, y: how far px, zw: the jolt px
uniform vec2 uSplit;        // the red copy's shift px (the blue goes the other way)
uniform vec4 uReveal;       // share of bands shown, band height px, pattern, on
uniform vec2 uFlash;        // the flash's glow, its wide halo
vec2 burstAt(vec2 px) {
  if (uBurst.x <= 0.0) return px;
  float band = floor(px.y / uBurst.y);
  if (h3(vec3(band, uBurst.z, 3.0)) < 0.45 * uBurst.x) px.x += (h3(vec3(band, uBurst.z, 5.0)) - 0.5) * 2.0 * uBurst.w;
  if (h3(vec3(band, uBurst.z, 7.0)) < uBurst2.x) px.y += (h3(vec3(band, uBurst.z, 9.0)) - 0.5) * 2.0 * uBurst2.y;
  return px + uBurst2.zw;
}
vec4 B(vec2 px) { return texture(uB, px / uRes); }
void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 q = burstAt(px);
  vec4 b = B(q);
  if (uSplit.x != 0.0 || uSplit.y != 0.0) {
    vec4 r = B(q - uSplit), bl = B(q + uSplit);
    b = vec4(r.r, b.g, bl.b, max(b.a, max(r.a, bl.a)));
  }
  if (uFlash.x > 0.0 || uFlash.y > 0.0) {
    vec2 uv = q / uRes;
    vec4 g = min(texture(uG1, uv) * uFlash.x + texture(uG2, uv) * uFlash.y, vec4(1.0));
    g.rgb = min(g.rgb, vec3(g.a));
    b = b + g - b * g;
  }
  if (uReveal.w > 0.5) b *= step(h3(vec3(floor(px.y / uReveal.y), uReveal.z, 13.0)), uReveal.x);
  o = b;
}`;

  // ---------------------------------------------------------------------------------------------
  // The drawing. entry: the character's file (WL_CHARACTERS[key]); image: its picture.
  WL.CharacterRenderer = class {
    constructor(G, entry, image) {
      this.G = G; this.E = entry; this.rig = entry.rig;
      this.geom = WL.charGeom(entry.rig);
      const gl = G.gl;
      this.tex = G.imageTexture(image, true);
      this.pMesh = G.program(VS_MESH, FS_MESH);
      this.pDown = G.program(VS, FS_DOWN);
      this.pSil = G.program(VS, FS_DOWN_SIL);
      this.pBlur = G.program(VS, FS_BLUR);
      this.pBatch = G.program(VS, FS_BATCH);
      this.pShow = G.program(VS, FS_SHOW);
      // the mesh: a grid over the picture, about 7 PSD px a cell (fine, so the bends stay smooth)
      const nx = Math.max(2, Math.round(entry.w / 7)), ny = Math.max(2, Math.round(entry.h / 7));
      const v = new Float32Array((nx + 1) * (ny + 1) * 2);
      let i = 0;
      for (let y = 0; y <= ny; y++) for (let x = 0; x <= nx; x++) { v[i++] = entry.x + entry.w * x / nx; v[i++] = entry.y + entry.h * y / ny; }
      const idx = new Uint16Array(nx * ny * 6);
      i = 0;
      for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
        const a = y * (nx + 1) + x, b = a + 1, c = a + nx + 1, d = c + 1;
        idx[i++] = a; idx[i++] = b; idx[i++] = c; idx[i++] = b; idx[i++] = d; idx[i++] = c;
      }
      this.nIdx = idx.length;
      this.vao = gl.createVertexArray();
      gl.bindVertexArray(this.vao);
      const vb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vb);
      gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      const ib = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
      gl.bindVertexArray(null);
      this.W = 0; this.H = 0;
      this.glows = {};
      this.stats = { ms: 0, rect: null };
    }

    resize(W, H) {
      if (W === this.W && H === this.H) return;
      const G = this.G;
      for (const k of ['CH', 'BT']) G.free(this[k]);
      for (const ch of [this.chC, this.chS]) if (ch) ch.forEach((t) => G.free(t));
      for (const k in this.glows) { G.free(this.glows[k].t); G.free(this.glows[k].tmp); }
      this.W = W; this.H = H;
      this.CH = G.target(W, H);     // the picture, bent
      this.BT = G.target(W, H);     // the batch: Artifact, the picture, Diverge
      const chain = () => { const a = []; let w = W, h = H; for (let i = 1; i <= 6; i++) { w = Math.max(1, Math.ceil(w / 2)); h = Math.max(1, Math.ceil(h / 2)); a.push(G.target(w, h)); } return a; };
      this.chC = chain();           // the picture made smaller, level by level
      this.chS = chain();           // its solid silhouette made smaller
      this.glows = {};
      this.made = { C: 0, S: 0 };
    }

    // a rectangle on the screen (device px, y down) that surely holds the bent picture: the picture's
    // rectangle grown by the most the head's turn and tilt can move a point of it, then stretched by
    // the breathing and the wobble and turned by the sway round the feet, as WL.charDeform does
    _bounds(pose, S, map) {
      const E = this.E, g = this.geom, [hx, hy, r] = g.head, [fx, fy] = g.feet;
      const A = r * (Math.abs(Math.sin(pose.yaw * DEG)) + Math.abs(Math.sin(pose.pitch * DEG)));
      const D = A + Math.abs(pose.roll * DEG) * (A + 1.7 * r + Math.hypot(hx - g.pivot[0], hy - g.pivot[1])) + 1;
      const sx1 = 1 - 0.5 * pose.sq + Math.min(0, pose.sx), sx2 = 1 - 0.5 * pose.sq + Math.max(0, pose.sx), sy = 1 + pose.sy + pose.sq;
      const ax = E.x - D - fx, bx = E.x + E.w + D - fx, ay = (E.y - D - fy) * sy, by = (E.y + E.h + D - fy) * sy;
      const x0 = Math.min(ax * sx1, ax * sx2), x1 = Math.max(bx * sx1, bx * sx2);
      const c = Math.cos(pose.sway * DEG), sn = Math.sin(pose.sway * DEG), size = Math.max(0.05, S.size), m = S.mirror ? -1 : 1;
      let X0 = 1e9, Y0 = 1e9, X1 = -1e9, Y1 = -1e9;
      for (const [x, y] of [[x0, ay], [x1, ay], [x0, by], [x1, by]]) {
        const X = map.ox + (fx + (c * x - sn * y) * size * m + S.x) * map.k, Y = map.oy + (fy + (sn * x + c * y) * size + S.y) * map.k;
        X0 = Math.min(X0, X); X1 = Math.max(X1, X); Y0 = Math.min(Y0, Y); Y1 = Math.max(Y1, Y);
      }
      return [X0 - 2, Y0 - 2, X1 + 2, Y1 + 2];
    }

    // the levels of a chain down to L (1 = half size); only what this frame needs, and only round
    // the character (this.area: where it can be at each level; the rest of a level is empty)
    _chain(which, L) {
      const G = this.G, ch = which === 'S' ? this.chS : this.chC;
      let from = this.made[which];
      if (from >= L) return;
      for (let i = from + 1; i <= L; i++) {
        const src = i === 1 ? this.CH : ch[i - 2];
        const p = (i === 1 && which === 'S' ? this.pSil : this.pDown).use();
        p.tex('uSrc', src).f('uTexel', 1 / src.w, 1 / src.h); G.pass(ch[i - 1], this.area[i]);
      }
      this.made[which] = L;
    }
    // a Gaussian blur of a chain, sigma in screen px, into a target of its own
    _glow(name, which, sigma) {
      const G = this.G, { L, sigma: s } = pickLevel(Math.max(0.6, sigma));
      this._chain(which, L);
      const src = (which === 'S' ? this.chS : this.chC)[L - 1];
      if (s <= 0.35) return src;
      let g = this.glows[name];
      if (!g || g.L !== L) {
        if (g) { G.free(g.t); G.free(g.tmp); }
        g = this.glows[name] = { L, t: G.target(src.w, src.h), tmp: G.target(src.w, src.h) };
      }
      // (round the character only: where it can be at this level, as far as the blur's taps reach)
      const R = Math.min(40, Math.ceil(3 * s)), p = this.pBlur.use(), a = this.area[L], e = R + 2;
      const r = [Math.max(0, a[0] - e), Math.max(0, a[1] - e), Math.min(src.w, a[2] + e), Math.min(src.h, a[3] + e)];
      p.tex('uSrc', src).f('uDir', 1 / src.w, 0).f('uSigma', s).i('uR', R); G.pass(g.tmp, r);
      p.tex('uSrc', g.tmp).f('uDir', 0, 1 / src.h); G.pass(g.t, r);
      return g.t;
    }

    // st: this frame's state (from the animation); S: its settings; map: { k, ox, oy } PSD px to
    // screen px; the screen is W x H device px
    draw(st, S, map) {
      const G = this.G, gl = G.gl, W = this.W, H = this.H, E = this.E, g = this.geom;
      const t0 = performance.now();
      const k = map.k, size = Math.max(0.05, S.size);
      const kd = Math.max(1e-4, S.fx) * size * k;            // screen px per White Engine px
      const pose = st.pose, still = { ...pose, yaw: 0, pitch: 0 };   // (the head's outline does not move when it turns)
      const toScreen = (x, y, q) => { const p = WL.charDeform(g, q || pose, S, x, y); return [map.ox + p[0] * k, map.oy + p[1] * k]; };
      const gly = (y) => H - y;                                // screen y down -> GL y up

      // where it can be on the screen (the picture's corners, bent, plus a little)
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const [x, y] of [[E.x, E.y], [E.x + E.w, E.y], [E.x, E.y + E.h], [E.x + E.w, E.y + E.h], [E.x + E.w / 2, E.y]]) {
        const p = toScreen(x, y); x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
      }
      const pad = 0.06 * Math.max(x1 - x0, y1 - y0) + 4;
      x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
      if (x1 < -2000 || y1 < -2000 || x0 > W + 2000 || y0 > H + 2000) return;

      // the glitch now (the entrance's, or a glitch breath)
      const b = st.burst;
      const split = b ? b.split : 1;
      const post = c01(st.post);

      // 1. the picture, bent
      gl.disable(gl.SCISSOR_TEST);
      gl.disable(gl.BLEND);
      G.clear(this.CH);
      this.made = { C: 0, S: 0 };
      let p = this.pMesh.use();
      p.tex('uTex', this.tex).f('uCrop', E.x, E.y, E.w, E.h)
        .f('uHead', g.head).f('uPivot', g.pivot).f('uTurn', Math.sin(pose.yaw * DEG), Math.sin(pose.pitch * DEG), pose.roll * DEG)
        .f('uFeet', g.feet[0], g.feet[1], g.bodyH).f('uBody', pose.sy, pose.sx, pose.sway * DEG, pose.sq)
        .f('uPlace', S.x, S.y, size, S.mirror ? -1 : 1).f('uMap', k, map.ox, map.oy).f('uView', W, H);
      gl.bindVertexArray(this.vao);
      gl.drawElements(gl.TRIANGLES, this.nIdx, gl.UNSIGNED_SHORT, 0);
      gl.bindVertexArray(null);
      // where it can be, level by level (GL px, y up: x0, y0, x1, y1), for the chains
      const bd = this._bounds(pose, S, map);
      let a = [Math.floor(bd[0]), Math.floor(H - bd[3]), Math.ceil(bd[2]), Math.ceil(H - bd[1])];
      this.area = [null];
      for (let i = 1, w = W, h = H; i <= 6; i++) {
        w = Math.max(1, Math.ceil(w / 2)); h = Math.max(1, Math.ceil(h / 2));
        a = [Math.floor(a[0] / 2) - 2, Math.floor(a[1] / 2) - 2, Math.ceil(a[2] / 2) + 2, Math.ceil(a[3] / 2) + 2];
        this.area.push([clamp(a[0], 0, w), clamp(a[1], 0, h), clamp(a[2], 0, w), clamp(a[3], 0, h)]);
      }

      // 2. the batch: Glitch Artifact under it, the picture, Glitch Diverge over it
      const artOn = S.artOn && S.artOpacity > 0 && post > 0.001;
      const divOn = S.divOn && S.divOpacity > 0 && post > 0.001;
      const head = toScreen(g.head[0], g.head[1], still);
      const U = {};
      let reach = 0, dShift = 0, dust = 0;
      if (artOn) {
        reach = Math.max(0, S.artReach) * kd;
        // the mask: the picture (with its glow) blurred outward (Evaporate)
        U.uM = this._glow('mask', 'C', Math.max(2, Math.max(0, S.artEvaporate) * kd));
        U.uCMask = [0, 1, 0, 0]; U.uCMask2 = [1, 0]; U.uCM = U.uM;
        if (S.charMask && S.charStrength > 0) {
          const Ex = Math.max(0, S.charExpand) * kd, F = Math.max(1, S.charFade) * kd;
          const sg = Math.max(1.5, (Ex + F) / 2.2);
          U.uCM = this._glow('cmask', 'S', sg);
          U.uCMask = [Ex, Ex + F, c01(S.charStrength), 1];
          U.uCMask2 = [sg, 0.8 * tail((Ex + F) / sg)];
        }
        const Z = Math.max(0.05, S.artZoom / 1.3);
        const bw = Math.max(8, 220 * Math.sqrt(Math.max(0.02, S.artBlock)) * Z * kd);
        const rate = Math.max(0, S.artRate);
        const amount = b ? Math.max(c01(S.artAmount), 0.5 + 0.5 * b.amount) : c01(S.artAmount);
        Object.assign(U, {
          uArtGlitch: b ? 1 : c01(S.artGlitch), uArtAmount: amount, uArtOpacity: c01(S.artOpacity) * post,
          uArtSeed: Math.round(S.artSeed) * 1013 + (rate > 0 ? Math.floor(st.tw * rate) : 0),
          uArtBlock: [bw, 2.5 * bw], uArtRow: Math.max(1, 3 * Math.sqrt(Z) * kd), uArtReach: reach,
          uArtGrain: Math.max(0, S.artGrain), uArtGrainPx: Math.max(1, 1.2 * Z * kd), uMaskGain: Math.max(0, S.artStrength),
          uTide: S.tide ? [st.tide, Math.max(1, c01(S.tideSoft) * 600 * kd), 1] : [0, 1, 0],
        });
      }
      if (divOn) {
        const base = [S.divRed, S.divGreen, S.divBlue];
        const lo = Math.max(0, S.wanderMin), hi = Math.max(lo, S.wanderMax);
        const sh = base.map((v, i) => {
          if (!S.wander) return v * split;
          const m = lo + (hi - lo) * (0.5 + 0.5 * wave(0.45 * st.tw + 7.1 * i, 0.3 + i, 1.7 * i, 2.2 + i));
          return (v < 0 ? -1 : 1) * m * split;
        });
        dShift = Math.max(...sh.map(Math.abs)) * 1.5 * kd;
        dust = Math.max(1, Math.max(0, S.dustReach) * kd);
        const rate = Math.max(0, S.divRate), es = Math.max(0, S.eraserSize), soft = c01(S.eraserSoft);
        const eye = (i) => {
          const e = this.rig.eyes[i];
          if (!e) return [0, 0, 0, 0];
          const q = toScreen(e.x, e.y);
          return [q[0], gly(q[1]), e.r * size * k * es, soft];
        };
        const nk = toScreen(this.rig.neck.x, this.rig.neck.y), half = this.rig.neck.w / 2;
        Object.assign(U, {
          uDivGlitch: c01(S.divGlitch), uDivOpacity: c01(S.divOpacity) * post,
          uDivSeed: Math.round(S.divSeed) * 2027 + (rate > 0 ? Math.floor(st.tw * rate) : 0),
          uDivRow: Math.max(1, (1 + 4 * Math.max(0, S.divZoom)) * kd),
          uDivShift: sh.map((v) => v * kd), uDivDust: Math.max(0, S.dust), uDivDustPx: dust,
          uEyeL: eye(0), uEyeR: eye(1),
          uNeck: [nk[0], gly(nk[1]), half * 1.15 * size * k * es, half * 0.6 * size * k * es],
          uErase: [c01(S.eraseEyes), c01(S.eraseNeck), soft],
        });
      }
      // the rectangle the batch can reach (GL px), and the glitch's on top of that
      const bx = reach + dShift + dust + 3, by = 0.5 * dust + 3;
      const r1 = [Math.floor(x0 - bx), Math.floor(gly(y1) - by), Math.ceil(x1 + bx), Math.ceil(gly(y0) + by)];
      const sp = b ? (split - 1) * 7.9 * kd : 0;                    // (White Engine's Chrome distance)
      const gx = b ? b.shift * kd + Math.abs(b.jolt[0]) * kd + sp + 2 : 0, gy = b ? b.piece * kd + Math.abs(b.jolt[1]) * kd + sp + 2 : 0;
      const r2 = [r1[0] - gx, r1[1] - gy, r1[2] + gx, r1[3] + gy];
      const scissor = (r) => {
        const a = Math.max(0, Math.floor(r[0])), c = Math.max(0, Math.floor(r[1]));
        const w = Math.min(W, Math.ceil(r[2])) - a, h = Math.min(H, Math.ceil(r[3])) - c;
        if (w <= 0 || h <= 0) return false;
        gl.enable(gl.SCISSOR_TEST); gl.scissor(a, c, w, h); return true;
      };
      p = this.pBatch.use();
      p.tex('uC', this.CH).tex('uM', U.uM || this.CH).tex('uCM', U.uCM || this.CH)
        .f('uRes', W, H).f('uCx', head[0]).f('uArtOn', artOn ? 1 : 0).f('uDivOn', divOn ? 1 : 0);
      for (const key in U) if (key !== 'uM' && key !== 'uCM') p.f(key, U[key]);
      G.pass(this.BT, [Math.max(0, Math.floor(r1[0])), Math.max(0, Math.floor(r1[1])), Math.min(W, Math.ceil(r1[2])), Math.min(H, Math.ceil(r1[3]))]);

      // 3. the flash's glows
      let g1 = this.CH, g2 = this.CH;
      const fl = Math.max(0, st.flash || 0), ha = Math.max(0, st.halo || 0);
      if (fl > 0.001) g1 = this._glow('flash', 'C', Math.max(1, S.flashSize) * size * k);
      if (ha > 0.001) g2 = this._glow('halo', 'C', Math.max(1, S.flashSize) * 4 * size * k);
      const fx2 = ha > 0.001 ? 4 * 2.5 * Math.max(1, S.flashSize) * size * k : fl > 0.001 ? 2.5 * Math.max(1, S.flashSize) * size * k : 0;

      // 4. onto the screen
      G.bind(null);
      const r3 = [r2[0] - fx2, r2[1] - fx2, r2[2] + fx2, r2[3] + fx2];
      if (scissor(r3)) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        p = this.pShow.use();
        const ang = 25 * DEG;
        p.tex('uB', this.BT).tex('uG1', g1).tex('uG2', g2).f('uRes', W, H)
          .f('uBurst', b ? b.amount : 0, Math.max(1, (b ? b.band : 10) * kd), b ? b.seed % 1000 : 0, b ? b.shift * kd : 0)
          .f('uBurst2', b ? b.pieces : 0, b ? b.piece * kd : 0, b ? b.jolt[0] * kd : 0, b ? -b.jolt[1] * kd : 0)
          .f('uSplit', Math.cos(ang) * sp, -Math.sin(ang) * sp)
          .f('uReveal', b && b.reveal != null ? b.reveal : 1, Math.max(1, (b && b.revealBand ? b.revealBand : 10) * kd), b && b.revealSeed ? b.revealSeed % 1000 : 0, b && b.reveal != null ? 1 : 0)
          .f('uFlash', fl, ha);
        G.quad();
        gl.disable(gl.BLEND);
        gl.disable(gl.SCISSOR_TEST);
      }
      this.stats.ms = performance.now() - t0;
      this.stats.rect = r3;
    }

    // the rig over the picture (on the overlay, CSS px): the head circle, the neck line, where the
    // head tilts, the eyes, the feet
    overlay(c, st, S, map) {
      if (!st) return;
      const g = this.geom, R = this.rig, k = map.k, size = Math.max(0.05, S.size);
      const still = { ...st.pose, yaw: 0, pitch: 0 };
      const P = (x, y, q) => { const p = WL.charDeform(g, q || st.pose, S, x, y); return [map.ox + p[0] * k, map.oy + p[1] * k]; };
      c.save();
      c.lineWidth = 1.5;
      c.strokeStyle = 'rgba(255,90,90,0.9)';
      const hc = P(R.head.x, R.head.y, still);
      c.beginPath(); c.arc(hc[0], hc[1], R.head.r * size * k, 0, Math.PI * 2); c.stroke();
      c.strokeStyle = 'rgba(90,200,255,0.95)';
      const a = P(R.neck.x - R.neck.w, R.neck.y), b = P(R.neck.x + R.neck.w, R.neck.y);
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
      c.fillStyle = 'rgba(255,210,60,0.95)';
      const pv = P(g.pivot[0], g.pivot[1]);
      c.beginPath(); c.arc(pv[0], pv[1], 4, 0, Math.PI * 2); c.fill();
      c.strokeStyle = 'rgba(90,255,140,0.95)';
      for (const e of R.eyes) { const q = P(e.x, e.y); c.beginPath(); c.arc(q[0], q[1], e.r * size * k, 0, Math.PI * 2); c.stroke(); }
      const f = P(g.feet[0], g.feet[1]);
      c.fillStyle = 'rgba(255,255,255,0.9)';
      c.beginPath(); c.moveTo(f[0] - 7, f[1]); c.lineTo(f[0] + 7, f[1]); c.lineTo(f[0], f[1] - 10); c.closePath(); c.fill();
      c.font = '11px -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
      c.fillStyle = 'rgba(255,255,255,0.75)';
      c.fillText('head', hc[0] + R.head.r * size * k * 0.72, hc[1] - R.head.r * size * k * 0.72);
      c.fillText('neck: the head turns here', b[0] + 6, b[1] + 4);
      c.fillText('feet', f[0] + 9, f[1] - 2);
      c.restore();
    }
  };
})();
