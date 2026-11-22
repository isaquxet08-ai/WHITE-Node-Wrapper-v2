// Animation Engine · WHITE logo: the shaders. Images are premultiplied RGBA on a transparent background (like a
// Procreate layer); the background colour goes under at the very end. "Screen px" are pixels of the
// window; "PSD px" are pixels of your 4000 x 3000 Logo.psd (x right, y down).
(function () {
  const WL = (window.WL = window.WL || {});
  const S = (WL.SH = {});

  S.VS = `#version 300 es
in vec2 aPos;
out vec2 vUV;
void main() { vUV = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

  // a picture drawn into a rectangle given in screen px (top left, y down)
  S.VS_SPRITE = `#version 300 es
in vec2 aPos;
uniform vec4 uRect;
uniform vec2 uView;
out vec2 vUV;
void main() {
  vec2 a = aPos * 0.5 + 0.5;
  vec2 q = vec2(a.x, 1.0 - a.y);
  vec2 p = uRect.xy + q * uRect.zw;
  vUV = q;
  gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0);
}`;

  const HEAD = `#version 300 es
precision highp float;
precision highp int;
in vec2 vUV;
out vec4 o;
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);
uint pcg(uint v) { uint s = v * 747796405u + 2891336453u; uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u; return (w >> 22u) ^ w; }
// a random number in 0..1 for each whole-number cell p
float h3(vec3 p) { uvec3 q = uvec3(ivec3(floor(p))); return float(pcg(q.x + pcg(q.y + pcg(q.z)))) * (1.0 / 4294967295.0); }
`;

  // a letter: its picture holds how solid the brush is; the letters are white
  S.FS_LETTER = HEAD + `
uniform sampler2D uTex;
uniform float uA;
void main() { o = vec4(texture(uTex, vUV).r * uA); }`;

  // the lines (the spaces): dark strokes painted over the letters, drawn with blending that only darkens
  // what is already there, and only on their own letter (uLet at uLetRect), so a line sliding in shows
  // only where it is inside its letter
  S.FS_SPACE = HEAD + `
uniform sampler2D uTex, uLet;
uniform float uA;
uniform float uCol;
uniform vec4 uLetRect;          // the letter's rectangle on the screen (px: x, y, w, h; top left, y down)
uniform vec2 uView;
void main() {
  vec2 sp = vec2(gl_FragCoord.x, uView.y - gl_FragCoord.y);
  vec2 lu = (sp - uLetRect.xy) / uLetRect.zw;
  float inside = step(0.0, lu.x) * step(lu.x, 1.0) * step(0.0, lu.y) * step(lu.y, 1.0);
  float own = smoothstep(0.0, 0.04, textureLod(uLet, lu, 0.0).r) * inside;
  float s = texture(uTex, vUV).r * uA * own;
  o = vec4(vec3(uCol * s), s);
}`;

  // Motion blur, as Procreate's: a straight smear of uN taps; three passes (steps s, 16 s, 256 s)
  // make one even smear 4096 taps long.
  S.FS_MBLUR = HEAD + `
uniform sampler2D uSrc;
uniform vec2 uStep;
uniform float uGain;
void main() {
  vec4 acc = vec4(0.0);
  for (int i = 0; i < 16; i++) acc += texture(uSrc, vUV + uStep * (float(i) - 7.5));
  o = acc * (uGain / 16.0);
}`;

  S.FS_COPY = HEAD + `
uniform sampler2D uSrc;
void main() { o = texture(uSrc, vUV); }`;

  // half size (a 4 x 4 average from 4 taps)
  S.FS_DOWN = HEAD + `
uniform sampler2D uSrc;
uniform vec2 uTexel;
void main() {
  vec2 d = uTexel;
  o = 0.25 * (texture(uSrc, vUV + vec2(-d.x, -d.y)) + texture(uSrc, vUV + vec2(d.x, -d.y))
            + texture(uSrc, vUV + vec2(-d.x, d.y)) + texture(uSrc, vUV + vec2(d.x, d.y)));
}`;

  // one direction of a Gaussian blur
  S.FS_BLUR = HEAD + `
