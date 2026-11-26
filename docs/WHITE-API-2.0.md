# WHITE Native 引擎 — 模组 API/ABI 2.0 全开放白皮书

> 从底层到表层全部开放。模组与游戏运行在**同一 QuickJS 上下文** —— 能看到的一切都能改。

## 模组形态

- 目录：`/storage/emulated/0/WHITE/MODS/*.js`（启动自动执行，与游戏同上下文）
- 可选清单 `*.json`：`{ "name": "...", "version": "...", "permissions": [...] }`
- 每个模组独立 try/catch —— 一个模组崩了不影响游戏和其他模组

## 能力总览（ABI 2.0）

| 层 | 能力 | 入口 |
|---|---|---|
| 底层·存档 | DAT 读写 | `WHITE_NATIVE.datList/datRead/datWrite` |
| 底层·文件 | 游戏本体文件全读写（自动备份） | `WHITE_NATIVE.game.list/read/write` |
| 底层·对话 | 官方 white-edits 对话覆写 | `WHITE_NATIVE.edits.read/writeLines/reset` |
| 底层·Shell | 受限真 sh（锁 `WHITE/` 目录） | `WHITE_NATIVE.bash` / `WHITE_API.bash.exec` |
| 逻辑层 | 引擎运行时钩子（同上下文直接 patch） | `window.WL`、全局函数、内部状态 |
| 表层 | DOM/UI（按钮、面板、样式注入） | shim `document` + `WHITE_API.ui` |
| 自描述 | 能力探测 | `WHITE_NATIVE.abi()` |

## ① 改角色对话（正道：官方 white-edits 机制）

游戏启动时 `assets.js` 加载 `edits.json`（`kind:"white-edits"`），`lines` 表内的文本按 key 覆写 —— 这是**官方原生的文本覆写通道**，改完下次启动生效：

```js
// 覆写角色台词
WHITE_NATIVE.edits.writeLines({
  "title.begin": "开始新的故事",
  "intro.hello": "你好，我是 WHITE。"
});

// 查看当前覆写表
console.log(WHITE_NATIVE.edits.read());

// 清空覆写（恢复原版文本）
WHITE_NATIVE.edits.reset();
```

## ② 底层文件全开放（剧情/对话/配置直接改）

```js
WHITE_NATIVE.game.list("app")            // 列目录 → [{d:1,n:".."}|{f:1,n:"game.js",s:123}]
WHITE_NATIVE.game.read("edits.json")     // 读任意文件
WHITE_NATIVE.game.write("edits.json", s) // 写任意文件
```

- 根目录即游戏本体目录，`app/`、`assets/` 全部可读写
- **首次写入某路径前自动备份**到 `/storage/emulated/0/WHITE/BACKUP/<路径>` —— 想回滚直接把备份拷回去
- 改 `app/*.js` 等代码文件需重装/重解压后生效（或用 ③ 运行时钩子立即生效）

## ③ 运行时钩子（同上下文，最大灵活度）

模组与游戏共享全局作用域，**任何函数都能包装**：

```js
// 例：拦截所有对话渲染，追加前缀
var _R = window.R;                      // 翻译/文本函数（以实际全局名为准，可在模组里探测）
window.R = function (k, o) {
  var t = _R ? _R(k, o) : k;
  return "[MOD] " + t;                  // 想怎么改就怎么改
};

// 例：监听场景切换
document.addEventListener.apply(document, ["click", function (e) { /* ... */ }]);
// shim DOM 全量可用: document.getElementById('#begin').addEventListener('click', ...)
```

引擎对象：`window.WL`（引擎内核：loadImage/ANIMATION/…）、`window.WL_ASSETS`（资产注册表）、`window.WHITE_V`。

## ④ 表层 UI

```js
// shim DOM —— 注入的按钮直接出现在游戏画面（经 DOM 镜像渲染，带官方 CSS）
var b = document.createElement('button');
b.textContent = '我的按钮';
b.addEventListener('click', function () { WHITE_NATIVE.bash('ls'); });
document.getElementById('app').appendChild(b);
```

## ⑤ Shell

```js
WHITE_NATIVE.bash('ls -la')             // 同步返回输出，工作目录锁 /storage/emulated/0/WHITE
WHITE_API.bash.exec('cat saves.dat')    // Promise 风格（兼容旧 WebView 版加载器）
```

## ⑥ 语言无关协议（为 Java 模组铺路）

`WHITE_NATIVE` 桥的每个方法都是 **String→String(JSON) 消息协议** —— 不绑定 JS：
- 现在：QuickJS 模组直接调用
- 未来：Java/Kotlin 模组经同一桥注入（同一协议、同一能力面），ABI 版本号向后兼容

## 版本约定

- ABI 2.0：能力面 `["dat","game.fs","edits","bash","dom","engine.hooks","ui"]`
- 兼容承诺：同一大版本内方法只增不改；能力探测用 `WHITE_NATIVE.abi()`
