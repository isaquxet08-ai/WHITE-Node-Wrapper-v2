(function() {
    if (window.WHITE_API && window.WHITE_API.version) return;
    const isNodeEnv = window.location.protocol === 'http:';
    const WHITE_API = {
        version: "1.0.0-core", engine: null, events: {}, isNodeEnv: isNodeEnv,
        on: function(e, cb) { if(!this.events[e]) this.events[e]=[]; this.events[e].push(cb); },
        emit: function(e, d) { if(this.events[e]) this.events[e].forEach(cb => { try{cb(d)}catch(err){} }); },
        mods: {}, registerMod: function(m) { if(!m.name) return; this.mods[m.name] = m; if(m.onInit) setTimeout(() => m.onInit(this), 100); },
        storage: { get: (k) => localStorage.getItem(k), set: (k, v) => localStorage.setItem(k, v), getAll: () => { let r={}; for(let i=0; i<localStorage.length; i++){let k=localStorage.key(i); r[k]=localStorage.getItem(k);} return r; } },
        bash: {
            exec: function(cmd) {
                if (!isNodeEnv) return Promise.reject("当前为安卓原生环境，不支持 Linux 命令沙盒");
                return new Promise((resolve, reject) => {
                    fetch('/api/bash', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cmd: cmd }) }).then(r => r.json()).then(resolve).catch(reject);
                });
            }
        }
    };
    window.WHITE_API = WHITE_API;
    let tickCount = 0;
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        return originalRAF.call(window, function(timestamp) {
            tickCount++; WHITE_API.emit('tick', { count: tickCount, time: timestamp, engine: WHITE_API.engine });
            return callback(timestamp);
        });
    };
    window.addEventListener('keydown', (e) => WHITE_API.emit('keydown', e), true);
    let tries = 0;
    const watcher = setInterval(() => {
        tries++;
        if (window.__white) { clearInterval(watcher); WHITE_API.engine = window.__white; WHITE_API.emit('engineReady', WHITE_API.engine); }
        else if (tries > 100) clearInterval(watcher);
    }, 500);
})();
