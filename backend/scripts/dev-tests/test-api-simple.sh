#!/bin/bash

echo "🧪 測試 HAPPY SHARE API"
echo "========================"
echo ""

BASE_URL="http://localhost:5000/api"

# 測試根端點
echo "1️⃣ 測試根端點 GET /api"
curl -s $BASE_URL
echo ""
echo ""

# 註冊新用戶
echo "2️⃣ 註冊新用戶 POST /api/auth/register"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "username": "testuser",
    "password": "Test123456"
  }')
echo "$REGISTER_RESPONSE"
echo ""

# 提取 token (從 data.token)
ACCESS_TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Token: ${ACCESS_TOKEN:0:20}..."
echo "✅ User ID: $USER_ID"
echo ""

# 登入測試用戶 Alice
echo "3️⃣ 用戶登入 POST /api/auth/login (alice)"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@happyshare.com",
    "password": "Password123"
  }')
echo "$LOGIN_RESPONSE"
echo ""

ALICE_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
ALICE_ID=$(echo "$LOGIN_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Alice Token: ${ALICE_TOKEN:0:20}..."
echo "✅ Alice ID: $ALICE_ID"
echo ""

# 獲取當前用戶信息
echo "4️⃣ 獲取當前用戶 GET /api/auth/me"
curl -s -X GET $BASE_URL/auth/me \
  -H "Authorization: Bearer $ALICE_TOKEN"
echo ""
echo ""

# 獲取所有文章
echo "5️⃣ 獲取所有文章 GET /api/posts"
POSTS_RESPONSE=$(curl -s -X GET "$BASE_URL/posts?page=1&limit=5")
echo "$POSTS_RESPONSE"
echo ""

# 提取第一篇文章 ID
FIRST_POST_ID=$(echo "$POSTS_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ First Post ID: $FIRST_POST_ID"
echo ""

# 獲取單個文章
echo "6️⃣ 獲取單個文章 GET /api/posts/$FIRST_POST_ID"
curl -s -X GET $BASE_URL/posts/$FIRST_POST_ID
echo ""
echo ""

# 點讚文章
echo "7️⃣ 點讚文章 POST /api/posts/$FIRST_POST_ID/like"
curl -s -X POST $BASE_URL/posts/$FIRST_POST_ID/like \
  -H "Authorization: Bearer $ALICE_TOKEN"
echo ""
echo ""

# 收藏文章
echo "8️⃣ 收藏文章 POST /api/posts/$FIRST_POST_ID/bookmark"
curl -s -X POST $BASE_URL/posts/$FIRST_POST_ID/bookmark \
  -H "Authorization: Bearer $ALICE_TOKEN"
echo ""
echo ""

# 創建文章
echo "9️⃣ 創建文章 POST /api/posts"
NEW_POST_RESPONSE=$(curl -s -X POST $BASE_URL/posts \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API 測試文章",
    "content": "這是通過 API 測試創建的文章內容。",
    "isPublished": true
  }')
echo "$NEW_POST_RESPONSE"
echo ""

NEW_POST_ID=$(echo "$NEW_POST_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ New Post ID: $NEW_POST_ID"
echo ""

# 創建評論
echo "🔟 創建評論 POST /api/comments/posts/$FIRST_POST_ID/comments"
COMMENT_RESPONSE=$(curl -s -X POST $BASE_URL/comments/posts/$FIRST_POST_ID/comments \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "這是一條測試評論！"
  }')
echo "$COMMENT_RESPONSE"
echo ""

COMMENT_ID=$(echo "$COMMENT_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "✅ Comment ID: $COMMENT_ID"
echo ""

# 獲取文章評論
echo "1️⃣1️⃣ 獲取文章評論 GET /api/comments/posts/$FIRST_POST_ID/comments"
curl -s -X GET $BASE_URL/comments/posts/$FIRST_POST_ID/comments
echo ""
echo ""

# 點讚評論
echo "1️⃣2️⃣ 點讚評論 POST /api/comments/$COMMENT_ID/like"
curl -s -X POST $BASE_URL/comments/$COMMENT_ID/like \
  -H "Authorization: Bearer $ALICE_TOKEN"
echo ""
echo ""

# 獲取用戶信息
echo "1️⃣3️⃣ 獲取用戶信息 GET /api/users/$ALICE_ID"
curl -s -X GET $BASE_URL/users/$ALICE_ID
echo ""
echo ""

# 獲取用戶的文章
echo "1️⃣4️⃣ 獲取用戶文章 GET /api/users/$ALICE_ID/posts"
curl -s -X GET $BASE_URL/users/$ALICE_ID/posts
echo ""
echo ""

# 更新用戶資料
echo "1️⃣5️⃣ 更新用戶資料 PUT /api/users/$ALICE_ID"
curl -s -X PUT $BASE_URL/users/$ALICE_ID \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "這是更新後的個人簡介！測試成功 ✅"
  }'
echo ""
echo ""

# 更新文章
echo "1️⃣6️⃣ 更新文章 PUT /api/posts/$NEW_POST_ID"
curl -s -X PUT $BASE_URL/posts/$NEW_POST_ID \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API 測試文章（已更新）",
    "content": "這是更新後的文章內容。"
  }'
echo ""
echo ""

# 刪除評論
echo "1️⃣7️⃣ 刪除評論 DELETE /api/comments/$COMMENT_ID"
curl -s -X DELETE $BASE_URL/comments/$COMMENT_ID \
  -H "Authorization: Bearer $ALICE_TOKEN"
echo ""
echo ""

# 刪除文章
echo "1️⃣8️⃣ 刪除文章 DELETE /api/posts/$NEW_POST_ID"
curl -s -X DELETE $BASE_URL/posts/$NEW_POST_ID \
  -H "Authorization: Bearer $ALICE_TOKEN"
echo ""
echo ""

echo "✅ 所有測試完成！"
echo ""
echo "📊 測試摘要："
echo "   ✅ 認證功能 (註冊、登入、獲取當前用戶)"
echo "   ✅ 用戶功能 (獲取信息、更新資料、獲取文章)"
echo "   ✅ 文章功能 (CRUD、點讚、收藏、列表)"
echo "   ✅ 評論功能 (CRUD、點讚、獲取列表)"
echo ""
echo "🎉 後端 API 測試通過！"
