# 故障排查快速參考

> **使用場景**: 快速查找常見問題的解決方案  
> **完整文檔**: 見 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

## 🚨 最常見問題 TOP 5

### 1. 🔴 數據庫連接失敗 (Prisma P1001)

**WSL2 環境**:
```bash
# 檢查使用的連接類型
echo $DATABASE_URL | grep "pooler"

# 必須使用 Session Pooler (IPv4 Compatible)
DATABASE_URL="postgresql://postgres.<project-ref>:PASSWORD@aws-*-*.pooler.supabase.com:5432/postgres"
```

**詳細文檔**: [TROUBLESHOOTING.md § 3.3](./TROUBLESHOOTING.md#33-prisma-p1001-錯誤---wsl2--supabase-連接問題-)

---

### 2. ⚠️ API 路徑 404 錯誤

**檢查**:
```typescript
// ❌ 錯誤：重複 /api/
apiClient.get(`/api/users/${id}`)  // baseURL 已有 /api/

// ✅ 正確
apiClient.get(`/users/${id}`)
```

---

### 3. ⚠️ 導航錯誤 (Screen 未註冊)

**檢查**:
```bash
# 確認實際使用的 App.tsx
cat frontend/index.ts | grep "import App"

# 找出所有 App.tsx
find . -name "App.tsx"
```

---

### 4. 💡 前端快取問題

**快速清除**:
```bash
cd frontend
rm -rf .expo .expo-shared node_modules/.cache
npm start -- --clear
```

---

### 5. 💡 端口被占用

**檢查與清理**:
```bash
# 查看占用
lsof -i :5000
lsof -i :8081

# 清理所有進程
pkill -9 -f "node|expo|metro|nest"
```

---

## 🔍 快速診斷命令

### 檢查服務狀態
```bash
# 後端是否運行
curl http://localhost:5000/api/posts

# 前端是否運行
curl http://localhost:8081

# 查看所有相關進程
ps aux | grep -E "node|expo|metro|nest"
```

### 測試數據庫連接
```bash
# 測試網絡連接
nc -zv aws-1-ap-southeast-1.pooler.supabase.com 5432

# 測試 Prisma 連接
cd backend
npx prisma db pull --force

# 檢查環境變量
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

### 搜尋問題代碼
```bash
# 搜尋 API 路徑問題
grep -r "apiClient.get(\`/api/" frontend/src/

# 搜尋重複文件
find . -name "App.tsx" -o -name "SearchScreen.tsx"

# 檢查導入路徑
grep -r "import.*from.*'\./" frontend/
```

---

## 🎯 問題分類快速導航

| 問題類型 | 搜尋關鍵字 | 章節 |
|---------|-----------|------|
| 🔴 數據庫連接 | `P1001`, `Prisma`, `Supabase` | [§ 3.3](./TROUBLESHOOTING.md#33-prisma-p1001-錯誤---wsl2--supabase-連接問題-) |
| ⚠️ API 錯誤 | `404`, `500`, `CORS` | [§ 2](./TROUBLESHOOTING.md#2-api-與網路請求問題) |
| ⚠️ 導航錯誤 | `NAVIGATE`, `Screen` | [§ 1](./TROUBLESHOOTING.md#1-導航與路由問題) |
| 💡 快取問題 | `cache`, `metro`, `expo` | [§ 4](./TROUBLESHOOTING.md#4-快取與瀏覽器問題) |
| 💡 類型錯誤 | `TypeScript`, `type` | [§ 6](./TROUBLESHOOTING.md#6-typescript-類型問題) |
| 💡 環境配置 | `.env`, `config`, `port` | [§ 7](./TROUBLESHOOTING.md#7-環境配置問題) |

---

## 📋 問題處理流程

```
遇到問題
    ↓
在 TROUBLESHOOTING.md 搜尋關鍵字 (Ctrl+F)
    ↓
找到了？ ─ Yes → 按文檔步驟解決 → 驗證修復
    ↓ No
執行快速診斷命令
    ↓
嘗試解決
    ↓
成功？ ─ Yes → 記錄到 TROUBLESHOOTING.md
    ↓ No           (使用模板)
請求團隊協助
```

---

## 🛠️ 緊急重置流程

**當系統完全無法啟動時**:

```bash
# 1. 停止所有服務
pkill -9 -f "node|expo|metro|nest"

# 2. 清除所有快取
cd frontend
rm -rf .expo .expo-shared node_modules/.cache
cd ../backend
rm -rf dist node_modules/.cache

# 3. 重新安裝依賴
cd frontend && npm install
cd ../backend && npm install

# 4. 確認環境配置
cd backend
cat .env | grep DATABASE_URL  # 確認數據庫連接
cat .env | grep PORT           # 確認端口

# 5. 重啟服務
cd backend
npm run start:dev &

cd ../frontend
npm start &

# 6. 驗證
curl http://localhost:5000/api/posts
curl http://localhost:8081
```

---

## 💊 常用急救命令

```bash
# 重啟後端
cd backend
pkill -9 -f "nest|node.*dist/main"
npm run start:dev

# 重啟前端
cd frontend
pkill -9 -f "expo|metro"
npm start -- --clear

# 檢查後端日誌
cd backend
tail -f backend.log

# 測試 API
curl -X GET http://localhost:5000/api/posts
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# 重新生成 Prisma Client
cd backend
npx prisma generate
npx prisma db push
```

---

## 📞 獲取幫助

1. **首先**: 搜尋 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. **其次**: 檢查 [開發文件.md](./開發文件.md) 相關章節
3. **然後**: 執行上方診斷命令，收集信息
4. **最後**: 向團隊成員描述：
   - 完整錯誤訊息
   - 已嘗試的解決方法
   - 系統環境（OS, Node版本等）
   - 問題重現步驟

---

## 🔗 快速鏈接

- [完整故障排查指南](./TROUBLESHOOTING.md)
- [開發文件](./開發文件.md)
- [API 測試指南](../backend/API_TESTING.md)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Prisma 錯誤參考](https://www.prisma.io/docs/reference/api-reference/error-reference)

---

**最後更新**: 2025-11-02  
**維護者**: 開發團隊

**記住**: 90% 的問題都已經被解決過，先搜尋文檔！🔍
