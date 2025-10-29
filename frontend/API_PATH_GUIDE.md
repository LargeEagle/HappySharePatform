# API 路徑配置指南

## ⚠️ 重要：避免重複的 /api 前綴

### 問題
在使用 `apiClient` 時，不應該在路徑中包含 `/api` 前綴，因為 `baseUrl` 已經包含了它。

### ❌ 錯誤示例

```typescript
// baseUrl = 'http://localhost:5000/api'
const response = await apiClient.get('/api/users/123');
// ❌ 結果: http://localhost:5000/api/api/users/123 (重複的 /api)
```

### ✅ 正確示例

```typescript
// baseUrl = 'http://localhost:5000/api'
const response = await apiClient.get('/users/123');
// ✅ 結果: http://localhost:5000/api/users/123
```

## 配置說明

### baseUrl 配置

在 `frontend/src/config/app.config.ts`：

```typescript
const devConfig: AppConfig = {
  api: {
    baseUrl: 'http://localhost:5000/api', // 包含 /api 前綴
    timeout: 10000,
  },
  // ...
};
```

### API 服務使用

#### ✅ 使用 apiClient（推薦）

```typescript
import { apiClient } from './api.client';

// 正確：不包含 /api 前綴
await apiClient.get('/users/123');
await apiClient.post('/posts', data);
await apiClient.put('/users/123', data);
await apiClient.delete('/posts/456');
```

#### ✅ 使用 axios 直接調用

```typescript
import axios from 'axios';
import { appConfig } from '../config/app.config';

const API_URL = appConfig.api.baseUrl; // 已包含 /api

// 正確：不重複添加 /api
await axios.get(`${API_URL}/users/123`);
await axios.post(`${API_URL}/auth/login`, credentials);
```

## 已修復的文件

### 2025-10-29 修復

- ✅ `frontend/src/services/user.api.ts`
  - 移除所有 `/api` 前綴
  - `getUserProfile`: `/api/users/${id}` → `/users/${id}`
  - `updateUserProfile`: `/api/users/${id}` → `/users/${id}`
  - `getUserPosts`: `/api/users/${id}/posts` → `/users/${id}/posts`
  - `uploadAvatar`: `/api/users/avatar` → `/users/avatar`

### 檢查清單

在添加新的 API 調用時，請檢查：

- [ ] 使用 `apiClient` 而非直接使用 `axios`
- [ ] URL 路徑以 `/` 開頭（如 `/users/123`）
- [ ] URL 路徑**不**包含 `/api` 前綴
- [ ] 參數使用 `params` 對象傳遞
- [ ] 處理響應時正確解構 `response.data`

## API 端點映射

### 認證端點

| 功能 | apiClient 路徑 | 完整 URL |
|------|---------------|----------|
| 註冊 | `/auth/register` | `http://localhost:5000/api/auth/register` |
| 登錄 | `/auth/login` | `http://localhost:5000/api/auth/login` |
| 獲取當前用戶 | `/auth/me` | `http://localhost:5000/api/auth/me` |

### 用戶端點

| 功能 | apiClient 路徑 | 完整 URL |
|------|---------------|----------|
| 獲取用戶 | `/users/:id` | `http://localhost:5000/api/users/:id` |
| 更新用戶 | `/users/:id` | `http://localhost:5000/api/users/:id` |
| 用戶文章 | `/users/:id/posts` | `http://localhost:5000/api/users/:id/posts` |
| 上傳頭像 | `/users/avatar` | `http://localhost:5000/api/users/avatar` |

### 文章端點

| 功能 | apiClient 路徑 | 完整 URL |
|------|---------------|----------|
| 文章列表 | `/posts` | `http://localhost:5000/api/posts` |
| 創建文章 | `/posts` | `http://localhost:5000/api/posts` |
| 獲取文章 | `/posts/:id` | `http://localhost:5000/api/posts/:id` |
| 更新文章 | `/posts/:id` | `http://localhost:5000/api/posts/:id` |
| 刪除文章 | `/posts/:id` | `http://localhost:5000/api/posts/:id` |
| 點讚文章 | `/posts/:id/like` | `http://localhost:5000/api/posts/:id/like` |
| 收藏文章 | `/posts/:id/bookmark` | `http://localhost:5000/api/posts/:id/bookmark` |

### 評論端點

| 功能 | apiClient 路徑 | 完整 URL |
|------|---------------|----------|
| 獲取評論 | `/comments/posts/:postId/comments` | `http://localhost:5000/api/comments/posts/:postId/comments` |
| 創建評論 | `/comments/posts/:postId/comments` | `http://localhost:5000/api/comments/posts/:postId/comments` |
| 刪除評論 | `/comments/:id` | `http://localhost:5000/api/comments/:id` |
| 點讚評論 | `/comments/:id/like` | `http://localhost:5000/api/comments/:id/like` |

## 調試技巧

### 查看實際請求的 URL

在 `api.client.ts` 中添加請求攔截器日誌：

```typescript
this.client.interceptors.request.use(
  async (config) => {
    console.log('🔗 Request URL:', config.baseURL + config.url);
    // ... 其他邏輯
    return config;
  }
);
```

### 檢查 404 錯誤

如果看到 404 錯誤，檢查：
1. URL 是否有重複的 `/api`
2. 後端路由是否正確註冊
3. HTTP 方法是否匹配（GET, POST, PUT, DELETE）

### 測試端點

使用 curl 測試後端端點：

```bash
# 測試用戶端點
curl http://localhost:5000/api/users/USER_ID

# 測試帶認證的端點
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/auth/me
```

## 參考文檔

- [API 客戶端實現](../src/services/api.client.ts)
- [後端 API 文檔](../../backend/API_TESTING.md)
- [快速開始指南](../../QUICK_START.md)
