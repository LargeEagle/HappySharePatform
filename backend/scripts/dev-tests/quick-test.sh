#!/bin/bash
# 快速測試搜尋 API

echo "測試 1: 熱門標籤"
curl -s "http://localhost:5000/api/tags/popular" && echo "" && echo "✅ 成功" || echo "❌ 失敗"
echo ""

echo "測試 2: 搜尋文章"
curl -s "http://localhost:5000/api/search/posts?q=分享" && echo "" && echo "✅ 成功" || echo "❌ 失敗"
echo ""

echo "測試 3: 搜尋建議"
curl -s "http://localhost:5000/api/search/suggestions?q=美" && echo "" && echo "✅ 成功" || echo "❌ 失敗"
