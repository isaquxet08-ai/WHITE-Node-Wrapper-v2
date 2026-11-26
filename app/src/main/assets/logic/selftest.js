// WHITE Native — LogicHost 自检 v2 (M2 第二阶段: 渲染桥/输入泵/存档桥 屏上演示)
// 弹跳黄方块 = 逻辑层驱动渲染指令; 点屏幕 = cardPress 四色卡循环闪
__engine.log('info', 'JS 运行时已就绪 (QuickJS LogicHost)');
__engine.log('info', '屏幕: ' + __engine.screenWidth() + 'x' + __engine.screenHeight() + ' | 场景: ' + __engine.currentScene());
__engine.log('info', '存档目录: [' + __engine.saveList() + ']');

var W = __engine.screenWidth(), H = __engine.screenHeight();
var x = W * 0.35, y = H * 0.2, dx = W * 0.006, dy = H * 0.003, S = 120;
var cards = ['R', 'Y', 'G', 'B'], cardIdx = 0, frames = 0;

function __tick(dt) {
    frames++;
    x += dx; y += dy;
    if (x < 0 || x + S > W) dx = -dx;
    if (y < 0 || y + S > H) dy = -dy;
    __engine.drawQuad(x, y, S, S, 0.95, 0.85, 0.25, 0.9);   // 弹跳黄方块
    if (frames === 1) __engine.log('success', '渲染桥已接通: 方块由逻辑层每帧发出 drawQuad');
    else if (frames % 300 === 0) __engine.log('info', '逻辑帧 x' + frames + ' (渲染指令流正常)');
}

function __onTouch(type, tx, ty) {
    if (type !== 'down') return;
    var c = cards[cardIdx++ % 4];
    __engine.cardPress(c);                                    // 行为契约: RYGB 卡 → 清屏色闪一下
    __engine.vibrate(30);
    __engine.log('info', '触摸(' + tx.toFixed(0) + ',' + ty.toFixed(0) + ') → cardPress(' + c + ')');
    __engine.saveWrite('_selftest_taps.txt', '点击次数: ' + cardIdx);   // 存档桥演示
}
__engine.emit('ready', 'selftest-v2');
__engine.log('success', 'logic.ready 已广播 — 触屏试试, 会闪四色卡');
