# WHITE-Native-Engine 项目交接书（给接手的 Agent）

## 一、我们在干什么

把 H5 游戏《白》（WHITE，原作者用 JS 写的网页游戏，主引擎 `white-engine.js` 共 20186 行）移植成一个**原生 Android 引擎**。铁律：

1. **原作者的 JS 一行不改**（`white-engine.js` / `game.js` / `world.js` / `assets.js` / intro 模块），原样跑在 QuickJS 小核上
2. 只有我们补写的**浏览器垫片**（shim.js，模拟 window/document/canvas/WebGL/Audio 等）才用 KT 实现
3. **多核架构**：渲染管线/音频/逻辑/UI 分属不同核心
4. 版本号用 **T 前缀**（T 号 = 累计 Release 总数，当前 T87），A/B/C 是同一 T 号下的修版

## 二、核心分工（多核架构）

| 核心 | 载体 | 职责 |
|---|---|---|
| 大核 GL | GLThread（KT） | 渲染管线、GL 回放、位图串行执行 |
| 小核 JS | 逻辑线程 QuickJS + VSync | 跑作者全部 JS，tick 驱动 |
| 音频核 | AudioHost（KT） | BGM/Palette PCM/波形合成 |
| UI 核 | WebView | DOM 层 |
| 黑匣子 | BlackBox + `:blackbox` 独立进程哨兵 | 全核心跳、会话落盘、死亡报告 |

核间通信三种绑定模式：DIRECT（直调）/ LATCH_RET（latch 到 GL 线程取真值）/ GL_QUEUE（进指令队列）。桥方法清单与 `BATCH_METHODS` op 表在 `WhiteEngine.kt` 与 `shim.js` 两端严格同序，是唯一共享契约。

## 三、崩溃史与结论（重点看这个）

- **T83→T86-A（7 次运行）全死**在 white-engine.js 顶层求值中、Canvas2D surface#1 创建后 ~1.8s。T86-A 日志里的天然对照实锤：20:36 一次无批量通道的旧版运行**全程存活**（surface 建到 #22），挂了批量通道的 7/7 必死 → 批量通道是暴露因素不是根因
- **T86-B**（关掉批量通道 GL_BATCH_CHANNEL=false）：不崩了，但黑屏。尸检：位图桥 `canvasDraw` 等原来从逻辑线程 DIRECT 直调 → **小核写 Skia 位图与大核 drawTexture 读同一位图并发**（时序错位=SIGSEGV，时序复原=KT 异常→JS 求值中断→黑屏）。旧日志只打 `e.message`=null，真异常被吞
- **T87（v4.9.4-native，versionCode 96，刚发布未真机验证）**：
  1. 位图族 12 个桥方法（canvasCreate/Resize/Draw/FillRect/ClearRect/PixelsB64/PixelsB64Z/RegionB64/PutImageB64/ToTexture/Destroy/ScreenLayer）全部 latch 串行化到 GL 大核（`glSerialSet`），与渲染互斥
  2. 音频核空闲心跳（3s idle，消黑匣子误报）
  3. 继承 T86-C：异常深度解包（cause 链+栈落地日志）、统一签名、存储权限被拒→引导设置页
- **3D 澄清**：`white3d.js` 不属于主游戏（独立 demo 页 white3d.html 专用，SDF 人体渲染：CPU 四元数 IK 22 骨 56 胶囊段 + GPU fragment shader 求交），主链不加载它，与崩溃无关；`world.js` 由 game.js `preconnect()` 运行时动态注入 script（垫片 v4.6.3 已支持）

## 四、下一步

1. 真机装 T87 跑，导出日志（黑匣子心跳已打进主日志每 5s 一行；死亡报告镜像在 `04-崩溃日志/`）
2. 活了 → 单独重开 `GL_BATCH_CHANNEL=true` 在活基线上验证性能（通道代码保留，Proxy 录制 34 热方法→扁平数字段→帧尾一次跨核）
3. 死了 → 看日志里逐桥心跳 `直调:/latch:/GL队列:` 最后停在哪个桥调用上

## 五、资产与凭据

- **GitHub**：`isaquxet08-ai/WHITE-Node-Wrapper-v2`（公开），所有版本挂 Release
  - 原版包：releases/download/original-pack/WHITE.apk
  - 当前改版包：releases/download/v4.9.4-native/WHITE-4.9.4-native.apk
- **Token**（用户已授权移交）：`<TOKEN-已移除-见用户>`（账号 isaquxet08-ai，建过全部 Release；用户后发的另一个 token 已过期）
- **源码**：`/workspace/WHITE-Native-Engine`；构建+签名一条龙：`./build-sign.sh <版本名>`；统一签名 `release.keystore`（storepass/keypass 均 `white-native-2026`，alias `white-native`）——以后所有版本用同一签名覆盖安装
- **用户上传的日志**：7z 包解压后目录 `日志/`，关键文件：`native-engine.log`、`02-游戏输出/logic.log`、`04-崩溃日志/死亡报告.txt`（存在=真崩溃，缺失=冻结强杀）、`黑匣子/会话-*/心跳.log`
- 原版游戏资源参照：`/workspace/work/assets/game/`（index.html 主链：assets.js → white-engine.js → game.js → mod-loader.js）

## 六、和用户的协作习惯

- 用户会直接丢 7z 日志包说「崩溃了呀」——先解压尸检再动手，改完出包发 GitHub Release 并给直链
- 改动前用户喜欢先讨论架构，动手时要求「核间联系和合并逻辑一次写好」
- 汇报用表格对照、结论先行；版本描述用户确认后再定 T 号
