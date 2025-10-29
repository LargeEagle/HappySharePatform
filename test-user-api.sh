#!/bin/bash

# 測試用戶 API 路徑是否正確
# 這個腳本會驗證 API 路徑沒有重複的 /api/ 前綴

echo "=================================="
echo "🔍 測試用戶 API 路徑"
echo "=================================="
echo ""

BASE_URL="http://localhost:5000/api"
USER_ID="0c65432d-4320-4784-8b59-92e05c21b34e"

echo "📋 測試配置："
echo "  Base URL: $BASE_URL"
echo "  測試用戶 ID: $USER_ID"
echo ""

# 測試 1: 獲取用戶資料
echo "=================================="
echo "測試 1: 獲取用戶資料"
echo "=================================="
TEST_URL="$BASE_URL/users/$USER_ID"
echo "請求 URL: $TEST_URL"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$TEST_URL")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 測試成功！HTTP 狀態碼: $HTTP_CODE"
    echo ""
    echo "返回數據："
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo "❌ 測試失敗！HTTP 狀態碼: $HTTP_CODE"
    echo ""
    echo "錯誤信息："
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
fi

echo ""
echo ""

# 測試 2: 獲取用戶文章
echo "=================================="
echo "測試 2: 獲取用戶文章"
echo "=================================="
TEST_URL="$BASE_URL/users/$USER_ID/posts?page=1&limit=5"
echo "請求 URL: $TEST_URL"
echo ""

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$TEST_URL")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ 測試成功！HTTP 狀態碼: $HTTP_CODE"
    echo ""
    echo "返回數據："
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo "❌ 測試失敗！HTTP 狀態碼: $HTTP_CODE"
    echo ""
    echo "錯誤信息："
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
fi

echo ""
echo ""

# 測試 3: 檢查 URL 格式
echo "=================================="
echo "URL 格式檢查"
echo "=================================="

echo "✅ 正確格式: $BASE_URL/users/$USER_ID"
echo "❌ 錯誤格式: $BASE_URL/api/users/$USER_ID"
echo ""

if [[ "$BASE_URL" == *"/api/api/"* ]]; then
    echo "⚠️  警告：Base URL 包含重複的 /api/ 前綴！"
else
    echo "✅ Base URL 格式正確"
fi

echo ""
echo "=================================="
echo "🎯 測試完成"
echo "=================================="
echo ""
echo "如果所有測試都顯示 ✅，則後端 API 工作正常。"
echo "如果前端仍然顯示錯誤的 URL，請："
echo "1. 在瀏覽器中按 Ctrl+Shift+R 硬刷新"
echo "2. 清除瀏覽器緩存（Ctrl+Shift+Delete）"
echo "3. 確保前端服務已經重新編譯完成"
echo ""
