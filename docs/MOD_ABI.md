# WHITE Native Engine — Mod API / ABI 全开放规范 (v0.1 草案)

> 本文是引擎与模组之间的**契约**, 从引擎第一天起生效。
> 原则: **模组是一等公民** — 不是事后逆向的钩子, 而是设计时预留的插槽。

---

## 0. 三层扩展模型

| 层 | 面向 | 语言 | 能力上限 | 许可证 |
|---|---|---|---|---|
| **L1 Core ABI** | 原生模组 (性能敏感: 新渲染器/物理/视频解码) | C ABI (JNI 直通) | 与引擎同进程, 全能力 | 自由 |
| **L2 Script API** | 脚本模组 (99% 的模组: 改数值/加按钮/新对话) | JS (QuickJS 沙箱) | 引擎开放的 API 面 | 自由 |
| **L3 资源包** | 内容扩展 (新章节/新皮肤/翻译) | JSON + 资源文件 | 数据层, 无代码 | 由内容作者定 |

**L2 是主战场** — 与现有 WebView 版 `WHITE_API` 语义对齐, 老模组零迁移。

---

## 1. ABI 版本策略 (对模组作者的承诺)

```jsonc
{
  "white.abi.version": "1.0.0",   // 语义化: 主版本.次版本.补丁
  "white.engine.version": "0.1.0"
}
```

- **主版本+1** 才允许破坏性变更, 且旧 API 保留一个主版本的弃用期
- 模组声明 `"abi": "^1.0"` 即可表达兼容范围
- `engine.getAbiVersion()` 查询; 不兼容时模组拒载并给出原因, **绝不静默失败**

---

## 2. L2 Script API (与 WebView 版 WHITE_API 对齐)

```js
// ---- 生命周期 ----
WHITE.registerMod({
    name, version, author, desc,
    abi: '^1.0',
    onInit(api) { ... },      // 模组入口
    onDestroy(api) { ... },   // 可选: 清理钩子 (新版, WebView 版没有)
});

// ---- 日志/控制台 (对齐 WHITE_API.console) ----
api.console.log(text, type)               // info|success|error|warn
api.console.registerCommand(name, desc, fn)

// ---- UI 按钮 (对齐 WHITE_API.ui, 全字段开放) ----
api.ui.createButton(id, {
    text, color, textColor, fontSize,
    x, y, width, height, scale, draggable, opacity,
    onClick
})    // 原生绘制 (GL 层或原生 View), 不再吃 WebView 合成开销
api.ui.update(id, patch)
api.ui.removeButton(id) / api.ui.listButtons() / api.ui.openSettings()

// ---- 存档/设置 (对齐 WHITE_API.dat) ----
api.dat.list(type) / api.dat.read(type, name)
api.dat.write(type, name, content, binary)

// ---- 事件总线 (新增, 一等公民化) ----
api.events.on('scene.enter', fn)      // 进入场景
api.events.on('dialogue.line', fn)    // 每行对话
api.events.on('card.press', fn)       // RYGB 按键
api.events.on('context.change', fn)   // 上下文变化
api.events.on('save.written', fn)     // 存档落盘

// ---- 引擎钩子 (新增, WebView 版只能靠 eval 的那些) ----
api.scene.jump(id, {skip})            // 替代 ?jump= URL 参数
api.scene.speed(n)                    // 替代 clock.speed hack
api.cards.press('R'|'Y'|'G'|'B')      // 替代 __game.press
api.save.get() / api.save.put(s)      // 存档对象读写

// ---- 存储 ----
api.storage.get(k) / api.storage.set(k, v)   // 模组私有 KV, 引擎负责隔离
```

**沙箱规则**: 脚本模组跑在 QuickJS 里, 默认只能看到 `WHITE` 全局对象;
需要危险能力 (文件系统/网络) 时在 manifest 里声明, 用户首次批准后放行 (沿用白名单+免责协议落盘机制)。

```jsonc
// my-mod.json (模组清单, 新增)
{ "name": "my-mod", "abi": "^1.0", "permissions": ["fs:WHITE/MODS", "net:127.0.0.1"] }
```

