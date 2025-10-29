# 後端技術棧遷移計劃

## 📋 遷移概述

**決策日期**: 2025-10-28  
**執行狀態**: ⏸️ 待執行  
**預計時間**: 2-3 小時

### 遷移方案

✅ **選擇方案**: 重新建立新的 NestJS 後端  
❌ **放棄方案**: 遷移現有 Express 代碼

---

## 🎯 遷移目標

### 從
- **框架**: Express.js 5
- **ORM**: Mongoose
- **數據庫**: MongoDB (NoSQL)
- **架構**: 函數式、輕量級

### 到
- **框架**: NestJS (TypeScript)
- **ORM**: Prisma
- **數據庫**: PostgreSQL
- **架構**: 模塊化、依賴注入、企業級

---

## 📊 遷移理由

### 技術優勢
1. **NestJS**
   - 🏗️ 模塊化架構（更易維護）
   - 🔧 內建依賴注入（IoC 容器）
   - 🧪 完善的測試支持
   - 📚 豐富的生態系統
   - 🎨 裝飾器語法（更簡潔）

2. **Prisma**
   - 🔒 類型安全的數據庫訪問
   - 🚀 自動生成 TypeScript 類型
   - 🔄 數據庫遷移管理
   - 📊 強大的查詢構建器
   - 🎯 優秀的開發體驗

3. **PostgreSQL**
   - 🔗 強大的關聯查詢
   - 📈 更好的性能（對於複雜查詢）
   - 🔐 ACID 事務支持
   - 📊 豐富的數據類型
   - 🌍 成熟的生態系統

### 為什麼重建而不是遷移？

✅ **重建優勢**
- 乾淨的項目結構
- 學習 NestJS 最佳實踐
- 避免技術債務
- 更快（估計時間更短）
- 業務邏輯清晰可參考

❌ **遷移缺點**
- 需要大量重構
- Express → NestJS 架構差異巨大
- Mongoose → Prisma API 完全不同
- MongoDB → PostgreSQL 數據結構需重新設計
- 容易產生混合架構問題

---

## 📝 執行計劃

### 階段 1: 準備工作 (30 分鐘)

#### 1.1 保留現有代碼
```bash
# 將現有 backend 改名為參考
mv backend backend-express-reference
```

#### 1.2 安裝工具
```bash
# 確保有 NestJS CLI
npm install -g @nestjs/cli

# 確保有 PostgreSQL (選擇一種)
# 選項 A: 本地安裝 PostgreSQL
# 選項 B: 使用 Docker
# 選項 C: 使用 Supabase (推薦)
```

#### 1.3 創建 NestJS 項目
```bash
cd social-media-platform
nest new backend
# 選擇 npm 作為包管理器
```

---

### 階段 2: 配置 Prisma (30 分鐘)

#### 2.1 安裝 Prisma
```bash
cd backend
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

#### 2.2 設計 Prisma Schema

**文件**: `prisma/schema.prisma`

需要轉換以下 MongoDB 模型到 PostgreSQL:

1. **User** 模型
   ```prisma
   model User {
     id              String    @id @default(uuid())
     username        String    @unique
     email           String    @unique
     password        String
     name            String?
     bio             String?   @db.Text
     avatar          String?
     postsCount      Int       @default(0)
     followersCount  Int       @default(0)
     followingCount  Int       @default(0)
     createdAt       DateTime  @default(now())
     updatedAt       DateTime  @updatedAt
     
     posts           Post[]
     comments        Comment[]
     likes           Like[]
     bookmarks       Bookmark[]
   }
   ```

2. **Post** 模型
   ```prisma
   model Post {
     id              String    @id @default(uuid())
     title           String
     content         String    @db.Text
     image           String?
     likesCount      Int       @default(0)
     commentsCount   Int       @default(0)
     bookmarksCount  Int       @default(0)
     authorId        String
     author          User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
     createdAt       DateTime  @default(now())
     updatedAt       DateTime  @updatedAt
     
     comments        Comment[]
     likes           Like[]
     bookmarks       Bookmark[]
     
     @@index([authorId])
     @@index([createdAt])
   }
   ```

3. **Comment** 模型
   ```prisma
   model Comment {
     id         String   @id @default(uuid())
     content    String   @db.Text
     likesCount Int      @default(0)
     authorId   String
     author     User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
     postId     String
     post       Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
     createdAt  DateTime @default(now())
     updatedAt  DateTime @updatedAt
     
     likes      Like[]
     
     @@index([postId])
     @@index([authorId])
   }
   ```

4. **Like** 模型
   ```prisma
   model Like {
     id         String   @id @default(uuid())
     userId     String
     user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
     postId     String?
     post       Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
     commentId  String?
     comment    Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)
     createdAt  DateTime @default(now())
     
     @@unique([userId, postId])
     @@unique([userId, commentId])
     @@index([postId])
     @@index([commentId])
   }
   ```

5. **Bookmark** 模型
   ```prisma
   model Bookmark {
     id        String   @id @default(uuid())
     userId    String
     user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
     postId    String
     post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
     createdAt DateTime @default(now())
     
     @@unique([userId, postId])
     @@index([userId])
   }
   ```

#### 2.3 配置數據庫連接

**文件**: `.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/social_media?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5000
```

#### 2.4 生成 Prisma Client
```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

