// Animation Engine: the settings of the animation that is open. They are kept in the browser (and in
// the files Save settings makes) together with the defaults they were made with, so when a default
// changes in a new version, only the settings you actually changed are kept as yours.
(function () {
  const WL = (window.WL = window.WL || {});

  WL.defaults = function () {
    const P = {};
    for (const sec of WL.SCHEMA) {
      P[sec.id] = {};
      for (const it of sec.items) if (it.k && it.type !== 'button' && it.type !== 'curve') P[sec.id][it.k] = it.def;
    }
    return P;
  };

  // a settings object (from the browser or a file) on top of the defaults
  WL.mergeSettings = function (P, s) {
    const src = s.sections || s;
    // the defaults these settings were made with (the first WHITE logo version did not keep them)
    const was = s.defaults || ((s.version || 1) < 2 ? WL.ANIMATION.firstDefaults : null);
    for (const id in P) {
      if (!src[id]) continue;
      for (const k in P[id]) {
        if (!(k in src[id]) || typeof src[id][k] !== typeof P[id][k]) continue;
        if (was && was[id] && k in was[id] && was[id][k] === src[id][k]) continue;   // never changed: today's default
        P[id][k] = src[id][k];
      }
    }
    return P;
  };

  WL.settingsFile = function (P) {
    return { app: 'Animation Engine', animation: WL.ANIMATION.name, version: 2, sections: P, defaults: WL.defaults() };
  };

  WL.loadSettings = function () {
    const P = WL.defaults();
    try {
      let s = localStorage.getItem(WL.ANIMATION.storageKey);
      if (!s) for (const k of WL.ANIMATION.oldKeys || []) { s = localStorage.getItem(k); if (s) break; }
      if (s) WL.mergeSettings(P, JSON.parse(s));
    } catch (e) { /* no storage here: defaults */ }
    return P;
  };
  WL.saveSettings = function (P) {
    try { localStorage.setItem(WL.ANIMATION.storageKey, JSON.stringify(WL.settingsFile(P))); } catch (e) { /* ignore */ }
  };
})();
