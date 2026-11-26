/* WHITE Native Engine — 示例模组 (L2 Script API, ABI ^1.0) */
WHITE.registerMod({
    name: 'hello-native',
    version: '1.0.0',
    author: 'WHITE Workshop',
    desc: '验证 Mod ABI: 按钮 + 事件监听',
    abi: '^1.0',

    onInit: function (api) {
        api.console.log('[hello-native] 原生引擎模组已加载 ✔', 'success');

        // 与 WebView 版完全同款的 UI 按钮 API
        api.ui.createButton('hello-btn', {
            text: '你好原生', color: '#6a3cd4', x: 40, y: 200,
            width: 120, height: 48, draggable: true,
            onClick: function () { api.console.log('原生引擎按钮点击!', 'success'); }
        });

        // 新增的一等事件钩子
        api.events.on('card.press', function (c) {
            api.console.log('捕获按键: ' + c, 'info');
        });
    }
});
