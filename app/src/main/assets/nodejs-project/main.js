const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;
const GAME_DIR = path.join(__dirname, '..', 'game'); 
const MODS_DIR = path.join(GAME_DIR, 'mods'); 
const BASH_DIR = path.join(GAME_DIR, 'api', 'bash');
const GAME_EXE = path.join(GAME_DIR, 'Play WHITE.exe'); // 原版程序名
const INDEX_HTML = path.join(GAME_DIR, 'index.html');
const BACKUP_HTML = path.join(GAME_DIR, 'index_original.html');

// 确保目录存在
if (!fs.existsSync(MODS_DIR)) fs.mkdirSync(MODS_DIR, { recursive: true });
if (!fs.existsSync(BASH_DIR)) fs.mkdirSync(BASH_DIR, { recursive: true });

// 🔥 核心：文件劫持与还原逻辑
function hijackGame() {
    if (!fs.existsSync(INDEX_HTML)) {
        console.log("⚠️ 找不到 index.html，请确保 game 文件夹里有游戏本体！");
        return;
    }
    // 1. 备份原文件
    fs.copyFileSync(INDEX_HTML, BACKUP_HTML);
    // 2. 写入跳转文件
    fs.writeFileSync(INDEX_HTML, '<meta http-equiv="refresh" content="0;url=http://localhost:3000">');
    console.log("✅ 游戏入口已劫持，准备拉起原版窗口...");

    // 3. 启动原版游戏
    if (fs.existsSync(GAME_EXE)) {
        exec(`"${GAME_EXE}"`);
    } else {
        console.log("⚠️ 找不到 Play WHITE.exe，请检查路径！");
        // 没找到就退回浏览器
        exec(`start http://localhost:${PORT}`);
    }
}

function restoreGame() {
    if (fs.existsSync(BACKUP_HTML)) {
        fs.copyFileSync(BACKUP_HTML, INDEX_HTML);
        fs.unlinkSync(BACKUP_HTML); // 删除备份
        console.log("🔄 游戏原版入口已还原。");
    }
}

// 监听退出信号，退出时还原文件
process.on('SIGINT', () => { restoreGame(); process.exit(); });
process.on('exit', () => { restoreGame(); });

// ---------------------------------------------------------
// 以下是你的原有 API 处理逻辑
// ---------------------------------------------------------
const BASH_CONFIG = {
    ALLOWED_COMMANDS: ['ls', 'cat', 'pwd', 'echo', 'grep', 'find', 'stat', 'head', 'tail', 'mkdir', 'cp', 'uname', 'ps', 'df', 'free'],
    DANGEROUS_PATTERNS: ['-rf', '-r ', '-f ', 'rm ', 'sudo', 'chmod', 'chown', '>', '>>', '|', '&&', ';', '../', '..\\']
};

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    let urlPath = req.url.split('?')[0]; 
    if (urlPath === '/') urlPath = '/index.html';

    if (urlPath === '/api/bash' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const data = JSON.parse(body);
            const cmdString = (data.cmd || '').trim();
            if (!cmdString) { res.writeHead(400); res.end(JSON.stringify({ status: 'error', msg: '命令为空' })); return; }
            
            const cmdName = cmdString.split(/\s+/)[0];
            if (!BASH_CONFIG.ALLOWED_COMMANDS.includes(cmdName)) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', msg: `🛡️ 拦截：禁止执行 [${cmdName}]` })); return;
            }
            for (let pattern of BASH_CONFIG.DANGEROUS_PATTERNS) {
                if (cmdString.includes(pattern)) {
                    res.writeHead(403, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'error', msg: `🛡️ 拦截：包含危险字符 [${pattern}]` })); return;
                }
            }

            exec(cmdString, { cwd: GAME_DIR, timeout: 3000 }, (error, stdout, stderr) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                let output = stdout || stderr || (error ? error.message : '');
                if (output.length > 5000) output = output.substring(0, 5000) + '\n... [截断]';
                res.end(JSON.stringify({ status: error ? 'error' : 'ok', output: output }));
            });
        });
        return;
    }

    if (urlPath === '/index.html') {
        fs.readFile(path.join(GAME_DIR, 'index_original.html'), 'utf8', (err, data) => {
            // 如果备份没找到，可能没劫持，直接用原版
            let htmlData = data;
            if (err) {
                try { htmlData = fs.readFileSync(INDEX_HTML, 'utf8'); } catch(e) { res.writeHead(404); return res.end('Not Found'); }
            }
            
            const modFiles = fs.readdirSync(MODS_DIR).filter(f => f.endsWith('.js'));
            const bashFiles = fs.readdirSync(BASH_DIR).filter(f => f.endsWith('.js'));
            
            let injectionScripts = `<script src="/__mod_loader__.js"></script>\n<script src="/app/console.js"></script>\n`;
            bashFiles.forEach(file => { injectionScripts += `<script src="/api/bash/${file}"></script>\n`; });
            modFiles.forEach(file => { injectionScripts += `<script src="/mods/${file}?t=${Date.now()}"></script>\n`; });

            const injectedHtml = htmlData.replace('</body>', `  ${injectionScripts}</body>`);
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(injectedHtml);
        });
        return;
    }

    if (urlPath === '/__mod_loader__.js') {
        return res.end(fs.readFileSync(path.join(__dirname, 'android', 'mod-loader.js'), 'utf8'));
    }
    if (urlPath === '/app/console.js') {
        return res.end(fs.readFileSync(path.join(__dirname, 'android', 'console.js'), 'utf8'));
    }
    if (urlPath.startsWith('/mods/')) {
        return res.end(fs.readFileSync(path.join(MODS_DIR, urlPath.replace('/mods/', '')), 'utf8'));
    }
    if (urlPath.startsWith('/api/bash/')) {
        return res.end(fs.readFileSync(path.join(BASH_DIR, urlPath.replace('/api/bash/', '')), 'utf8'));
    }

    fs.readFile(path.join(GAME_DIR, urlPath), (err, data) => {
        if (err) { res.writeHead(404); return res.end('Not Found'); }
        const ext = path.extname(urlPath).toLowerCase();
        const mimeTypes = { '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.html': 'text/html', '.mp3': 'audio/mpeg' };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 本地服务器已启动，端口 ${PORT}`);
    hijackGame(); // 🔥 启动游戏
});
