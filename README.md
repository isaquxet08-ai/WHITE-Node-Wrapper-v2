# WHITE Mod Suite

WHITE 改版 APK 发布仓库。**本仓库不含任何反编译源码**，仅发布自研产物的二进制版本。

## 目录体系（外部存储，App 启动自动创建）

```
/storage/emulated/0/WHITE/
├── 存档/    ← 游戏存档，全部 *.DAT
├── 设置/    ← 设置数据，全部 *.DAT
└── MODS/    ← 模组逻辑，*.js
```

## 版本发布

| 标签 | APK | 说明 |
|---|---|---|
| v2.0.0 | WHITE_new2.apk | Node 26 后端自启动 + MODS 外部加载 + 授权引导 |
| v3.0.0 | WHITE_new3.apk | WHITE 目录体系 + .DAT 读写 API + DAT 存储设置面板 + 微型终端 |

## JS 后端 API（node launcher.js，端口 3000）

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/get_commands` | GET | 指令库打包下发 |
| `/api/exec` `/api/bash` | POST | 微型终端，白名单命令执行，cwd=WHITE |
| `/api/dat/list?type=saves\|settings` | GET | 列出 .DAT 文件 |
| `/api/dat/read?type=&name=` | GET | 读 .DAT |
| `/api/dat/write {type,name,content}` | POST | 写 .DAT（自动补 .DAT 后缀，防路径穿越） |
| `/api/mods/list` | GET | 列出 MODS 目录 |

## 模组形态

纯 JS 分发：mod 是裸 `.js` 文件，放入 `WHITE/MODS/` 即被 `mod-loader.js` 加载，通过 `window.WHITE_API` 挂载逻辑（`registerMod` / `bash.exec` / `dat.*`）。

## 安装注意

- v2/v3 同签名，可覆盖升级；从更早版本升级需先卸载
- 首次启动需授权"所有文件访问"，并等待 node 资产解压（约几秒，二次启动跳过）
- JS 后端日志：`/data/data/com.white.game/files/node/node.log`
