// Animation Engine · WHITE logo: draws one frame from the look (see anim.js), through the camera.
//   1. the letters (at their place between Together and Separated) and the lines         -> T
//   2. the motion blur along the strokes (Procreate's Motion Blur: an even smear)         -> Tb
//   3. glows: Tb made smaller and blurred at a few sizes (Bloom, Chrome, breathing, flash)
//   4. compose: top layer (letters + Bloom + flash) over the Chrome layer, or your two PSD layers;
//      then the breathing                                                                 -> S
//   5. to the screen: chromatic aberration, the glitches, halftone, the background
//   6. White over it all (engine/character.js), once it is coming in
// 1-3 are kept from frame to frame and made again only when something they are made of changes (at
// rest, with the camera still, they stay as they are); every pass but 5 only works where there can be
// something (round the letters), and the rest of its picture is cleared, which is what it would be.
(function () {
  const WL = (window.WL = window.WL || {});
  const SH = WL.SH;
  const ANG = 61.9 * Math.PI / 180;                 // the strokes' slant (fitted on your Motion Blurred layer)
  WL.STROKE_ANGLE = 61.9;
  // your Bloomed White, fitted: two glows (PSD px sizes) and their gains
  const BLOOM = { s1: 6.68, s2: 24.63, g1: 0.273, g2: 0.459 };
  // your Chromed White, fitted: how far the red, green and blue copies move along the strokes (PSD px),
  // their gains, their Transparency where there is no letter, and their glows
  const CHROME = { shift: [75.6, 19.5, -72.15], k: [2.0, 2.44, 2.38], T: [0.042, 0.416, 0.057], glow: [0.779, 0.116, 0.393] };
  const SPACE_COL = 30 / 255;
  // along the strokes, up and to the right (PSD px, y down)
  const UP = [Math.cos(ANG), -Math.sin(ANG)];

  // How far each line must start from its place so that, sliding along the strokes, it only just
  // touches its letter at the start: worked out from the pictures, row by row across the strokes.
  function lineReach(letterImg, L, spaceImg, S) {
    const read = (img) => {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      return x.getImageData(0, 0, img.width, img.height).data;
    };
    const lp = read(letterImg), sp = read(spaceImg);
    const across = [-UP[1], UP[0]];
    const hi = new Map(), lo = new Map();
    const lx0 = L.x + L.dx, ly0 = L.y + L.dy;
    for (let y = 0; y < letterImg.height; y++) for (let x = 0; x < letterImg.width; x++) {
      if (lp[(y * letterImg.width + x) * 4] < 13) continue;
      const X = lx0 + x + 0.5, Y = ly0 + y + 0.5, a = X * UP[0] + Y * UP[1], b = Math.floor((X * across[0] + Y * across[1]) / 2);
      if (!hi.has(b) || a > hi.get(b)) hi.set(b, a);
      if (!lo.has(b) || a < lo.get(b)) lo.set(b, a);
    }
    let up = 0, down = 0;
    for (let y = 0; y < spaceImg.height; y++) for (let x = 0; x < spaceImg.width; x++) {
      if (sp[(y * spaceImg.width + x) * 4] < 40) continue;
      const X = S.x + x + 0.5, Y = S.y + y + 0.5, a = X * UP[0] + Y * UP[1], b = Math.floor((X * across[0] + Y * across[1]) / 2);
      if (hi.has(b)) up = Math.max(up, hi.get(b) - a);
      if (lo.has(b)) down = Math.max(down, a - lo.get(b));
    }
    return { up: up + 3, down: down + 3 };
  }

  const same = (a, b) => !!a && !!b && a.length === b.length && a.every((v, i) => v === b[i]);

  WL.Renderer = class {
    constructor(G, assets, images) {
      this.G = G; this.A = assets;
      const gl = G.gl;
      this.pSprite = G.program(SH.VS_SPRITE, SH.FS_LETTER);
      this.pSpace = G.program(SH.VS_SPRITE, SH.FS_SPACE);
      this.pBlur = G.program(SH.VS, SH.FS_MBLUR);
      this.pDown = G.program(SH.VS, SH.FS_DOWN);
      this.pGauss = G.program(SH.VS, SH.FS_BLUR);
      this.pCompose = G.program(SH.VS, SH.FS_COMPOSE);
      this.pFinal = G.program(SH.VS, SH.FS_FINAL);
      this.pCopy = G.program(SH.VS, SH.FS_COPY);
      // each letter's lines, one by one, each with its own reach (so every line starts going in at the
      // same moment); j counts the letters with lines (One after another goes letter by letter)
      let j = 0, id = 0;
      this.letters = assets.letters.map((L, i) => {
        const o = { ...L, tex: G.imageTexture(images.letters[i], false), lines: [] };
        (L.lines || []).forEach((S, m) => {
          const img = images.lines[i][m];
          let reach = { up: 300, down: 300 };
          try { reach = lineReach(images.letters[i], L, img, S); } catch (e) { /* keep the rough reach */ }
          o.lines.push({ x: S.x, y: S.y, w: S.w, h: S.h, tex: G.imageTexture(img, false), j, reach, id: id++ });
        });
        if (o.lines.length) j++;
        return o;
      });
      WL.LINE_COUNT = j;
      this.finB = { ...assets.finals.bloomed, tex: G.imageTexture(images.bloomed, true) };
      this.finC = { ...assets.finals.chromed, tex: G.imageTexture(images.chromed, true) };
      this.bg = assets.psd.bg.map((v) => v / 255);
      this.W = 0; this.H = 0;
      this.glows = {};
      this.sig = null;        // what steps 1-3 last drew (see _plan)
      this.ver = 0;           // counts the times they were drawn; a glow made from an older one is made again
      this.spots = new Float32Array(12); this.spotSeeds = new Float32Array(3);
      this.stats = { ms: 0 };
      // the characters put in (their pictures were loaded by main.js)
      this.chars = {};
      const CH = window.WL_CHARACTERS || {};
      for (const c of WL.ANIMATION.characters || []) if (CH[c.key] && images.chars && images.chars[c.key]) this.chars[c.sec] = new WL.CharacterRenderer(G, CH[c.key], images.chars[c.key]);
      gl.disable(gl.DEPTH_TEST);
    }

    resize(W, H) {
      if (W === this.W && H === this.H) return;
      const G = this.G;
      for (const k of ['T', 'M1', 'M2', 'H1', 'H2', 'S']) G.free(this[k]);
      for (const k in this.glows) { G.free(this.glows[k].t); G.free(this.glows[k].tmp); }
      if (this.pyr) this.pyr.forEach((t) => G.free(t));
      this.W = W; this.H = H;
      this.T = G.target(W, H);
      this.M1 = G.target(W, H);
      this.M2 = G.target(W, H);
      this.H1 = G.target(Math.ceil(W / 2), Math.ceil(H / 2));   // long blurs run at half size (they are smooth anyway)
      this.H2 = G.target(Math.ceil(W / 2), Math.ceil(H / 2));
      this.S = G.target(W, H, true);
      for (const id in this.chars) this.chars[id].resize(W, H);
      this.pyr = [];
      let w = W, h = H;
      for (let i = 1; i <= 6; i++) { w = Math.max(1, Math.ceil(w / 2)); h = Math.max(1, Math.ceil(h / 2)); this.pyr.push(G.target(w, h)); }
      this.glows = {};
      this.sig = null;
    }

    // a Gaussian glow of the source pyramid, sigma in screen px; kept in its own target and made
    // again only when the source or the size changed. this.reach: how far this frame's glows reach
    // out from the letters (screen px; the pyramid, the blur's taps and the upscale)
    glow(name, sigma) {
      const G = this.G;
      sigma = Math.max(0.6, sigma);
      const lvl = Math.max(0, Math.min(6, Math.floor(Math.log2(sigma / 2))));
      const src = lvl === 0 ? this.src : this.pyr[lvl - 1];
      let g = this.glows[name];
      if (!g || g.lvl !== lvl) {
        if (g) { G.free(g.t); G.free(g.tmp); }
        g = this.glows[name] = { lvl, t: G.target(src.w, src.h), tmp: G.target(src.w, src.h), ver: -1, sigma: 0 };
      }
      const s = sigma / Math.pow(2, lvl), R = Math.min(48, Math.ceil(3 * s));
      this.reach = Math.max(this.reach, (R + 4) * Math.pow(2, lvl) + 2);
      if (g.ver === this.ver && g.sigma === sigma) return g.t;
      // (round the letters only: their area at this level, as far as the blur's taps reach)
      const a = this.area[lvl], e = R + 2;
      const r = [Math.max(0, a[0] - e), Math.max(0, a[1] - e), Math.min(src.w, a[2] + e), Math.min(src.h, a[3] + e)];
      const p = this.pGauss.use();
      p.tex('uSrc', src).f('uDir', 1 / src.w, 0).f('uSigma', s).i('uR', R); G.pass(g.tmp, r);
      p.tex('uSrc', g.tmp).f('uDir', 0, 1 / src.h); G.pass(g.t, r);
      g.ver = this.ver; g.sigma = sigma;
      return g.t;
    }

    // what steps 1 and 2 draw: each letter's rectangle on the screen, each line's (with its letter
    // and how much of it shows), and the blur's length. sig lists all of it, so a frame can tell
    // whether anything changed.
    _plan(L, P, k, ox, oy) {
      const jx = L.jitter[0], jy = L.jitter[1];
      const rects = this.letters.map((Lt) => {
        const x = Lt.x + Lt.dx * L.spread + jx, y = Lt.y + Lt.dy * L.spread + jy;
        return [ox + x * k, oy + y * k, Lt.w * k, Lt.h * k];
      });
      const lines = [];
      if (L.spaces > 0.001) {
        const slide = L.spacesMode !== 'fade', T = P.t23;
        this.letters.forEach((Lt, i) => {
          for (const sp of Lt.lines) {
            let x = sp.x - Lt.dx * (1 - L.spread) + jx, y = sp.y - Lt.dy * (1 - L.spread) + jy, a = L.spaces;
            if (slide) {
              // slide in along the strokes, from the upper right or the lower left
              const e = WL.lineIn(P, L.spaces, sp.j);
              if (e <= 0.0005) continue;
              const dir = T['ins' + Lt.name] === 'll' ? -1 : 1;
              const d = ((dir > 0 ? sp.reach.up : sp.reach.down) + Math.max(0, T.insExtra)) * (1 - e) * dir;
              x += UP[0] * d; y += UP[1] * d; a = 1;
            }
            lines.push({ sp, i, a, rect: [ox + x * k, oy + y * k, sp.w * k, sp.h * k] });
          }
        });
      }
      const len = L.blur * k, sig = [this.W, this.H, len];
      for (const r of rects) sig.push(r[0], r[1], r[2], r[3]);
      for (const l of lines) sig.push(l.sp.id, l.a, l.rect[0], l.rect[1], l.rect[2], l.rect[3]);
      return { rects, lines, len, sig };
    }

    // steps 1-3: the letters and the lines -> T, the motion blur, the pyramid
    _source(plan, view) {
      const G = this.G, gl = G.gl, W = this.W, H = this.H;
      // where there can be something (this.area: GL px, y up), at full size and at each smaller level:
      // the letters' box (the lines are only ever on their letter), plus the blur's smear along the
      // strokes (half its length each way, and the taps' own reach), then 2 px more each level down
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const r of plan.rects) { x0 = Math.min(x0, r[0]); y0 = Math.min(y0, r[1]); x1 = Math.max(x1, r[0] + r[2]); y1 = Math.max(y1, r[1] + r[3]); }
      const sm = plan.len >= 0.75 ? 0.5 * plan.len : 0;
      const gx = Math.abs(Math.cos(ANG)) * sm + 12, gy = Math.abs(Math.sin(ANG)) * sm + 12;
      const fit = (a, w, h) => [Math.max(0, a[0]), Math.max(0, a[1]), Math.min(w, a[2]), Math.min(h, a[3])];
      let a = [Math.floor(x0 - gx), Math.floor(H - y1 - gy), Math.ceil(x1 + gx), Math.ceil(H - y0 + gy)];
      this.area = [fit(a, W, H)];
      for (let i = 1, w = W, h = H; i <= 6; i++) {
        w = Math.max(1, Math.ceil(w / 2)); h = Math.max(1, Math.ceil(h / 2));
        a = [Math.floor(a[0] / 2) - 2, Math.floor(a[1] / 2) - 2, Math.ceil(a[2] / 2) + 2, Math.ceil(a[3] / 2) + 2];
        this.area.push(fit(a, w, h));
      }
      // 1. the letters and the lines
      G.clear(this.T);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      let p = this.pSprite.use();
      p.f('uView', view).f('uA', 1);
      this.letters.forEach((Lt, i) => { p.f('uRect', plan.rects[i]).tex('uTex', Lt.tex); G.quad(); });
      if (plan.lines.length) {
        gl.blendFuncSeparate(gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
        p = this.pSpace.use();
        p.f('uView', view).f('uCol', SPACE_COL);
        for (const l of plan.lines) {
          p.f('uA', l.a).f('uRect', l.rect).tex('uTex', l.sp.tex).tex('uLet', this.letters[l.i].tex).f('uLetRect', plan.rects[l.i]);
          G.quad();
        }
      }
      gl.disable(gl.BLEND);

      // 2. the motion blur
      this.src = this.T;
      const len = plan.len;
      if (len >= 0.75) {
        const s = len / 4096, dx = Math.cos(ANG) * s / W, dy = Math.sin(ANG) * s / H;
        p = this.pBlur.use();
        const half = len >= 48, A = half ? this.H1 : this.M1, B = half ? this.H2 : this.M2, ar = this.area[half ? 1 : 0];
        p.tex('uSrc', this.T).f('uStep', dx, dy).f('uGain', 1); G.pass(A, ar);
        p.tex('uSrc', A).f('uStep', dx * 16, dy * 16); G.pass(B, ar);
        p.tex('uSrc', B).f('uStep', dx * 256, dy * 256); G.pass(A, ar);
        if (half) { this.pCopy.use().tex('uSrc', this.H1); G.pass(this.M1, this.area[0]); }
        this.src = this.M1;
      }

      // 3. the pyramid
      p = this.pDown.use();
      let prev = this.src;
      this.pyr.forEach((t, i) => { p.tex('uSrc', prev).f('uTexel', 1 / prev.w, 1 / prev.h); G.pass(t, this.area[i + 1]); prev = t; });
    }


    // box: the monitor box on the canvas (device px); the camera frames what is inside it
    draw(L, P, box) {
      const G = this.G, W = this.W, H = this.H;
      const t0 = performance.now();
      const { k, ox, oy } = WL.Cam.map(box, this.A, L.cam);
      const view = [W, H];

      // 1-3: the letters and the lines, the motion blur, the pyramid (only when something changed)
      const plan = this._plan(L, P, k, ox, oy);
      if (!same(plan.sig, this.sig)) { this._source(plan, view); this.sig = plan.sig; this.ver++; }

      // the glows (each made again only when its source or its size changed)
      this.reach = 0;
      const g1 = this.glow('g1', BLOOM.s1 * k * L.bloomSize);
      const g2 = this.glow('g2', BLOOM.s2 * k * L.bloomSize);
      // the live chrome's glows stay at your Chromed White's size
      const c1 = Math.abs(L.bloomSize - 1) < 1e-3 ? g1 : (L.chrome > 0 ? this.glow('c1', BLOOM.s1 * k) : g1);
      const c2 = Math.abs(L.bloomSize - 1) < 1e-3 ? g2 : (L.chrome > 0 ? this.glow('c2', BLOOM.s2 * k) : g2);
      const g3 = (L.breathGlow > 0) ? this.glow('g3', P.whole.brGlow * k) : g2;
      const g4 = (L.flash > 0.001) ? this.glow('g4', P.t12.flashSize * k) : g2;
      const g5 = (L.halo > 0.001) ? this.glow('g5', P.t12.flashSize * 4 * k) : g2;

      // 4. compose, only where something can be: round the letters as far as the blur, the glows and
      //    the chrome's copies reach, and your two PSD pictures (the rest of S is empty)
      const dist = P.s3.chDist * k;
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (const r of plan.rects) { x0 = Math.min(x0, r[0]); y0 = Math.min(y0, r[1]); x1 = Math.max(x1, r[0] + r[2]); y1 = Math.max(y1, r[1] + r[3]); }
      let grow = this.reach + 4;
      if (plan.len >= 0.75) grow += 0.5 * plan.len + 10;
      if (L.chrome > 0) grow += Math.max(...CHROME.shift.map(Math.abs)) * Math.abs(dist);
      x0 -= grow; y0 -= grow; x1 += grow; y1 += grow;
      if (L.final > 0) for (const f of [this.finB, this.finC]) {
        x0 = Math.min(x0, ox + f.x * k - 2); y0 = Math.min(y0, oy + f.y * k - 2);
        x1 = Math.max(x1, ox + (f.x + f.w) * k + 2); y1 = Math.max(y1, oy + (f.y + f.h) * k + 2);
      }
      let p = this.pCompose.use();
      p.tex('uT', this.src).tex('uG1', g1).tex('uG2', g2).tex('uC1', c1).tex('uC2', c2).tex('uG3', g3).tex('uG4', g4).tex('uG5', g5)
        .tex('uFinB', this.finB.tex).tex('uFinC', this.finC.tex)
        .f('uView', view).f('uOff', ox, oy).f('uK', k).f('uBright', L.bright)
        .f('uBloom', BLOOM.g1 * L.bloom, BLOOM.g2 * L.bloom).f('uFlash', L.flash, L.halo)
        .f('uChrome', L.chrome).f('uChDir', Math.cos(ANG) / W, Math.sin(ANG) / H)
        .f('uChShift', CHROME.shift[0] * dist, CHROME.shift[1] * dist, CHROME.shift[2] * dist)
        .f('uChK', CHROME.k).f('uChT', CHROME.T).f('uChGlow', CHROME.glow)
        .f('uFinal', L.final).f('uFinBR', this.finB.x, this.finB.y, this.finB.w, this.finB.h).f('uFinCR', this.finC.x, this.finC.y, this.finC.w, this.finC.h)
        .f('uBrLight', L.breathLight).f('uBrGlow', L.breathGlow)
        .f('uBr', P.whole.brSize, P.whole.brTwist, L.brT, P.whole.brContrast).f('uBrShift', L.brShift)
        .f('uBloomBr', L.bloomBr, P.whole.brBloomOwn);
      G.pass(this.S, [Math.max(0, Math.floor(x0)), Math.max(0, Math.floor(H - y1)), Math.min(W, Math.ceil(x1)), Math.min(H, Math.ceil(H - y0))]);
      const T = P.t23, st = L.glStyle || {};
      const w = st.w || [1, 0, 1, 0];
      const needHt = L.htAll > 0 || L.spots.length > 0 || (L.glitch > 0 && w[3] > 0);
      if (needHt) G.mips(this.S);

      // 5. to the screen
      G.bind(null);
      p = this.pFinal.use();
      const seed = ((st.seedBase || 0) % 9973) + Math.floor(L.clock / 4);
      const sp = this.spots.fill(0), sps = this.spotSeeds.fill(0);
      L.spots.forEach((s, i) => { sp.set([s.x, s.y, s.r, s.w], i * 4); sps[i] = s.seed % 100000; });
      // glitches stay round the letters (where they are now)
      let zx0 = 1e9, zy0 = 1e9, zx1 = -1e9, zy1 = -1e9;
      for (const Lt of this.letters) {
        const x = Lt.x + Lt.dx * L.spread, y = Lt.y + Lt.dy * L.spread;
        zx0 = Math.min(zx0, x); zy0 = Math.min(zy0, y); zx1 = Math.max(zx1, x + Lt.w); zy1 = Math.max(zy1, y + Lt.h);
      }
      p.f('uZone', zx0 - 200, zy0 - 70, zx1 + 200, zy1 + 70);
      p.tex('uS', this.S).f('uView', view).f('uOff', ox, oy).f('uK', k).f('uBg', this.bg)
        .f('uDir', Math.cos(ANG), Math.sin(ANG)).f('uCA', L.ca * k)
        .f('uGl', L.glitch).f('uGlW', w[0], w[1], w[2], w[3]).f('uGlP', seed, L.clock, T.glUntouched, T.glSize)
        .f('uGlD', T.dChrome * k, T.dDiverge * k, T.dJump * k, T.dArtifact * k)
        .f('uHtCell', Math.max(3, T.htCell * k)).f('uHtAll', L.htAll)
        .fv('uSp', sp, 4).fv('uSpSeed', sps, 1);
      G.quad();

      // 6. White
      if (L.ch && this.chars.white) this.chars.white.draw(L.ch, P.white, { k, ox, oy });
      this.stats.ms = performance.now() - t0;
    }
  };
})();
