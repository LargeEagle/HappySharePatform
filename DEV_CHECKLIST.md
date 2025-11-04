# 開發環境快速檢查

**日期**: 2025-11-02  
**用途**: 快速驗證開發環境是否就緒

---

## ✅ 檢查清單

### 1. 服務狀態檢查

```bash
# 檢查後端服務（應該顯示 PID 和 port 5000）
lsof -i :5000

# 檢查前端服務（應該顯示 PID 和 port 8081）
lsof -i :8081

# 如果沒有運行，啟動服務：
cd backend && npm run start:dev &
cd frontend && npm start &
```

**預期結果**:
- ✅ 後端: `node XXXXX ... *:5000 (LISTEN)`
- ✅ 前端: `node XXXXX ... *:tproxy (LISTEN)`

---

### 2. 數據庫連接檢查

```bash
# 測試數據庫連接
cd backend
curl http://localhost:5000/api/posts | head -20
```

**預期結果**:
```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": {
    "posts": [...]
  }
}
```

如果返回錯誤，檢查：
- [ ] `.env` 文件存在
- [ ] `DATABASE_URL` 正確配置
- [ ] Supabase 連接正常

---

### 3. 前端訪問檢查

```bash
# 打開瀏覽器
http://localhost:8081

# 或使用 curl 檢查
curl -I http://localhost:8081
```

**預期結果**:
- ✅ 顯示登入頁面
- ✅ 測試帳號按鈕可見
- ✅ 無 JavaScript 錯誤

---

### 4. 測試帳號登入

**測試用戶**:
- 郵箱: `bob@happyshare.com`
- 密碼: `Test@1234`

**測試步驟**:
1. 點擊「測試用戶登入」按鈕
2. 應該自動跳轉到首頁
3. 應該看到文章列表

**預期結果**:
- ✅ 登入成功
- ✅ 顯示用戶頭像（BO）
- ✅ 顯示 10 篇文章
- ✅ 可以點讚/收藏

---

### 5. 搜索功能檢查

**測試步驟**:
1. 點擊首頁的「搜尋」按鈕
2. 輸入 "typescript"
3. 按 Enter 鍵

**預期結果**:
- ✅ 進入搜索頁面
- ✅ 顯示搜索結果
- ✅ 至少有 1 篇文章："TypeScript 最佳實踐"
- ⚠️ 可能有建議 API 超時警告（已知問題）

---

## 🐛 常見問題

### 問題 1: 後端無法啟動

**症狀**: `Error: connect ECONNREFUSED`

**解決方法**:
```bash
# 檢查 .env 文件
cat backend/.env

# 應該包含:
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"

# 如果缺少，從 .env.example 複製
cp backend/.env.example backend/.env
# 然後編輯 DATABASE_URL
```

---

### 問題 2: 前端無法連接後端

**症狀**: `Network Error` 或 `timeout`

**解決方法**:
```bash
# 1. 確認後端正在運行
lsof -i :5000

# 2. 檢查前端 API_URL 配置
cat frontend/src/config/app.config.ts

# 應該是:
export const API_URL = 'http://localhost:5000/api';

# 3. 測試後端 API
curl http://localhost:5000/api/posts
```

---

### 問題 3: 搜索建議超時

**症狀**: Console 顯示 `timeout of 10000ms exceeded`

**解決方法**:
這是已知問題，不影響核心功能。下次開發會添加 debounce 修復。

**臨時解決**:
- 輸入完整關鍵字後按 Enter
- 避免快速連續輸入
- 或跳過建議，直接搜索

---

### 問題 4: Port 被佔用

**症狀**: `Error: listen EADDRINUSE :::5000`

**解決方法**:
```bash
# 查找佔用 port 的進程
lsof -i :5000

# 終止進程
kill -9 <PID>

# 或批量終止
pkill -f "node.*backend"
pkill -f "expo start"
```

---

## 📊 性能指標

### 正常狀態
- 後端 API 響應: < 1s ✅
- 前端頁面加載: < 2s ✅
- 搜索查詢: < 1s ✅
- 建議 API: < 500ms ⚠️ (有超時問題)

### 異常狀態
如果出現以下情況，請檢查：
- API 響應 > 5s: 檢查數據庫連接
- 頁面無法加載: 檢查前端服務
- 登入失敗: 檢查測試數據是否存在

---

## 🔄 重置環境

如果環境完全混亂，執行完整重置：

```bash
# 1. 停止所有服務
pkill -f "node"

# 2. 清除 node_modules
rm -rf backend/node_modules frontend/node_modules
rm -rf backend/dist

# 3. 重新安裝
cd backend && npm install
cd ../frontend && npm install

# 4. 重置數據庫（可選）
cd backend
npx prisma migrate reset --force
npm run seed

# 5. 重新啟動
npm run start:dev &
cd ../frontend && npm start &
```

---

## 📝 開發前確認

在開始編碼前，請確認：

- [ ] 後端服務運行正常
- [ ] 前端服務運行正常
- [ ] 可以成功登入
- [ ] API 響應正常
- [ ] 閱讀了 `NEXT_STEPS.md`
- [ ] 閱讀了 `docs/開發文件.md` 最新記錄

**一切就緒，開始開發！** 🚀

---

## 🆘 需要幫助？

查看以下文檔：
- `docs/開發文件.md` - 完整開發記錄
- `docs/TROUBLESHOOTING.md` - 問題排查指南
- `backend/API_TESTING.md` - API 測試文檔
- `NEXT_STEPS.md` - 下次開發計劃
