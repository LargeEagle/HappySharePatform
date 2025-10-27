# 後端 README

## 🚀 快速開始

### 前置要求
- Node.js 18+
- MongoDB 5.0+ (本地安裝) 或 MongoDB Atlas (雲端)

### 安裝步驟

#### 1. 安裝依賴
```bash
npm install
```

#### 2. 配置環境變數
複製 `.env` 文件並修改配置：
```bash
# .env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/social-media-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

#### 3. 啟動 MongoDB

**Windows (本地)**:
```bash
# MongoDB 通常作為服務自動運行
net start MongoDB

# 或手動啟動
mongod
```

**使用 MongoDB Atlas (推薦)**:
1. 訪問 https://www.mongodb.com/cloud/atlas
2. 創建免費集群
3. 獲取連接字符串
4. 更新 `.env` 中的 `MONGODB_URI`

#### 4. 啟動開發服務器

**Windows**:
```bash
start-dev.bat
```

**或使用 npm**:
```bash
npm run dev
```

服務器將運行在 http://localhost:5000

---

## 📁 項目結構

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB 連接配置
│   ├── controllers/
│   │   ├── authController.js    # 認證控制器
│   │   ├── userController.js    # 用戶控制器
│   │   ├── postController.js    # 文章控制器
│   │   └── commentController.js # 評論控制器
│   ├── middlewares/
│   │   ├── auth.js              # JWT 認證中間件
│   │   └── errorHandler.js      # 錯誤處理中間件
│   ├── models/
│   │   ├── User.js              # 用戶模型
│   │   ├── Post.js              # 文章模型
│   │   ├── Comment.js           # 評論模型
│   │   ├── Like.js              # 點讚模型
│   │   └── Bookmark.js          # 收藏模型
│   ├── routes/
│   │   ├── auth.js              # 認證路由
│   │   ├── users.js             # 用戶路由
│   │   ├── posts.js             # 文章路由
│   │   └── comments.js          # 評論路由
│   └── index.js                 # 應用入口
├── .env                         # 環境變數配置
├── package.json
├── start-dev.bat                # Windows 開發啟動腳本
└── API_TESTING.md               # API 測試文檔
```

---

## 🔌 API 端點

### 認證
- `POST /api/auth/register` - 註冊
- `POST /api/auth/login` - 登入
- `GET /api/auth/me` - 獲取當前用戶 (需認證)

### 用戶
- `GET /api/users/:id` - 獲取用戶資料
- `PUT /api/users/:id` - 更新用戶資料 (需認證)
- `GET /api/users/:id/posts` - 獲取用戶的文章
- `POST /api/users/avatar` - 上傳頭像 (需認證)

### 文章
- `GET /api/posts` - 獲取所有文章
- `GET /api/posts/:id` - 獲取單篇文章
- `POST /api/posts` - 創建文章 (需認證)
- `PUT /api/posts/:id` - 更新文章 (需認證)
- `DELETE /api/posts/:id` - 刪除文章 (需認證)
- `POST /api/posts/:id/like` - 點讚/取消點讚 (需認證)
- `POST /api/posts/:id/bookmark` - 收藏/取消收藏 (需認證)

### 評論
- `GET /api/comments/posts/:postId/comments` - 獲取文章的評論
- `POST /api/comments/posts/:postId/comments` - 創建評論 (需認證)
- `DELETE /api/comments/:id` - 刪除評論 (需認證)
- `POST /api/comments/:id/like` - 點讚/取消點讚評論 (需認證)

詳細 API 文檔請查看 [API_TESTING.md](./API_TESTING.md)

---

## 🧪 測試

### 使用 PowerShell 測試

```powershell
# 註冊
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
    name = "Test User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method Post -ContentType "application/json" -Body $body
```

---

## 📦 技術棧

- **Express.js 5** - Web 框架
- **MongoDB + Mongoose** - 數據庫
- **JWT** - 身份驗證
- **bcryptjs** - 密碼加密
- **CORS** - 跨域支持
- **Morgan** - HTTP 請求日誌

---

## 🔐 安全

- 密碼使用 bcrypt 加密存儲
- JWT Token 有效期為 7 天
- CORS 配置可在 `.env` 中自定義
- 敏感操作需要 Token 認證
- 用戶只能修改/刪除自己的內容

---

## 🐛 故障排除

### MongoDB 連接失敗
1. 確保 MongoDB 服務正在運行
2. 檢查 `.env` 中的 `MONGODB_URI` 是否正確
3. 如果使用 Atlas，確保 IP 白名單已配置

### Port 已被佔用
修改 `.env` 中的 `PORT` 為其他端口

### JWT 錯誤
確保 `.env` 中的 `JWT_SECRET` 已設置且足夠複雜

---

## 📝 開發計劃

- [x] 用戶認證系統
- [x] 文章 CRUD
- [x] 評論系統
- [x] 點讚功能
- [x] 收藏功能
- [ ] 文件上傳 (AWS S3)
- [ ] 用戶關注系統
- [ ] 即時通知
- [ ] 搜尋功能
- [ ] 數據分析