### 階段 3: 實現 NestJS 模塊 (60 分鐘)

#### 3.1 創建核心模塊

```bash
# Prisma 服務
nest g module prisma
nest g service prisma

# 認證模塊
nest g module auth
nest g controller auth
nest g service auth

# 用戶模塊
nest g module users
nest g controller users
nest g service users

# 文章模塊
nest g module posts
nest g controller posts
nest g service posts

# 評論模塊
nest g module comments
nest g controller comments
nest g service comments
```

#### 3.2 需要實現的功能

**Auth Module** (`src/auth/`)
- ✅ `POST /api/auth/register` - 註冊
- ✅ `POST /api/auth/login` - 登入
- ✅ `GET /api/auth/me` - 當前用戶
- ✅ JWT Guard 認證守衛

**Users Module** (`src/users/`)
- ✅ `GET /api/users/:id` - 獲取用戶
- ✅ `PUT /api/users/:id` - 更新用戶
- ✅ `GET /api/users/:id/posts` - 用戶文章
- ✅ `POST /api/users/avatar` - 上傳頭像

**Posts Module** (`src/posts/`)
- ✅ `GET /api/posts` - 文章列表（分頁）
- ✅ `GET /api/posts/:id` - 單篇文章
- ✅ `POST /api/posts` - 創建文章
- ✅ `PUT /api/posts/:id` - 更新文章
- ✅ `DELETE /api/posts/:id` - 刪除文章
- ✅ `POST /api/posts/:id/like` - 點讚
- ✅ `POST /api/posts/:id/bookmark` - 收藏

**Comments Module** (`src/comments/`)
- ✅ `GET /api/comments/posts/:postId/comments` - 獲取評論
- ✅ `POST /api/comments/posts/:postId/comments` - 創建評論
- ✅ `DELETE /api/comments/:id` - 刪除評論
- ✅ `POST /api/comments/:id/like` - 點讚評論

---

### 階段 4: 實現認證和安全 (30 分鐘)

