# HAPPY SHARE Backend API

## 🚀 技術棧

- **框架**: NestJS (TypeScript)
- **ORM**: Prisma
- **數據庫**: PostgreSQL
- **認證**: JWT + bcryptjs
- **API風格**: RESTful

## 📦 安裝

```bash
npm install
```

## ⚙️ 環境配置

創建 `.env` 文件：

```env
NODE_ENV=development
PORT=5000

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# PostgreSQL 數據庫
DATABASE_URL="postgresql://user:password@localhost:5432/social_media?schema=public"
```

## 🗄️ 數據庫設置

### 使用 Supabase (推薦)

1. 前往 [Supabase](https://supabase.com/) 創建免費帳戶
2. 創建新項目
3. 獲取連接字符串並更新 `.env`
4. 運行遷移：

```bash
npx prisma migrate dev
```

### 使用本地 PostgreSQL

1. 安裝 PostgreSQL
2. 創建數據庫：

```bash
createdb social_media
```

3. 更新 `.env` 中的 `DATABASE_URL`
4. 運行遷移：

```bash
npx prisma migrate dev
```

## 🏃 運行應用

### 開發模式

```bash
npm run start:dev
```

### 生產模式

```bash
npm run build
npm run start:prod
```

## 📡 API 端點

### 認證 API (`/api/auth`)

- `POST /auth/register` - 用戶註冊
- `POST /auth/login` - 用戶登入
- `GET /auth/me` - 獲取當前用戶 (需認證)

### 用戶 API (`/api/users`)

- `GET /users/:id` - 獲取用戶資料
- `PUT /users/:id` - 更新用戶資料 (需認證)
- `GET /users/:id/posts` - 獲取用戶的文章
- `POST /users/avatar` - 上傳頭像 (需認證)

### 文章 API (`/api/posts`)

- `GET /posts` - 獲取所有文章 (支持分頁)
- `GET /posts/:id` - 獲取單篇文章
- `POST /posts` - 創建文章 (需認證)
- `PUT /posts/:id` - 更新文章 (需認證)
- `DELETE /posts/:id` - 刪除文章 (需認證)
- `POST /posts/:id/like` - 切換點讚 (需認證)
- `POST /posts/:id/bookmark` - 切換收藏 (需認證)

### 評論 API (`/api/comments`)

- `GET /comments/posts/:postId/comments` - 獲取文章評論
- `POST /comments/posts/:postId/comments` - 創建評論 (需認證)
- `DELETE /comments/:id` - 刪除評論 (需認證)
- `POST /comments/:id/like` - 切換評論點讚 (需認證)

## 🗃️ 數據庫模型

- **User** - 用戶信息
- **Post** - 文章內容
- **Comment** - 評論
- **Like** - 點讚 (支持文章和評論)
- **Bookmark** - 收藏

## 🔐 認證

所有需要認證的端點需要在 Header 中包含:

```
Authorization: Bearer <token>
```

## 📝 API 響應格式

### 成功響應

```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    // 實際數據
  }
}
```

### 錯誤響應

```json
{
  "success": false,
  "message": "錯誤訊息",
  "statusCode": 400
}
```

## 🛠️ 開發工具

### Prisma Studio

打開數據庫可視化管理工具：

```bash
npx prisma studio
```

### 重新生成 Prisma Client

```bash
npx prisma generate
```

### 創建數據庫遷移

```bash
npx prisma migrate dev --name migration_name
```

## 📁 項目結構

```
backend/
├── prisma/
│   └── schema.prisma      # Prisma 數據庫模型
├── src/
│   ├── auth/              # 認證模塊
│   ├── users/             # 用戶模塊
│   ├── posts/             # 文章模塊
│   ├── comments/          # 評論模塊
│   ├── prisma/            # Prisma 服務
│   ├── app.module.ts      # 根模塊
│   └── main.ts            # 應用入口
├── .env                   # 環境變數
├── nest-cli.json          # NestJS 配置
├── package.json           # 依賴管理
└── tsconfig.json          # TypeScript 配置
```

## 🚀 部署

### 環境變數

確保在生產環境設置以下變數：

- `DATABASE_URL` - PostgreSQL連接字符串
- `JWT_SECRET` - 安全的JWT密鑰
- `NODE_ENV=production`
- `PORT` - 服務器端口

### 構建

```bash
npm run build
npm run start:prod
```

## 📄 授權

ISC

## 👥 作者

HAPPY SHARE Team
