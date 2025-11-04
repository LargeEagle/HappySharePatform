#!/bin/bash

echo "====== 搜索 API 整合測試 ======"
echo ""

BASE_URL="http://localhost:5000/api"

echo "1. 測試搜索建議 - TypeScript"
curl -s "${BASE_URL}/search/suggestions?q=typescript" | grep -o '"success":[^,]*' && echo ""

echo "2. 測試搜索建議 - alice (用戶)"
curl -s "${BASE_URL}/search/suggestions?q=alice" | grep -o '"type":"user"' && echo ""

echo "3. 測試搜索建議 - 音樂 (標籤)"
curl -s "${BASE_URL}/search/suggestions?q=音樂" | grep -o '"type":"tag"' && echo ""

echo "4. 測試完整搜索 - TypeScript"
curl -s "${BASE_URL}/search?q=typescript&type=posts" | grep -o '"success":[^,]*' && echo ""

echo "5. 測試完整搜索 - alice"
curl -s "${BASE_URL}/search?q=alice&type=users" | grep -o '"success":[^,]*' && echo ""

echo ""
echo "✅ 所有搜索 API 測試完成！"
