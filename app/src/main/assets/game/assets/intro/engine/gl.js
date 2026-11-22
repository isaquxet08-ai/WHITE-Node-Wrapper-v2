// Animation Engine: small WebGL2 helpers (programs, textures, render targets, the full-screen quad).
// Everything is a classic script (no modules), so the page opens straight from the disk.
(function () {
  const WL = (window.WL = window.WL || {});

  // keep: keep each frame's picture after it is shown (only the tests need that: it costs a copy of
  // the whole screen every frame)
  WL.createGL = function (canvas, keep = false) {
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: keep, powerPreference: 'high-performance' });
    if (!gl) throw new Error('This page needs WebGL2 (Chrome, Edge, Safari 15+ or Firefox).');
    const half = !!gl.getExtension('EXT_color_buffer_float') || !!gl.getExtension('EXT_color_buffer_half_float');
    gl.getExtension('OES_texture_float_linear');
    const G = { gl, half };

    // ---------- programs ----------
    function shader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(s);
        const lines = src.split('\n').map((l, i) => (i + 1) + ': ' + l).join('\n');
        console.error(log + '\n' + lines);
        throw new Error('Shader error: ' + log);
      }
      return s;
    }
    G.program = function (vs, fs) {
      const p = gl.createProgram();
      gl.attachShader(p, shader(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fs));
      gl.bindAttribLocation(p, 0, 'aPos');
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('Link error: ' + gl.getProgramInfoLog(p));
      // every uniform's place; each picture (sampler) gets a texture unit of its own, once
      const loc = {}, unit = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      gl.useProgram(p);
      for (let i = 0, u = 0; i < n; i++) {
        const info = gl.getActiveUniform(p, i);
        const name = info.name.replace(/\[0\]$/, '');
        loc[name] = gl.getUniformLocation(p, info.name);
        if (info.type === gl.SAMPLER_2D) { unit[name] = u; gl.uniform1i(loc[name], u++); }
      }
      const P = {
        p, loc,
        use() { gl.useProgram(p); return P; },
        f(name, ...v) {
          const l = loc[name]; if (!l) return P;
          if (v.length === 1 && Array.isArray(v[0])) v = v[0];
          if (v.length === 1) gl.uniform1f(l, v[0]);
          else if (v.length === 2) gl.uniform2f(l, v[0], v[1]);
          else if (v.length === 3) gl.uniform3f(l, v[0], v[1], v[2]);
          else gl.uniform4f(l, v[0], v[1], v[2], v[3]);
          return P;
        },
        fv(name, arr, size) { const l = loc[name]; if (!l) return P; (size === 4 ? gl.uniform4fv : size === 3 ? gl.uniform3fv : size === 2 ? gl.uniform2fv : gl.uniform1fv).call(gl, l, arr); return P; },
        i(name, v) { const l = loc[name]; if (l) gl.uniform1i(l, v); return P; },
        tex(name, t) {
          const u = unit[name]; if (u === undefined) return P;
          gl.activeTexture(gl.TEXTURE0 + u);
          gl.bindTexture(gl.TEXTURE_2D, t && t.tex ? t.tex : t);
          return P;
        },
      };
      return P;
    };

    // ---------- the quad ----------
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    G.quad = function () { gl.bindVertexArray(vao); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };

    // ---------- textures ----------
    G.imageTexture = function (img, premultiply) {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !!premultiply);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return { tex: t, w: img.width, h: img.height };
    };

    // a render target: a texture (half float when the GPU allows it) and its framebuffer
    G.target = function (w, h, mips) {
      w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      const levels = mips ? Math.floor(Math.log2(Math.max(w, h))) + 1 : 1;
      gl.texStorage2D(gl.TEXTURE_2D, levels, half ? gl.RGBA16F : gl.RGBA8, w, h);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      if (!ok) throw new Error('Could not make a render target ' + w + 'x' + h);
      return { tex: t, fb, w, h, mips: !!mips };
    };
    G.free = function (T) { if (!T) return; gl.deleteTexture(T.tex); if (T.fb) gl.deleteFramebuffer(T.fb); };
    G.bind = function (T) {
      if (T) { gl.bindFramebuffer(gl.FRAMEBUFFER, T.fb); gl.viewport(0, 0, T.w, T.h); }
      else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); }
    };
    G.clear = function (T) { G.bind(T); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); };
    // draw the program in use into T, only inside the rectangle a (GL px, y up: [x0, y0, x1, y1]); the
    // rest of T is cleared. For passes whose picture is surely empty outside a: the same picture, less work.
    G.pass = function (T, a) {
      gl.disable(gl.SCISSOR_TEST);
      G.clear(T);
      if (a[2] <= a[0] || a[3] <= a[1]) return;
      gl.enable(gl.SCISSOR_TEST); gl.scissor(a[0], a[1], a[2] - a[0], a[3] - a[1]);
      G.quad();
      gl.disable(gl.SCISSOR_TEST);
    };
    G.mips = function (T) { gl.bindTexture(gl.TEXTURE_2D, T.tex); gl.generateMipmap(gl.TEXTURE_2D); };
    return G;
  };

  // load a data: URL into an Image
  WL.loadImage = function (src) {
    return new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error('image')); im.src = src; });
  };
})();
