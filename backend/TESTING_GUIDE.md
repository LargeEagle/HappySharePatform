# HAPPY SHARE Backend - 快速測試命令

## 📋 可用的 npm 命令

### 🚀 啟動服務

```bash
# 開發模式（自動重載）
npm run start:dev

# 生產模式
npm run start:prod

# 調試模式
npm run start:debug
```

### 🧪 API 測試命令

```bash
# 測試 API 健康狀態
npm run test:api
# 輸出: Welcome to HAPPY SHARE API!

# 測試登錄功能
npm run test:login
# 使用測試帳號 alice@happyshare.com 登錄

# 測試註冊功能
npm run test:register
# 註冊新用戶 test@example.com

# 測試獲取貼文列表
npm run test:posts
# 獲取所有公開貼文
```

### 🗃️ 數據庫管理

```bash
# 執行數據庫遷移
npm run prisma:migrate

# 填充測試數據
npm run db:seed

# 重置數據庫並重新填充
npm run db:reset

# 打開 Prisma Studio（數據庫可視化工具）
npm run prisma:studio

# 生成 Prisma Client
npm run prisma:generate
```

### 🧹 代碼質量

```bash
# 運行 ESLint
npm run lint

# 格式化代碼
npm run format

# 運行單元測試
npm test

# 運行測試（監聽模式）
npm run test:watch

# 生成測試覆蓋率報告
npm run test:cov
```

## 📊 測試帳號

所有測試帳號密碼: **Test@1234**

| 郵箱 | 用戶名 | 說明 |
|------|--------|------|
| alice@happyshare.com | alice | 測試用戶 1 |
| bob@happyshare.com | bob | 測試用戶 2 |
| carol@happyshare.com | carol | 測試用戶 3 |
| david@happyshare.com | david | 測試用戶 4 |
| emma@happyshare.com | emma | 測試用戶 5 |

## 🔍 快速測試示例

### 1. 完整的登錄流程測試

```bash
# 1. 啟動後端
npm run start:dev

# 2. 在另一個終端測試健康狀態
npm run test:api

# 3. 測試登錄
npm run test:login

# 4. 測試獲取貼文
npm run test:posts
```

### 2. 使用 curl 進行自定義測試

```bash
# 登錄並保存 token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@happyshare.com","password":"Test@1234"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 使用 token 訪問受保護的端點
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/auth/me

# 創建新貼文
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"這是一篇測試貼文！"}'
```

### 3. 數據庫重置（開發環境）

```bash
# 警告：這會刪除所有數據！
npm run db:reset
```

## 🌐 API 端點

服務器運行在: `http://localhost:5000/api`

### 認證端點
- `POST /api/auth/register` - 註冊新用戶
- `POST /api/auth/login` - 用戶登錄
- `GET /api/auth/me` - 獲取當前用戶信息（需要認證）

### 用戶端點
- `GET /api/users/:id` - 獲取用戶資料
- `PUT /api/users/:id` - 更新用戶資料（需要認證）
- `GET /api/users/:id/posts` - 獲取用戶的貼文
- `POST /api/users/avatar` - 上傳頭像（需要認證）

### 貼文端點
- `GET /api/posts` - 獲取貼文列表
- `POST /api/posts` - 創建貼文（需要認證）
- `GET /api/posts/:id` - 獲取單個貼文
- `PUT /api/posts/:id` - 更新貼文（需要認證）
- `DELETE /api/posts/:id` - 刪除貼文（需要認證）
- `POST /api/posts/:id/like` - 點讚/取消點讚（需要認證）
- `POST /api/posts/:id/bookmark` - 收藏/取消收藏（需要認證）

### 評論端點
- `GET /api/comments/posts/:postId/comments` - 獲取貼文的評論
- `POST /api/comments/posts/:postId/comments` - 創建評論（需要認證）
- `DELETE /api/comments/:id` - 刪除評論（需要認證）
- `POST /api/comments/:id/like` - 點讚評論（需要認證）

## 🐛 故障排除

### 端口已被占用
```bash
# 查找占用端口的進程
lsof -ti:5000

# 強制關閉
lsof -ti:5000 | xargs kill -9
```

### 數據庫連接問題
```bash
# 檢查 .env 文件是否存在
cat .env

# 測試數據庫連接
npm run prisma:studio
```

### 依賴問題
```bash
# 清除 node_modules 並重新安裝
rm -rf node_modules package-lock.json
npm install
```

## 📚 更多文檔

- [完整 API 文檔](./API_TESTING.md)
- [數據庫設置指南](./MONGODB_SETUP.md)
- [項目開發文檔](../docs/開發文件.md)
