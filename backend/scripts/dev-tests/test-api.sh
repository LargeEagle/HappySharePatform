#!/bin/bash

echo "🧪 測試 HAPPY SHARE API"
echo "========================"
echo ""

BASE_URL="http://localhost:5000/api"

# 測試根端點
echo "1️⃣ 測試根端點 GET /api"
curl -s $BASE_URL | jq .
echo ""
echo ""

# 註冊新用戶
echo "2️⃣ 註冊新用戶 POST /api/auth/register"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123456",
    "displayName": "Test User"
  }')
echo $REGISTER_RESPONSE | jq .
ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.access_token')
USER_ID=$(echo $REGISTER_RESPONSE | jq -r '.user.id')
echo ""
echo "✅ Token: $ACCESS_TOKEN"
echo "✅ User ID: $USER_ID"
echo ""
echo ""

# 登入
echo "3️⃣ 用戶登入 POST /api/auth/login"
curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }' | jq .
echo ""
echo ""

# 獲取當前用戶信息
echo "4️⃣ 獲取當前用戶 GET /api/auth/me"
curl -s -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""
echo ""

# 創建文章
echo "5️⃣ 創建文章 POST /api/posts"
POST_RESPONSE=$(curl -s -X POST $BASE_URL/posts \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "我的第一篇文章",
    "content": "這是一篇測試文章的內容。",
    "isPublished": true
  }')
echo $POST_RESPONSE | jq .
POST_ID=$(echo $POST_RESPONSE | jq -r '.id')
echo ""
echo "✅ Post ID: $POST_ID"
echo ""
echo ""

# 獲取所有文章
echo "6️⃣ 獲取所有文章 GET /api/posts"
curl -s -X GET "$BASE_URL/posts?page=1&limit=10" | jq .
echo ""
echo ""

# 獲取單個文章
echo "7️⃣ 獲取單個文章 GET /api/posts/:id"
curl -s -X GET $BASE_URL/posts/$POST_ID | jq .
echo ""
echo ""

# 點讚文章
echo "8️⃣ 點讚文章 POST /api/posts/:id/like"
curl -s -X POST $BASE_URL/posts/$POST_ID/like \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""
echo ""

# 收藏文章
echo "9️⃣ 收藏文章 POST /api/posts/:id/bookmark"
curl -s -X POST $BASE_URL/posts/$POST_ID/bookmark \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""
echo ""

# 創建評論
echo "🔟 創建評論 POST /api/comments/posts/:postId/comments"
COMMENT_RESPONSE=$(curl -s -X POST $BASE_URL/comments/posts/$POST_ID/comments \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "這是一條測試評論！"
  }')
echo $COMMENT_RESPONSE | jq .
COMMENT_ID=$(echo $COMMENT_RESPONSE | jq -r '.id')
echo ""
echo "✅ Comment ID: $COMMENT_ID"
echo ""
echo ""

# 獲取文章評論
echo "1️⃣1️⃣ 獲取文章評論 GET /api/comments/posts/:postId/comments"
curl -s -X GET $BASE_URL/comments/posts/$POST_ID/comments | jq .
echo ""
echo ""

# 點讚評論
echo "1️⃣2️⃣ 點讚評論 POST /api/comments/:id/like"
curl -s -X POST $BASE_URL/comments/$COMMENT_ID/like \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""
echo ""

# 獲取用戶信息
echo "1️⃣3️⃣ 獲取用戶信息 GET /api/users/:id"
curl -s -X GET $BASE_URL/users/$USER_ID | jq .
echo ""
echo ""

# 獲取用戶的文章
echo "1️⃣4️⃣ 獲取用戶文章 GET /api/users/:id/posts"
curl -s -X GET $BASE_URL/users/$USER_ID/posts | jq .
echo ""
echo ""

echo "✅ 所有測試完成！"
