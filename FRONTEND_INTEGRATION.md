# 前端後端集成完成

## ✅ 已完成的工作

### 1. 配置更新 (`frontend/src/config/app.config.ts`)
- ✅ 設置 `useDummyData: false` - 使用真實後端 API
- ✅ 更新 `baseUrl: 'http://localhost:5000/api'` - NestJS 後端地址

### 2. 認證服務適配 (`frontend/src/services/auth.service.ts`)
**後端響應格式**：
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "username": "...", "email": "...", "name": "...", "avatar": "..." },
    "token": "eyJhbGc..."
  }
}
```

**前端適配**：
- ✅ login() - 從 `data.token` 提取 token
- ✅ register() - 從 `data.token` 提取 token  
- ✅ getCurrentUser() - 調用 `/auth/me` 並傳遞 Bearer token

### 3. 文章 API 適配 (`frontend/src/services/posts.api.ts`)
**更新要點**：
- ✅ URL 路徑：`/api/posts` → `/posts` (baseURL 已包含 /api)
- ✅ 創建文章：返回 `response.data` (直接是 Post 對象)
- ✅ 更新文章：返回 `response.data`
- ✅ 獲取文章列表：從 `response.data.posts` 和 `response.data.pagination`
- ✅ 獲取單篇文章：返回 `response.data`
- ✅ 點讚：返回完整的 Post 對象
- ✅ 收藏：返回完整的 Post 對象

### 4. API Client (`frontend/src/services/api.client.ts`)
**配置正確**：
- ✅ 自動添加 Authorization Bearer token
- ✅ 401 錯誤自動清除認證信息
- ✅ 統一錯誤處理

## 📋 測試帳號

使用以下帳號登入前端應用：

| Email | 密碼 | 用戶名 |
|-------|------|--------|
| alice@happyshare.com | Password123 | alice |
| bob@happyshare.com | Password123 | bob |
| carol@happyshare.com | Password123 | carol |
| david@happyshare.com | Password123 | david |
| emma@happyshare.com | Password123 | emma |

## 🚀 啟動應用

### 後端（已運行）
```bash
cd backend
npm run start:dev
```
- 運行於：http://localhost:5000/api
- 狀態：✅ 正在運行

### 前端
```bash
cd frontend
npx expo start
```

## 🧪 測試流程

### 1. 登入測試
1. 打開前端應用
2. 使用 `alice@happyshare.com` / `Password123` 登入
3. 確認能成功獲取 token 並進入首頁

### 2. 查看文章
1. 首頁應顯示 10 篇測試文章
2. 確認文章內容、作者、頭像正確顯示
3. 測試滾動載入更多文章

### 3. 文章互動
1. 點擊愛心圖標測試點讚功能
2. 點擊收藏圖標測試收藏功能
3. 點擊文章進入詳情頁

### 4. 創建文章
1. 點擊「新文章」按鈕
2. 輸入標題和內容
3. 發布並確認文章出現在列表中

### 5. 評論測試
1. 進入文章詳情頁
2. 查看現有評論（應有測試數據）
3. 發表新評論
4. 測試評論點讚

### 6. 個人資料
1. 進入個人資料頁面
2. 確認用戶信息正確顯示
3. 查看用戶發布的文章列表
4. 測試編輯個人資料

## 🔧 可能需要的額外適配

### 評論 API (`frontend/src/services/...`)
如果前端有單獨的評論服務，需要類似的適配：
- URL: `/api/comments` → `/comments`
- 響應格式：`response.data`

### 用戶 API
- URL: `/api/users` → `/users`
- 響應格式：`response.data`

## ⚠️ 注意事項

1. **CORS 設置**
   - 後端需要允許前端域名訪問
   - NestJS 已配置 CORS

2. **Token 過期**
   - Token 有效期：7 天
   - 過期後需重新登入

3. **圖片上傳**
   - 頭像 URL 使用外部服務（pravatar.cc）
   - 實際上傳功能需要額外實現

4. **錯誤處理**
   - 所有 API 調用都有 try-catch
   - 錯誤信息從 `error.response.data.message` 提取

## 📊 API 響應格式統一

後端所有成功響應格式：
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* 實際數據 */ }
}
```

錯誤響應格式：
```json
{
  "message": "Error message",
  "error": "Error type",
  "statusCode": 400
}
```

## ✅ 集成完成檢查清單

- [x] 後端 API 正常運行
- [x] 前端配置更新
- [x] 認證服務適配
- [x] 文章 API 適配
- [x] API Client 配置正確
- [ ] 前端應用測試（需要啟動）
- [ ] 完整功能流程測試

---

**下一步**：啟動前端應用並進行完整的功能測試。