---

## 2.5 API 大扩容: 14 组全家福 (v0.1 草案)

> 不止对齐 WebView 版的 5 组 — 原生引擎把"当年做不到的"全部开放。
> **范围红线**: scene/dialogue/content 仅只读观察, 剧情推动永远由原版逻辑负责。

| 组 | 能力 | 网页版状态 | 权限 |
|---|---|---|---|
| `console` | 日志 + 命令注册 | ✅ 对齐 | 无 |
| `ui` | 全定制按钮 + 设置面板 | ✅ 对齐 | 无 |
| `dat` | 存档/设置 .DAT 读写 | ✅ 对齐 | 无 |
| `events` ★ | 事件总线 (scene.enter/dialogue.line/card.press/context.change…) | 黑科技→一等公民 | 无 |
| `scene` ★ | jump/current/listChapters/speed | `?jump=` 逆向→官方化 | 无 |
| `dialogue` ★ | currentLine/history/skip (**只读**) | 摸不到→开放 | 无 |
| `render` ★ | overlay/贴图层/screenEffect/后端查询/**fps** | 不可能→开放 | `render` |
| `audio` ★ | sfx/bgm/音量 | 不可能→开放 | `audio` |
| `input` ★ | pressCard/手势监听/震动 | `__game.press` 逆向→官方化 | `haptic` |
| `save` ★ | schema 级 get/put/export | 逆向→官方化 | 无 |
| `net` ★ | 仅限 127.0.0.1 与 https (过渡期与 node 后端握手) | 无→开放 | `net` |
| `timer` ★ | setTimeout/setInterval | 无→开放 | 无 |
| `storage` ★ | 模组私有 KV (引擎级隔离) | localStorage 共享→隔离 | 无 |
| `modcom` ★ | 模组间服务注册与调用 | 无→开放 | 无 |

**全双工渲染**: `render.backend()` 返回当前后端 ("GLES" | "VULKAN") —
模组代码对后端无感, 两后端跑同一份模组; 引擎启动时能力检测自动选择, Vulkan 未就绪自动回落 GLES。

## 3. L1 Core ABI (原生模组, C ABI)

```c
// white_abi.h — 引擎导出的稳定 C 接口
WHITE_API uint32_t white_abi_version(void);
WHITE_API int32_t  white_register_hook(white_hook_t point, white_cb_t cb, void* user);

// 钩子点 (v1):
//   WHITE_HOOK_FRAME_BEGIN / END   每帧 (拿到 GL 上下文)
//   WHITE_HOOK_SCENE_ENTER/LEAVE
//   WHITE_HOOK_INPUT_CARD
//   WHITE_HOOK_SAVE_READ/WRITE
```

- `.so` 模组放 `WHITE/MODS/native/`, 引擎 `dlopen` 加载
- 钩子表冻结在 ABI 主版本内; 新钩子只增不改

---

## 4. L3 资源包 (内容扩展)

```
content-pack/
├── manifest.json      { id, version, engine: "^1.0", author, checksum }
├── chapters/          对话树 JSON (节点格式见 docs/ARCHITECTURE.md §4)
├── art/               程序化参数或贴图
└── audio/
```

引擎加载前校验 `manifest.checksum`; 内容包**不含代码**, 无法越权。

---

## 5. 兼容性矩阵 (WebView 版 → 原生版)

| WebView 版 API | 原生版对应 | 迁移成本 |
|---|---|---|
| `WHITE_API.console.*` | `api.console.*` | 零 (同名同义) |
| `WHITE_API.ui.createButton` | `api.ui.createButton` | 零 |
| `WHITE_API.dat.*` | `api.dat.*` | 零 |
| `WHITE_API.bash.exec` | 不迁移 (原生无 node 后端) | 改用 `api.events` + 原生能力 |
| `window.__game.press` (逆向) | `api.cards.press` (官方化) | 改一行 |
| `?jump=` URL 参数 (逆向) | `api.scene.jump` (官方化) | 改一行 |

> 逆向出来的黑科技在原生版全部**转正为一等 API** — 这就是重写引擎最大的红利。