uniform sampler2D uSrc;
uniform vec2 uDir;
uniform float uSigma;
uniform int uR;
void main() {
  vec4 acc = texture(uSrc, vUV);
  float ws = 1.0, k = -0.5 / (uSigma * uSigma);
  for (int i = 1; i <= 48; i++) {
    if (i > uR) break;
    float f = float(i), w = exp(k * f * f);
    acc += w * (texture(uSrc, vUV + uDir * f) + texture(uSrc, vUV - uDir * f));
    ws += 2.0 * w;
  }
  o = acc / ws;
}`;

  const NOISE = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.6;
  for (int i = 0; i < 2; i++) { s += a * snoise(p); p = mat2(1.4, 1.0, -1.0, 1.4) * p + vec2(17.1, 9.2); a *= 0.4; }
  return s / 0.84;
}
// Breathing: a soft pattern of light that flows and curls (a pattern warped by two other patterns).
// uBr: x size (PSD px), y twist, z time (already times the flow speed), w contrast.
// uBrShift: the breath; the lit patches grow (above 0) or shrink (below 0).
uniform vec4 uBr;
uniform float uBrShift;
float breathMask(vec2 P) {
  vec2 p = P / uBr.x;
  float t = uBr.z;
  vec2 q = vec2(snoise(0.6 * p + t * vec2(0.31, 0.17)), snoise(0.6 * p + vec2(5.2, 1.3) - t * vec2(0.23, 0.29)));
  float n = fbm(p + 0.5 * uBr.y * q + t * vec2(0.11, -0.07));
  float v = 0.5 + 0.5 * n + uBrShift;
  float c = 0.5 / max(uBr.w, 1.0);
  return smoothstep(0.5 - c, 0.5 + c, v);
}`;

  // The picture before the post effects: the top layer (the letters with their spaces, Bloom, the
  // flash glow) over the bottom layer (the Chrome copy); or, for the final look, your Bloomed White
  // over your Chromed White; then the breathing.
  S.FS_COMPOSE = HEAD + NOISE + `
uniform sampler2D uT, uG1, uG2, uC1, uC2, uG3, uG4, uG5, uFinB, uFinC;   // uC1, uC2: the bloom's two glows at your Bloomed White's size (for the chrome)
uniform vec2 uView, uOff;
uniform float uK;
uniform float uBright;
uniform vec2 uBloom;            // Bloom: the gains of the small and the large glow
uniform vec2 uFlash;            // the flash: the gains of its glow and of its wide halo
uniform float uChrome;          // the Chrome layer (live) under the letters, 0..1
uniform vec2 uChDir;            // the strokes' direction, uv per screen px (up and right)
uniform vec3 uChShift;          // how far the red, green and blue copies move along it, screen px
uniform vec3 uChK, uChT, uChGlow;
uniform float uFinal;           // 1 = your Bloomed White over your Chromed White
uniform vec4 uFinBR, uFinCR;    // where those pictures sit (PSD px: x, y, w, h)
uniform float uBrLight, uBrGlow;
uniform vec2 uBloomBr;          // x: how much the breathing patches switch the bloom on and off;
                                // y: 0 = in the same patches as the light, 1 = in patches of its own

vec4 pic(sampler2D t, vec4 r, vec2 P) {
  vec2 uv = (P - r.xy) / r.zw;
  vec4 c = texture(t, uv);
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  return c * inside;
}

// the Chrome copy, matched to your Chromed White: the red copy moved up along the strokes and
// sharp, the green a little up and soft, the blue moved down and a little soft; each brighter where
// the letters are and faint (its Transparency) where they are not; each with its own glow.
vec4 chromeLive(vec2 uv) {
  vec2 dR = uChDir * uChShift.x, dG = uChDir * uChShift.y, dB = uChDir * uChShift.z;
  float f0 = texture(uT, uv).a;
  vec3 s = vec3(texture(uT, uv - dR).a, texture(uC2, uv - dG).a, texture(uC1, uv - dB).a);
  vec3 P = min(vec3(1.0), uChK * s * (uChT + (1.0 - uChT) * f0));
  vec3 G = min(vec3(1.0), uChGlow * vec3(texture(uC2, uv - dR).a, texture(uC2, uv - dG).a, texture(uC2, uv - dB).a));
  vec3 c = P + G - P * G;
  return vec4(c, max(c.r, max(c.g, c.b)));
}

void main() {
  vec2 uv = vUV;
  vec2 P = vec2(gl_FragCoord.x - uOff.x, uView.y - gl_FragCoord.y - uOff.y) / uK;
  vec4 t = texture(uT, uv);
  bool br = uBrLight > 0.0 || uBrGlow > 0.0;
  // the breathing mask is worked out only where it changes something (it only ever multiplies)
  float m = -1.0;
  vec4 g = uBloom.x * texture(uG1, uv) + uBloom.y * texture(uG2, uv);
  if (uBloomBr.x > 0.0 && g != vec4(0.0)) {
    m = breathMask(P);
    float mb = m;
    if (uBloomBr.y > 0.0) mb = mix(m, breathMask(P + vec2(2173.0, -1361.0)), uBloomBr.y);
    g *= mix(1.0, mb, uBloomBr.x);
  }
  if (uFlash.x > 0.0) g += uFlash.x * texture(uG4, uv);
  if (uFlash.y > 0.0) g += uFlash.y * texture(uG5, uv);
  g = min(g, vec4(1.0)); g.rgb = min(g.rgb, vec3(g.a));
  vec4 top = t + g - t * g;                       // screen
  vec4 live = top;
  if (uChrome > 0.0) live = top + chromeLive(uv) * (uChrome * (1.0 - top.a));
  live = min(live * uBright, vec4(1.0));
  vec4 s = live;
  if (uFinal > 0.0) {
    vec4 fb = pic(uFinB, uFinBR, P), fc = pic(uFinC, uFinCR, P);
    s = mix(live, fb + fc * (1.0 - fb.a), uFinal);
  }
  if (br) {
    vec4 g3 = texture(uG3, uv);
    if (s != vec4(0.0) || g3 != vec4(0.0)) {
      if (m < 0.0) m = breathMask(P);
      s = min(s * (1.0 + uBrLight * (2.0 * m - 1.0)), vec4(1.0));
      vec4 bg = min(g3 * (m * uBrGlow * uBright), vec4(1.0));
      bg.rgb = min(bg.rgb, vec3(bg.a));
      s = s + bg - s * bg;
    }
  }
  o = s;
}`;

  // The last pass, to the screen: the post effects, then the background under everything.
  S.FS_FINAL = HEAD + `
uniform sampler2D uS;
uniform vec2 uView, uOff;
uniform float uK;
uniform vec3 uBg;
uniform vec2 uDir;              // the strokes' direction on the screen (up and right), unit
uniform float uCA;              // chromatic aberration over everything now, screen px
// the glitch: pieces of the logo, each glitching its own way, changing on their own clocks
uniform float uGl;              // how much (0 = off)
uniform vec4 uGlW;              // how often each kind: chrome, artifact, diverge, halftone
uniform vec4 uGlP;              // x pattern seed, y the pieces' clock, z share left untouched, w piece size
uniform vec4 uGlD;              // screen px: chrome split, diverge split, jump, artifact reach
uniform float uHtCell;          // halftone dot spacing, screen px
uniform float uHtAll;           // halftone over everything (the onset effect), 0..1
uniform vec4 uZone;             // where glitches may happen: round the letters (PSD px: x0, y0, x1, y1)
uniform vec4 uSp[3];            // small glitches: centre (PSD px), size (PSD px), how much now
uniform float uSpSeed[3];

vec4 S(vec2 px) { return textureLod(uS, px / uView, 0.0); }
vec4 samp(vec2 px) {
  if (uCA <= 0.01) return S(px);
  vec2 d = uDir * uCA;
  vec4 c = S(px), r = S(px - d), b = S(px + d);
  return vec4(r.r, c.g, b.b, max(c.a, max(r.a, b.a)));
}

// light dots on the dark: a red, a green and a blue dot screen at their own angles, each dot as big
// as that colour is bright there (they add up to white where all three are lit)
vec4 halftone(vec2 px, float cell) {
  const vec3 ANG = vec3(0.2618, 1.309, 0.7854);
  vec3 cov = vec3(0.0);
  float lod = max(0.0, log2(cell) - 1.0);
  for (int i = 0; i < 3; i++) {
    float a = ANG[i], cs = cos(a), sn = sin(a);
    vec2 q = vec2(cs * px.x + sn * px.y, -sn * px.x + cs * px.y) / cell;
    vec2 cc = floor(q) + 0.5;
    vec2 cw = cc * cell;
    vec2 pc = vec2(cs * cw.x - sn * cw.y, sn * cw.x + cs * cw.y);
    float v = textureLod(uS, pc / uView, lod)[i];
    v = max(0.0, (v - 0.12) / 0.88);                 // faint glow makes no dots (no specks in the empty dark)
    float r = cell * sqrt(min(1.0, v * 1.2) / 3.14159);
    float dd = length(q - cc) * cell;
    cov[i] = clamp(r - dd + 0.5, 0.0, 1.0);
  }
  return vec4(cov, max(cov.r, max(cov.g, cov.b)));
}

// Glitch Artifact: thin streaks pulled sideways out of the picture, tinted, in dashes (drawn under it)
vec4 artifact(vec2 px, vec3 k, float inten) {
  float rowT = max(1.0, 3.0 * uK);
  float row = floor(px.y / rowT);
  vec3 kk = vec3(k.x, row, k.z + k.y * 7.0);
  float lit = step(h3(kk), 0.6);
  float side = h3(kk + vec3(0.0, 0.0, 5.0)) < 0.5 ? -1.0 : 1.0;
  float pull = uGlD.w * inten * pow(h3(kk + vec3(0.0, 0.0, 11.0)), 0.75);
  float seg = mix(20.0, 160.0, h3(kk + vec3(0.0, 0.0, 23.0))) * uK;
  float dash = floor((px.x + h3(kk + vec3(0.0, 0.0, 31.0)) * seg) / seg);
  lit *= step(h3(vec3(dash, row, kk.z + 41.0)), 0.72);
  vec4 s = S(px - vec2(side * pull, 0.0));
  float tp = h3(kk + vec3(0.0, 0.0, 53.0));
  vec3 tint = tp < 0.45 ? vec3(1.0) : tp < 0.65 ? vec3(0.55, 1.0, 1.0) : tp < 0.8 ? vec3(1.0, 1.0, 0.45) : tp < 0.9 ? vec3(1.0, 0.45, 1.0) : vec3(0.7);
  float bright = mix(0.35, 1.0, h3(kk + vec3(0.0, 0.0, 67.0)));
  return vec4(s.rgb * tint, s.a) * (lit * bright);
}

// Glitch Diverge: thin rows whose red, green and blue slide apart sideways
vec4 diverge(vec2 px, vec3 k, float inten) {
  float rowH = max(1.0, mix(3.0, 12.0, h3(k + vec3(0.0, 0.0, 71.0))) * uK);
  float row = floor(px.y / rowH);
  vec3 kk = vec3(row, k.x, k.z + k.y * 7.0);
  float gate = step(h3(kk), 0.75);
  vec3 r = vec3(h3(kk + vec3(0.0, 0.0, 1.0)), h3(kk + vec3(0.0, 0.0, 2.0)), h3(kk + vec3(0.0, 0.0, 3.0))) - 0.5;
  vec3 off = uGlD.y * inten * (0.3 + 3.4 * abs(r)) * sign(r) * gate;
  vec4 cr = samp(px - vec2(off.r, 0.0)), cg = samp(px - vec2(off.g, 0.0)), cb = samp(px - vec2(off.b, 0.0));
  return vec4(cr.r, cg.g, cb.b, max(cr.a, max(cg.a, cb.a)));
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 P = vec2(px.x - uOff.x, uView.y - px.y - uOff.y) / uK;
  vec4 c = vec4(0.0), under = vec4(0.0);
  bool done = false;
  vec2 out2 = max(max(uZone.xy - P, P - uZone.zw), vec2(0.0));
  float zone = (1.0 - smoothstep(0.0, 90.0, out2.x)) * (1.0 - smoothstep(0.0, 90.0, out2.y));
  if (uGl > 0.001 && zone > 0.0) {
    float sz = uGlP.w, seed = uGlP.x;
    float band = 140.0 * sz;
    float cb = floor(P.y / band);
    float nsub = floor(1.0 + 4.0 * h3(vec3(cb, seed, 1.0)));
    float row = cb * 8.0 + floor(fract(P.y / band) * nsub);
    float w = mix(70.0, 620.0, pow(h3(vec3(row, seed, 2.0)), 1.5)) * sz;
    float col = floor((P.x + h3(vec3(row, seed, 3.0)) * w) / w);
    float ls = floor(uGlP.y + h3(vec3(row, col, seed + 5.0)));
    vec3 k = vec3(row * 3.0 + col * 17.0, ls, seed);
    float r0 = h3(k), r1 = h3(k + vec3(0.0, 0.0, 11.0)), r2 = h3(k + vec3(0.0, 0.0, 23.0)), r3 = h3(k + vec3(0.0, 0.0, 37.0));
    float keep = step(uGlP.z, h3(vec3(row, col, seed + 61.0)));     // some pieces never glitch
    if (keep > 0.5 && r0 < uGl * zone) {
      float inten = min(1.0, uGl * mix(0.55, 1.15, r1));
      vec2 q = px;
      if (r3 < 0.35) q.x += (h3(k + vec3(0.0, 0.0, 41.0)) - 0.5) * 2.0 * uGlD.z * inten;
      float tot = max(1e-4, dot(uGlW, vec4(1.0)));
      float pick = r2 * tot;
      if (pick < uGlW.x) {
        vec2 d = uDir * uGlD.x * inten * (h3(k + vec3(0.0, 0.0, 43.0)) < 0.7 ? 1.0 : -0.6);
        vec4 cc = samp(q), cr = samp(q - d), cbb = samp(q + d);
        c = vec4(cr.r, cc.g, cbb.b, max(cc.a, max(cr.a, cbb.a)));
      } else if (pick < uGlW.x + uGlW.y) {
        c = samp(q);
        under = artifact(q, k, inten);
      } else if (pick < uGlW.x + uGlW.y + uGlW.z) {
        c = diverge(q, k, inten);
      } else {
        c = mix(samp(q), halftone(q, uHtCell), min(1.0, 0.45 + inten));
      }
      done = true;
    }
  }
  if (!done) c = samp(px);

  // small glitches at a few spots (Stage 3): bands jump sideways, a few show the picture from just
  // above or below, the colours split, a few bands flash, a few turn to halftone dots
  for (int i = 0; i < 3; i++) {
    vec4 sp = uSp[i];
    if (sp.w <= 0.0) continue;
    // (beyond its widest reach nothing happens: skip the work there)
    vec2 far = abs(P - sp.xy) / vec2(sp.z * 1.35 * 1.4, sp.z);
    if (max(far.x, far.y) >= 1.0) continue;
    float bandH = 9.0;
    float band = floor(P.y / bandH);
    float sd = uSpSeed[i];
    float rag = 0.6 + 0.8 * h3(vec3(band, sd, 1.0));
    vec2 q = (P - sp.xy) / vec2(sp.z * 1.35 * rag, sp.z);
    float w = sp.w * (1.0 - smoothstep(0.45, 1.0, length(q)));
    if (w <= 0.002) continue;
    vec2 qx = px;
    if (h3(vec3(band, sd, 3.0)) < 0.7 * w) qx.x += (h3(vec3(band, sd, 5.0)) - 0.5) * 2.0 * 30.0 * uK * w;
    if (h3(vec3(band, sd, 7.0)) < 0.25 * w) qx.y += (h3(vec3(band, sd, 9.0)) - 0.5) * 6.0 * bandH * uK;
    float split = (6.0 + 12.0 * h3(vec3(band, sd, 13.0))) * uK * w;
    vec4 a = samp(qx), r = samp(qx - vec2(split, 0.0)), b = samp(qx + vec2(split, 0.0));
    vec4 g = vec4(r.r, a.g, b.b, max(a.a, max(r.a, b.a)));
    if (h3(vec3(band, sd, 17.0)) < 0.3 * w) g = mix(g, halftone(qx, uHtCell), 0.85);
    float fl = step(h3(vec3(band, sd, 11.0)), 0.12 * w) * 0.55 * w;
    g.rgb = mix(g.rgb, vec3(g.a), fl);
    c = mix(c, g, smoothstep(0.0, 0.25, w));
  }

  c = c + under * (1.0 - c.a);
  if (uHtAll > 0.0) c = mix(c, halftone(px, uHtCell), uHtAll);
  vec3 col = uBg * (1.0 - c.a) + c.rgb;
  col += (h3(vec3(gl_FragCoord.xy, 977.0)) - 0.5) / 255.0;   // a hair of dither, so soft glows never band
  o = vec4(col, 1.0);
}`;
})();
