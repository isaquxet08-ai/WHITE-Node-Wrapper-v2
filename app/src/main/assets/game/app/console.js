(function() {
    if (!window.WHITE_API) return;
    const Console = {
        commands: {}, history: [], historyIndex: -1,
        registerCommand: function(n, d, cb) { this.commands[n.toLowerCase()] = { desc: d, run: cb }; },
        log: function(t, type = 'info') {
            const out = document.getElementById('white-console-output');
            if (out) {
                const color = type === 'error' ? '#ff5555' : (type === 'success' ? '#50fa7b' : '#f8f8f2');
                const line = document.createElement('div'); line.style.color = color; line.innerText = t;
                out.appendChild(line); out.scrollTop = out.scrollHeight;
            }
        },
        execute: function(input) {
            const args = input.trim().split(/\s+/); const cmdName = args[0].toLowerCase();
            if (!cmdName) return; this.log(`> ${input}`, 'input'); this.history.push(input); this.historyIndex = this.history.length;
            if (cmdName === 'clear') { document.getElementById('white-console-output').innerHTML = ''; return; }
            const cmd = this.commands[cmdName];
            if (cmd) { try { cmd.run(args.slice(1)); } catch (e) { this.log(`[错误] ${cmdName}: ${e.message}`, 'error'); } }
            else { this.log(`[错误] 未知命令: '${cmdName}'。输入 'help' 查看。`, 'error'); }
        },
        runShell: function(commandString) {
            if (!window.WHITE_API.isNodeEnv) { this.log("[提示] 安卓版不支持 Linux 命令沙盒", "error"); return; }
            this.log(`[Bash] 执行: ${commandString} ...`, 'info');
            window.WHITE_API.bash.exec(commandString).then(data => {
                if (data.status === 'ok') { const lines = data.output.split('\n'); lines.forEach(line => { if(line.trim()) this.log(line, 'success'); }); }
                else { this.log(`[拦截] ${data.msg || data.output}`, 'error'); }
            }).catch(err => this.log(`[执行失败] ${err}`, 'error'));
        },
        init: function() {
            this.createUI();
            this.registerCommand('help', '显示命令列表', () => { for (let [name, data] of Object.entries(this.commands)) this.log(`${name.padEnd(15)} - ${data.desc}`); });
            this.registerCommand('eval', '执行 JS 代码', (args) => { try { this.log(`[结果]: ${eval(args.join(' '))}`); } catch (e) { this.log(`[错误]: ${e.message}`, 'error'); } });
            this.log("WHITE 开发者控制台已就绪。", 'success');
        },
        createUI: function() {
            if (document.getElementById('white-console-btn')) return;
            const btn = document.createElement('div'); btn.id = 'white-console-btn'; btn.innerText = ">_";
            btn.style.cssText = "position:fixed; bottom:20px; left:20px; z-index:2147483647; background:rgba(0,0,0,0.8); color:#50fa7b; border:2px solid #50fa7b; padding:10px 15px; border-radius:8px; font-family:monospace; font-weight:bold; font-size:16px; cursor:pointer;";
            const panel = document.createElement('div'); panel.id = 'white-console-panel';
            panel.style.cssText = "position:fixed; top:0; left:0; width:100%; height:50%; z-index:2147483646; background:rgba(20,20,20,0.95); color:#f8f8f2; font-family:monospace; font-size:13px; display:none; flex-direction:column; box-sizing:border-box; border-bottom:2px solid #50fa7b;";
            panel.innerHTML = '<div id="white-console-output" style="flex:1; overflow-y:auto; padding:10px;"></div><div style="display:flex; border-top:1px solid #333; padding:5px;"><span style="color:#50fa7b; padding:5px;">&gt;</span><input id="white-console-input" type="text" style="flex:1; background:transparent; border:none; color:#fff; outline:none; font-family:monospace;" placeholder="输入命令..."></div>';
            document.body.appendChild(btn); document.body.appendChild(panel);
            const input = document.getElementById('white-console-input');
            btn.onclick = () => { panel.style.display = panel.style.display === 'none' ? 'flex' : 'none'; if(panel.style.display === 'flex') input.focus(); };
            input.onkeydown = (e) => { if (e.key === 'Enter') { this.execute(input.value); input.value = ''; } };
        }
    };
    window.WHITE_API.console = Console; Console.init();
})();
