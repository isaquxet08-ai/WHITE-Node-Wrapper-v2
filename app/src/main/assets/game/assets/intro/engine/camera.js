// Animation Engine: the camera. Each stage keeps a frame: how far it is zoomed in (1 = the whole PSD
// frame fits the monitor box) and which point of the PSD sits in the middle of the box. Between
// stages the camera moves from frame to frame along a curve.
(function () {
  const WL = (window.WL = window.WL || {});
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  // a CSS-style cubic Bezier ease with handles (x1, y1) and (x2, y2); y may go past 0..1 (overshoot)
  function bezier(x1, y1, x2, y2, u) {
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    x1 = clamp(x1, 0, 1); x2 = clamp(x2, 0, 1);
    const bx = (s) => 3 * (1 - s) * (1 - s) * s * x1 + 3 * (1 - s) * s * s * x2 + s * s * s;
    const by = (s) => 3 * (1 - s) * (1 - s) * s * y1 + 3 * (1 - s) * s * s * y2 + s * s * s;
    let lo = 0, hi = 1, s = u;
    for (let i = 0; i < 40; i++) { s = (lo + hi) / 2; if (bx(s) < u) lo = s; else hi = s; }
    return by(s);
  }

  const Cam = {
    bezier,
    MIN: 0.1, MAX: 40,
    // screen px per PSD px at zoom 1 (the PSD frame fits the box)
    fit(box, A) { return Math.min(box.w / A.psd.w, box.h / A.psd.h); },
    // where the PSD sits on the screen for a frame f {z, x, y}: scale k and offset (ox, oy)
    map(box, A, f) {
      const k = Cam.fit(box, A) * f.z;
      return { k, ox: box.x + box.w / 2 - f.x * k, oy: box.y + box.h / 2 - f.y * k };
    },
    toPSD(box, A, f, sx, sy) { const m = Cam.map(box, A, f); return [(sx - m.ox) / m.k, (sy - m.oy) / m.k]; },
    // zoom by a factor round a screen point (the point under your fingers stays under them)
    zoomAt(box, A, f, factor, sx, sy) {
      const [px, py] = Cam.toPSD(box, A, f, sx, sy);
      const z = clamp(f.z * factor, Cam.MIN, Cam.MAX);
      const k = Cam.fit(box, A) * z;
      return { z, x: px - (sx - box.x - box.w / 2) / k, y: py - (sy - box.y - box.h / 2) / k };
    },
    // move the picture by (dx, dy) screen px
    pan(box, A, f, dx, dy) { const k = Cam.fit(box, A) * f.z; return { z: f.z, x: f.x - dx / k, y: f.y - dy / k }; },
    // between two frames (e = 0..1, more or less for an overshoot): the zoom changes evenly on a log
    // scale, round the one point of the PSD that stays put on the screen, so it feels like one move
    lerp(a, b, e) {
      const lr = Math.log(b.z / a.z);
      const z = a.z * Math.exp(lr * e);
      if (Math.abs(lr) < 1e-4) return { z, x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e };
      const px = (a.x * a.z - b.x * b.z) / (a.z - b.z), py = (a.y * a.z - b.y * b.z) / (a.z - b.z);
      const s = a.z / z;
      return { z, x: px - (px - a.x) * s, y: py - (py - a.y) * s };
    },
    same(a, b) { return Math.abs(Math.log(a.z / b.z)) < 1e-3 && Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5; },
  };
  WL.Cam = Cam;
})();
