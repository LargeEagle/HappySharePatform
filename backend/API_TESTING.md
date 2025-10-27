# 後端 API 測試指南

## 📋 前置要求

### 1. 安裝 MongoDB
- **Windows**: 從 [MongoDB 官網](https://www.mongodb.com/try/download/community) 下載安裝
- **或使用 MongoDB Atlas** (雲端數據庫): https://www.mongodb.com/cloud/atlas

### 2. 啟動 MongoDB (本地)
```bash
# Windows - MongoDB 安裝後通常作為服務自動運行
# 檢查服務狀態
net start MongoDB

# 或手動啟動 (如果未作為服務運行)
mongod
```

### 3. 啟動後端服務器
```bash
cd backend
npm run dev
```

---

## 🧪 API 測試

### 基礎端點
```bash
GET http://localhost:5000/
```
**返回**: API 歡迎信息和端點列表

---

## 認證 API

### 1. 註冊用戶
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**成功返回**:
```json
{
  "success": true,
  "message": "註冊成功",
  "data": {
    "user": {
      "id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "name": "Test User",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. 登入
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. 獲取當前用戶信息
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer <your-token>
```

---

## 文章 API

### 1. 獲取所有文章
```http
GET http://localhost:5000/api/posts?page=1&limit=10
```

### 2. 獲取單篇文章
```http
GET http://localhost:5000/api/posts/:postId
```

### 3. 創建文章
```http
POST http://localhost:5000/api/posts
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "title": "我的第一篇文章",
  "content": "這是文章內容...",
  "image": "https://example.com/image.jpg"
}
```

### 4. 更新文章
```http
PUT http://localhost:5000/api/posts/:postId
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "title": "更新的標題",
  "content": "更新的內容"
}
```

### 5. 刪除文章
```http
DELETE http://localhost:5000/api/posts/:postId
Authorization: Bearer <your-token>
```

### 6. 點讚文章
```http
POST http://localhost:5000/api/posts/:postId/like
Authorization: Bearer <your-token>
```

### 7. 收藏文章
```http
POST http://localhost:5000/api/posts/:postId/bookmark
Authorization: Bearer <your-token>
```

---

## 評論 API

### 1. 獲取文章的評論
```http
GET http://localhost:5000/api/comments/posts/:postId/comments
```

### 2. 創建評論
```http
POST http://localhost:5000/api/comments/posts/:postId/comments
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "content": "這是一個評論"
}
```

### 3. 刪除評論
```http
DELETE http://localhost:5000/api/comments/:commentId
Authorization: Bearer <your-token>
```

### 4. 點讚評論
```http
POST http://localhost:5000/api/comments/:commentId/like
Authorization: Bearer <your-token>
```

---

## 用戶 API

### 1. 獲取用戶資料
```http
GET http://localhost:5000/api/users/:userId
```

### 2. 更新用戶資料
```http
PUT http://localhost:5000/api/users/:userId
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "新名字",
  "bio": "我的個人簡介",
  "avatar": "https://example.com/avatar.jpg"
}
```

### 3. 獲取用戶的文章
```http
GET http://localhost:5000/api/users/:userId/posts
```

### 4. 上傳頭像
```http
POST http://localhost:5000/api/users/avatar
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "avatarUrl": "https://i.pravatar.cc/150?img=5"
}
```

---

## 使用 cURL 測試範例

### 註冊
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\",\"name\":\"Test User\"}"
```

### 登入並保存 Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### 創建文章 (需要替換 TOKEN)
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"測試文章\",\"content\":\"這是測試內容\"}"
```

---

## 使用 PowerShell 測試

### 註冊
```powershell
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### 登入
```powershell
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

$token = $response.data.token
Write-Host "Token: $token"
```

### 創建文章
```powershell
$postBody = @{
    title = "我的測試文章"
    content = "這是一篇測試文章的內容"
    image = "https://picsum.photos/800/600"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/posts" `
    -Method Post `
    -Headers $headers `
    -Body $postBody
```

---

## 錯誤碼說明

| 狀態碼 | 說明 |
|--------|------|
| 200 | 成功 |
| 201 | 創建成功 |
| 400 | 請求參數錯誤 |
| 401 | 未認證或 Token 無效 |
| 403 | 無權限 |
| 404 | 資源不存在 |
| 500 | 服務器錯誤 |

---

## 資料庫結構

### User (用戶)
- username: String (唯一)
- email: String (唯一)
- password: String (加密)
- name: String
- bio: String
- avatar: String
- postsCount: Number
- followersCount: Number
- followingCount: Number

### Post (文章)
- title: String
- content: String
- author: ObjectId (ref: User)
- image: String
- likesCount: Number
- commentsCount: Number
- bookmarksCount: Number

### Comment (評論)
- content: String
- author: ObjectId (ref: User)
- post: ObjectId (ref: Post)
- likesCount: Number

### Like (點讚)
- user: ObjectId (ref: User)
- targetType: String ('Post' | 'Comment')
- targetId: ObjectId

### Bookmark (收藏)
- user: ObjectId (ref: User)
- post: ObjectId (ref: Post)
