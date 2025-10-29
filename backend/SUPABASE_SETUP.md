# Supabase 數據庫配置指南

## ⚠️ 重要提示：WSL IPv6 連接問題

**問題描述**：WSL (Windows Subsystem for Linux) 環境無法訪問 IPv6 網絡

**影響**：
- Direct Connection 使用 IPv6 地址，在 WSL 中會出現 "Network is unreachable" 錯誤
- Prisma migrate 無法連接到 `db.jpcdablvabnuqdmneqnd.supabase.co:5432`

**解決方案**：
- ✅ 使用 **Session Pooler** 連接（支持 IPv4）
- ✅ 或在 Windows 本機（非 WSL）運行 Prisma 命令

**記錄日期**：2025-10-29

---

## 📋 獲取 Supabase 連接字符串

### 步驟 1: 登入 Supabase
訪問: https://supabase.com/dashboard

### 步驟 2: 選擇項目
- 項目名稱: jpcdablvabnuqdmnenqd
- 區域: AWS ap-southeast-1

### 步驟 3: 獲取數據庫連接信息

1. 在左側導航欄點擊 **Settings** (設置)
2. 點擊 **Database**
3. 找到 **Connection string** 部分
4. 選擇 **URI** 格式
5. 複製連接字符串

### 連接字符串格式

#### ✅ Session Pooler（推薦用於 WSL 環境）
```
postgresql://postgres.jpcdablvabnuqdmneqnd:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```
- **優點**：支持 IPv4，兼容 WSL 環境
- **用途**：應用程序運行時連接、數據庫遷移
- **端口**：6543

#### Direct Connection（僅用於非 WSL 環境）
```
postgresql://postgres:[YOUR-PASSWORD]@db.jpcdablvabnuqdmneqnd.supabase.co:5432/postgres
```
- **注意**：使用 IPv6，在 WSL 中不可用
- **用途**：本機環境的數據庫遷移
- **端口**：5432

#### Transaction Pooler（Prisma 特殊用途）
```
postgresql://postgres.jpcdablvabnuqdmneqnd:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true
```
- **用途**：需要事務模式的 Prisma 操作

## 🔐 配置步驟

### 1. 重置數據庫密碼（如果需要）

1. 進入 **Settings** → **Database**
2. 找到 **Database password** 部分
3. 點擊 **Reset database password**
4. 複製新密碼並保存

### 2. 更新 .env 文件

```env
# 開發環境 - 使用 Direct Connection (用於 Prisma Migrate)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.jpcdablvabnuqdmnenqd.supabase.co:5432/postgres"

# 或使用 Transaction pooler
# DATABASE_URL="postgresql://postgres.jpcdablvabnuqdmnenqd:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true"
```

### 3. 運行數據庫遷移

```bash
cd backend
npx prisma migrate dev --name init
```

### 4. 啟動應用後可使用 Session pooler

遷移完成後，可以將 `.env` 中的連接字符串改為 Session pooler 以獲得更好的性能：

```env
DATABASE_URL="postgresql://postgres.jpcdablvabnuqdmnenqd:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

## 🛠️ 故障排除

### 錯誤: "Tenant or user not found"

**原因**: 
- 密碼錯誤
- 連接字符串格式不正確
- 項目 ID 不正確

**解決方案**:
1. 在 Supabase Dashboard 驗證項目 ID
2. 重置數據庫密碼
3. 使用 Direct connection URL 進行遷移
4. 確保沒有多餘的空格或特殊字符

### 錯誤: "Connection timeout"

**原因**: 
- 網絡問題
- 防火牆阻擋
- 端口錯誤

**解決方案**:
1. 檢查網絡連接
2. 確認端口號正確（5432 或 6543）
3. 嘗試使用不同的連接模式

### 連接模式選擇

| 用途 | 連接模式 | 端口 |
|------|---------|------|
| Prisma Migrate | Direct / Transaction pooler | 5432 |
| 應用運行時 | Session pooler | 6543 |
| Prisma Studio | Direct | 5432 |

## 📊 驗證連接

### 測試連接

```bash
# 使用 psql 測試
psql "postgresql://postgres:[PASSWORD]@db.jpcdablvabnuqdmnenqd.supabase.co:5432/postgres"

# 或使用 Prisma
npx prisma db pull
```

### 打開 Prisma Studio

```bash
npx prisma studio
```

成功後會在瀏覽器打開 http://localhost:5555

## 🔒 安全建議

1. **不要提交 .env 文件到 Git**
   - 已在 .gitignore 中配置
   - 使用 .env.example 作為模板

2. **定期更換密碼**
   - 在 Supabase Dashboard 定期重置密碼
   - 更新所有使用該密碼的環境

3. **使用環境變數**
   - 生產環境使用系統環境變數
   - 不要在代碼中硬編碼密碼

## 📝 完整配置示例

```env
# backend/.env

# 環境
NODE_ENV=development
PORT=5000

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Supabase 數據庫
# 方式 1: Direct Connection (推薦用於遷移)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD_HERE@db.jpcdablvabnuqdmnenqd.supabase.co:5432/postgres"

# 方式 2: Session Pooler (推薦用於應用運行)
# DATABASE_URL="postgresql://postgres.jpcdablvabnuqdmnenqd:YOUR_PASSWORD_HERE@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Supabase API (用於存儲功能)
SUPABASE_URL="https://jpcdablvabnuqdmnenqd.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwY2RhYmx2YWJudXFkbW5lcW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjY3NTIsImV4cCI6MjA3NzI0Mjc1Mn0.mUBz0XYCr3YJTQgWET3wjeosXOH3-iafJ-Iugg-euF4"
```

## 🚀 快速開始流程

1. **獲取數據庫密碼**
   ```
   Supabase Dashboard → Settings → Database → Reset Password
   ```

2. **更新 .env**
   ```bash
   # 使用 Direct Connection
   DATABASE_URL="postgresql://postgres:NEW_PASSWORD@db.jpcdablvabnuqdmnenqd.supabase.co:5432/postgres"
   ```

3. **運行遷移**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **啟動應用**
   ```bash
   npm run start:dev
   ```

5. **訪問**
   ```
   http://localhost:5000/api
   ```

## 📞 獲取幫助

如果遇到問題：
1. 查看 Supabase Dashboard 的 Logs
2. 檢查 .env 文件配置
3. 確認網絡連接
4. 參考 backend/DATABASE_CONFIG.md
