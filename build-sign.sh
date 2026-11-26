#!/bin/bash
# WHITE Native Engine 统一签名构建脚本 (T86-B 起)
# 约定: 所有版本 (A/B/正式) 都用 release.keystore / white-native 签名, 保证覆盖安装不冲突
# 用法: ./build-sign.sh [版本名 如 4.9.3-native-B]
set -e
cd "$(dirname "$0")"
VER="${1:-$(grep -o 'versionName "[^"]*"' app/build.gradle | cut -d'"' -f2)}"
KS=release.keystore
STORE_PASS=white-native-2026
BT=/opt/android-sdk/build-tools/34.0.0
export PATH="$BT:$PATH"

echo "── 编译 (versionName=$VER)"
gradle assembleRelease >/dev/null

OUT=app/build/outputs/apk/release/app-release-unsigned.apk
WORK=/tmp/white-sign-$$
cp "$OUT" "$WORK-unsigned.apk"

echo "── zipalign + apksigner (统一签名: release.keystore/white-native)"
zipalign -f -p 4 "$WORK-unsigned.apk" "$WORK-aligned.apk"
apksigner sign --ks "$KS" --ks-key-alias white-native \
  --ks-pass "pass:$STORE_PASS" --key-pass "pass:$STORE_PASS" \
  --out "/workspace/WHITE-$VER.apk" "$WORK-aligned.apk"
apksigner verify --print-certs "/workspace/WHITE-$VER.apk" | head -3
rm -f "$WORK-unsigned.apk" "$WORK-aligned.apk"
echo "── 完成: /workspace/WHITE-$VER.apk"