#### 4.1 安裝依賴
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcrypt
npm install --save-dev @types/bcrypt @types/passport-jwt
```

#### 4.2 實現 JWT 策略
- JWT Guard
- JWT Strategy
- Auth Guard 裝飾器

#### 4.3 密碼加密
- 使用 bcrypt
- 註冊時加密
- 登入時驗證

---

### 階段 5: 測試和驗證 (30 分鐘)

#### 5.1 單元測試
```bash
npm run test
```

#### 5.2 E2E 測試
```bash
npm run test:e2e
```

#### 5.3 手動測試所有 API
- 使用 Postman 或 PowerShell
- 測試所有 18 個端點
- 驗證認證流程

---

## 🗂️ 文件結構對比

### Express (舊)
```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── index.js
```

### NestJS (新)
```
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── dto/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   └── dto/
│   ├── posts/
│   │   ├── posts.controller.ts
│   │   ├── posts.service.ts
│   │   ├── posts.module.ts
│   │   └── dto/
│   ├── comments/
│   │   ├── comments.controller.ts
│   │   ├── comments.service.ts
│   │   ├── comments.module.ts
│   │   └── dto/
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   └── interceptors/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── .env
└── package.json
```

---

## 📦 需要安裝的包

### 核心依賴
```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/platform-express": "^10.0.0",
  "@nestjs/jwt": "^10.0.0",
  "@nestjs/passport": "^10.0.0",
  "@prisma/client": "^5.0.0",
  "passport": "^0.6.0",
  "passport-jwt": "^4.0.1",
  "bcrypt": "^5.1.1",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.1"
}
```

### 開發依賴
```json
{
  "@nestjs/cli": "^10.0.0",
  "@nestjs/testing": "^10.0.0",
  "prisma": "^5.0.0",
  "@types/bcrypt": "^5.0.0",
  "@types/passport-jwt": "^3.0.9",
  "jest": "^29.0.0"
}
```

---

## 🔄 業務邏輯遷移參考

### 從 Express 控制器到 NestJS

**Express (舊)**
```javascript
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
};
```

**NestJS (新)**
```typescript
@Post('register')
async register(@Body() registerDto: RegisterDto) {
  const user = await this.authService.register(registerDto);
  const token = await this.authService.generateToken(user.id);
  return { success: true, data: { user, token } };
}
```

---

## 🗄️ PostgreSQL 數據庫選項

### 選項 A: Supabase (推薦)
- ✅ 免費層 500MB
- ✅ 自動備份
- ✅ 內建認證（可選用）
- ✅ 即時數據庫
- 🔗 https://supabase.com

### 選項 B: 本地 PostgreSQL
```bash
# Windows
# 下載: https://www.postgresql.org/download/windows/
# 或使用 Chocolatey: choco install postgresql
```

### 選項 C: Docker
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: social_media
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## ✅ 完成標準

### 功能完整性
- ✅ 所有 18 個 API 端點正常工作
- ✅ JWT 認證功能正常
- ✅ 數據驗證和錯誤處理
- ✅ 關聯查詢正常（用戶-文章-評論）

### 代碼質量
- ✅ TypeScript 類型安全
- ✅ 遵循 NestJS 最佳實踐
- ✅ 代碼格式化（Prettier）
- ✅ 無 ESLint 錯誤

### 文檔
- ✅ README 更新
- ✅ API 文檔更新
- ✅ Prisma Schema 註釋完整
- ✅ 環境變數說明

---

## 📚 參考資源

### 官方文檔
- NestJS: https://docs.nestjs.com/
- Prisma: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs/

### 學習資源
- NestJS Fundamentals: https://www.youtube.com/watch?v=GHTA143_b-s
- Prisma Quickstart: https://www.prisma.io/docs/getting-started/quickstart

---

## 🎯 明天的執行順序

1. ✅ **上午 (2 小時)**
   - 保留舊代碼（改名）
   - 創建 NestJS 項目
   - 配置 Prisma + PostgreSQL
   - 設計並生成 Schema

2. ✅ **下午 (2 小時)**
   - 實現認證模塊
   - 實現用戶模塊
   - 實現文章模塊
   - 實現評論模塊

3. ✅ **晚上 (1 小時)**
   - 測試所有 API
   - 更新文檔
   - 提交代碼

**總計時間**: 約 4-5 小時

---

## 📌 注意事項

### 數據遷移
- ⚠️ 如果原 MongoDB 有數據，需要編寫遷移腳本
- 💡 目前無生產數據，可直接重建

### API 兼容性
- ✅ 保持相同的 API 端點路徑
- ✅ 保持相同的響應格式
- ✅ 前端無需修改（只要響應格式一致）

### 測試策略
- 使用 Jest 進行單元測試
- 使用 Supertest 進行 E2E 測試
- 手動測試關鍵流程

---

**準備就緒！明天開始實施 🚀**
