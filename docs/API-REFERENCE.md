# WHITE 模组开发 API 参考文档

> 面向模组作者 · 适用版本 v3.2.0+ · 社区 playtest 团队维护
>
> 一个模组 = 一个 `.js` 文件，放进手机的 `WHITE/MODS/` 目录即自动加载。

---

## 1. 快速开始

### 1.1 模组模板

在游戏内点 **MOD 按钮 → 生成模板**，或直接复制下面的骨架保存为 `my-mod.js`：

```js
WHITE_API.registerMod({
    name: 'my-mod',            // 模组内部名（英文，唯一）
    version: '1.0.0',          // 版本号
    author: '你的署名',         // 署名（MOD 面板会显示）
    desc: '介绍: 这个模组是做什么的',  // 介绍（MOD 面板会显示）

    onInit: function(api) {
        // api === window.WHITE_API
        api.console.log('[my-mod] 模组已加载 ✔', 'success');
    },

    onDisable: function(api) {
        // 可选：被用户在 MOD 面板禁用时调用，做清理工作
    }
});
```

### 1.2 加载机制

| 行为 | 说明 |
|------|------|
| 自动加载 | 游戏启动约 2 秒后，自动执行 `WHITE/MODS/*.js`（跳过已禁用的） |
| 手动刷新 | MOD 面板 → 刷新；或控制台 `mod` 命令查看列表 |
| 禁用 | MOD 面板一键禁用，立即卸载（触发 `onDisable`），重启后彻底跳过 |
| 日志 | 加载成功/失败/启停全部写入 `WHITE/log/模组管理器日志/mods.log` |

---

## 2. `WHITE_API` 全局对象（游戏内 JS）

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| `version` | string | API 版本号 |
| `engine` | object\|null | 游戏引擎实例（捕获自 `window.__white`，就绪后发出 `engineReady` 事件） |
| `mods` | object | 已注册模组表 `{ name: mod对象 }` |
| `on(event, cb)` | method | 订阅事件（如 `engineReady`） |
| `emit(event, data)` | method | 触发事件 |
| `registerMod(m)` | method | 注册模组（见模板） |
| `storage.get(k)` / `.set(k, v)` | method | localStorage 读写 |
| `console` | object | 内核命令端（见 §3） |
| `dat` | object | DAT 存储接口（见 §4） |
| `bash` | object | 白名单 shell 接口（见 §5） |
| `modManager` | object | 模组管理器（`refresh()` / `loadMods()` / `template()`） |

---

## 3. `WHITE_API.console` — 内核命令端

```js
api.console.log(text, type)      // 输出到控制台与 LOG 面板，type: 'info'|'error'|'success'
api.console.execute(input)       // 执行一条命令（等价于用户输入）
api.console.registerCommand(name, desc, callback)  // 注册新命令
```

`callback(args)` 接收去掉命令名后的参数数组。

**内置命令**：`help` `eval` `api`（查看 API 结构）`mod`（模组列表）`clear`
**后端命令**（经白名单 bash）：`ls` `cat` `pwd` `df` `uname` `free` `ps` `grep` `find` `stat` `head` `tail` `mkdir` `cp` `echo`

---

## 4. `WHITE_API.dat` — DAT 存储接口

存档/设置统一以 `.DAT` 后缀落盘，防路径穿越（强制白名单目录 + 后缀校验）。

```js
api.dat.list('saves')                 // 列出存档目录 → {status, files:[{name,size,mtime}]}
api.dat.list('settings')              // 列出设置目录
api.dat.read('saves', 'save1.dat')    // 读取 → {status:'ok', content}
api.dat.write('settings', 'cfg.dat', '内容')  // 写入（自动补 .DAT）
api.dat.mods()                        // 列出 MODS 目录
api.dat.exec(cmd)                     // 走 /api/exec 白名单命令
```

> 对应磁盘路径：`WHITE/存档/*.DAT` 与 `WHITE/设置/*.DAT`

---

## 5. `WHITE_API.bash` — 白名单 shell

```js
const r = await api.bash.exec('ls /storage/emulated/0/WHITE');
// r = { status:'ok', output } 或 { status:'blocked', msg }
```

- 命令必须在白名单内；含 `rm`/`sudo`/管道/重定向/`..` 等危险模式会被拦截
- 工作目录固定在 `WHITE/`

---

## 6. 后端 HTTP API（node 服务 `http://127.0.0.1:3000`）

供模组（页面内 fetch）或**外部命令端**（同局域网 curl）调用。

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/get_commands` | 获取可用命令列表 |
| POST | `/api/exec` | 白名单命令 `{cmd}` |
| POST | `/api/bash` | 白名单 bash `{cmd}` |
| GET | `/api/dat/list?type=saves\|settings` | 列 .DAT |
| GET | `/api/dat/read?type=…&name=…` | 读 .DAT |
| POST | `/api/dat/write` | 写 .DAT `{type,name,content}` |
| GET | `/api/mods/list` | 列 MODS 目录 |
| GET | `/api/mods/read?name=x.js` | 读模组源码 |
| POST | `/api/mods/write` | 写模组 `{name,content}`（模板生成就用它） |
| POST | `/api/log/game` | 追加游戏日志 `{line}` |
| POST | `/api/log/mods` | 追加模组日志 `{line}` |
| POST | `/api/remote/push` | 外部推送命令 `{cmd}`（进队列） |
| GET | `/api/remote/poll` | 内核模组取走队列命令（取走即清空） |
| POST | `/api/remote/result` | 内核输出回传 `{line}` |
| GET | `/api/remote/results` | 外部拉取内核输出 |

**外部命令端示例**（手机与电脑同一局域网）：

```bash
curl -X POST http://<手机IP>:3000/api/remote/push \
     -H "Content-Type: application/json" -d '{"cmd":"help"}'
curl http://<手机IP>:3000/api/remote/results
```

---

## 7. 目录结构

```
/storage/emulated/0/WHITE/
├── 存档/  *.DAT
├── 设置/  *.DAT
├── MODS/  *.js          ← 模组放这里
└── log/
    ├── 游戏日志/         crash.log（崩溃）· game.log（控制台）
    ├── node日志/         node.log（后端输出）
    └── 模组管理器日志/    mods.log（模组事件）
```

---

## 8. 开发建议

1. **先在控制台验证**：用 `eval` 快速试 API 调用，跑通再写进模组
2. **善用 `api` 命令**：实时查看 WHITE_API 的结构与数据类型
3. **署名规范**：`author` 填社区 ID，`desc` 一句话说明功能，方便其他玩家在 MOD 面板识别
4. **数据持久化**：用户数据用 `api.dat.write('settings', 'my-mod.dat', json)`，不要写 localStorage（清数据会丢）
5. **崩溃排查**：游戏异常看 `log/游戏日志/crash.log`，模组不加载看 `log/模组管理器日志/mods.log`，后端问题看 `log/node日志/node.log`

---

*文档随版本更新，最新版见仓库 [WHITE-Node-Wrapper-v2](https://github.com/isaquxet08-ai/WHITE-Node-Wrapper-v2)。*
