// Animation Engine: the monitor box. It is the frame the animation is seen in: the camera frames
// what is inside it, and everything outside it is cut off (shown darkened, so you can see what is
// cut). Drawn on its own see-through layer over the picture.
(function () {
  const WL = (window.WL = window.WL || {});
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const SHAPES = { '16:9': 16 / 9, '16:10': 1.6, '4:3': 4 / 3, '3:2': 1.5, '1:1': 1, '4:5': 0.8, '9:16': 9 / 16, '21:9': 21 / 9, '2.39:1': 2.39 };

  WL.monitor = {
    SHAPES,
    // the box in the free part of the window (CSS px). With the box hidden it takes all the free
    // space, so the framing stays the same, only bigger.
    layout(av, W) {
      const r = SHAPES[W.monShape] || 16 / 9;
      const s = W.monOn ? clamp(W.monSize, 0.3, 1) : 1;
      let w = Math.min(av.w, av.h * r), h = w / r;
      w *= s; h *= s;
      return { x: av.x + (av.w - w) / 2, y: av.y + (av.h - h) / 2, w, h };
    },
    // draw the overlay. info: { label (top right), saved: a rectangle (the stage's saved frame, when
    // the view has been moved away from it) }
    draw(cv, b, W, info) {
      const dpr = window.devicePixelRatio || 1;
      const cw = cv.clientWidth, ch = cv.clientHeight;
      const pw = Math.max(1, Math.round(cw * dpr)), ph = Math.max(1, Math.round(ch * dpr));
      if (cv.width !== pw || cv.height !== ph) { cv.width = pw; cv.height = ph; }
      const c = cv.getContext('2d');
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, pw, ph);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      // anything the animation draws over the picture (a character's rig)
      if (info && info.extra) info.extra(c);
      if (!W.monOn) return;
      // outside the box: darkened
      if (W.monDim > 0) {
        c.fillStyle = 'rgba(0,0,0,' + clamp(W.monDim, 0, 1) + ')';
        c.beginPath();
        c.rect(0, 0, cw, ch);
        c.rect(b.x, b.y, b.w, b.h);
        c.fill('evenodd');
      }
      c.lineWidth = 1;
      c.strokeStyle = 'rgba(255,255,255,0.55)';
      c.strokeRect(Math.round(b.x) - 0.5, Math.round(b.y) - 0.5, Math.round(b.w) + 1, Math.round(b.h) + 1);
      c.font = '11px -apple-system, BlinkMacSystemFont, "Helvetica Neue", system-ui, sans-serif';
      c.textBaseline = 'bottom';
      c.fillStyle = 'rgba(255,255,255,0.6)';
      c.textAlign = 'left';
      if (b.y > 16) c.fillText(W.monShape, b.x, b.y - 5);
      if (info && info.label && b.y > 16) { c.textAlign = 'right'; c.fillText(info.label, b.x + b.w, b.y - 5); c.textAlign = 'left'; }
      // guides
      c.strokeStyle = 'rgba(255,255,255,0.28)';
      if (W.monSafe) {
        c.setLineDash([4, 4]);
        for (const f of [0.93, 0.9]) {
          const w = b.w * f, h = b.h * f;
          c.strokeRect(b.x + (b.w - w) / 2, b.y + (b.h - h) / 2, w, h);
        }
        c.setLineDash([]);
      }
      if (W.monThirds) {
        c.beginPath();
        for (const f of [1 / 3, 2 / 3]) {
          c.moveTo(b.x + b.w * f, b.y); c.lineTo(b.x + b.w * f, b.y + b.h);
          c.moveTo(b.x, b.y + b.h * f); c.lineTo(b.x + b.w, b.y + b.h * f);
        }
        c.stroke();
      }
      if (W.monCross) {
        const x = b.x + b.w / 2, y = b.y + b.h / 2;
        c.beginPath(); c.moveTo(x - 9, y); c.lineTo(x + 9, y); c.moveTo(x, y - 9); c.lineTo(x, y + 9); c.stroke();
      }
      // the stage's saved frame, when you have moved away from it
      const s = info && info.saved;
      if (s) {
        c.strokeStyle = 'rgba(143,211,255,0.85)';
        c.setLineDash([6, 5]);
        c.strokeRect(s.x, s.y, s.w, s.h);
        c.setLineDash([]);
        c.fillStyle = 'rgba(143,211,255,0.9)';
        c.textBaseline = 'top';
        c.fillText('saved frame', s.x + 4, s.y + 4);
      }
    },
  };
})();
