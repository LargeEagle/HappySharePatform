# MongoDB 數據庫設置指南

## 方案 1: MongoDB Atlas（推薦 - 雲端數據庫）

### 優點
- ✅ 無需本地安裝
- ✅ 免費層提供 512MB 存儲
- ✅ 自動備份和監控
- ✅ 全球分佈式
- ✅ 適合開發和小型生產環境

### 步驟

#### 1. 創建 MongoDB Atlas 帳號
訪問: https://www.mongodb.com/cloud/atlas/register

#### 2. 創建集群 (Cluster)
1. 選擇 **FREE** 方案 (M0 Sandbox)
2. 選擇雲端提供商和區域（推薦選擇離你最近的）
3. 點擊 "Create Cluster"

#### 3. 創建數據庫用戶
1. 在左側菜單選擇 "Database Access"
2. 點擊 "Add New Database User"
3. 選擇 "Password" 認證方式
4. 輸入用戶名和密碼（記住這些憑證！）
5. 選擇權限：`Atlas admin` 或 `Read and write to any database`
6. 點擊 "Add User"

#### 4. 設置網絡訪問
1. 在左側菜單選擇 "Network Access"
2. 點擊 "Add IP Address"
3. 選擇 "Allow Access from Anywhere" (開發環境)
   - 或者添加你的具體 IP 地址（更安全）
4. 點擊 "Confirm"

#### 5. 獲取連接字符串
1. 回到 "Database" 頁面
2. 點擊 "Connect" 按鈕
3. 選擇 "Connect your application"
4. 選擇 Driver: **Node.js** 和版本 **5.5 or later**
5. 複製連接字符串，格式如下：
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### 6. 更新 .env 文件
將連接字符串更新到 `backend/.env`：

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/social-media-platform?retryWrites=true&w=majority
```

**注意事項：**
- 將 `<username>` 替換為你的數據庫用戶名
- 將 `<password>` 替換為你的數據庫密碼
- 在 `mongodb.net/` 後面添加數據庫名稱（如 `social-media-platform`）

---

## 方案 2: 本地 MongoDB

### Windows 安裝

#### 1. 下載 MongoDB
訪問: https://www.mongodb.com/try/download/community

#### 2. 安裝 MongoDB
1. 運行安裝程序
2. 選擇 "Complete" 安裝
3. 勾選 "Install MongoDB as a Service"
4. 勾選 "Install MongoDB Compass"（可選的 GUI 工具）

#### 3. 驗證安裝
打開命令提示符：
```bash
mongod --version
```

#### 4. 啟動 MongoDB 服務
```bash
# 檢查服務狀態
net start MongoDB

# 如果未運行，啟動服務
net start MongoDB
```

#### 5. 連接測試
```bash
mongosh
```

#### 6. 配置 .env
```env
MONGODB_URI=mongodb://localhost:27017/social-media-platform
```

---

## 方案 3: Docker MongoDB（進階）

### 使用 Docker Compose

創建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: social-media-mongodb
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: social-media-platform
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

啟動：
```bash
docker-compose up -d
```

配置 .env：
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/social-media-platform?authSource=admin
```

---

## 驗證連接

### 1. 啟動後端服務器
```bash
cd backend
npm run dev
```

### 2. 檢查日誌
應該看到：
```
✅ MongoDB 連接成功: cluster0.xxxxx.mongodb.net
🚀 服務器運行在端口 5000
```

### 3. 測試 API
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/"
```

---

## 常見問題

### Q: 連接失敗 "ECONNREFUSED"
**A:** 檢查：
1. MongoDB 服務是否運行
2. 連接字符串是否正確
3. IP 白名單是否設置（Atlas）
4. 用戶名和密碼是否正確

### Q: Atlas 連接慢
**A:** 選擇離你更近的區域重新創建集群

### Q: "Authentication failed"
**A:** 
1. 檢查用戶名密碼是否正確
2. 確保在 Atlas 中創建了數據庫用戶
3. 檢查連接字符串格式

### Q: 本地 MongoDB 佔用資源太多
**A:** 使用 MongoDB Atlas 或配置 MongoDB 內存限制

---

## 數據庫工具推薦

### 1. MongoDB Compass（官方 GUI）
- 免費
- 可視化數據瀏覽
- 下載：https://www.mongodb.com/products/compass

### 2. Studio 3T
- 功能強大
- 免費版有限制
- 下載：https://studio3t.com/

### 3. VS Code 擴展
- MongoDB for VS Code
- 直接在編輯器中管理數據庫

---

## 下一步

數據庫配置完成後：

1. ✅ 啟動後端服務器：`npm run dev`
2. ✅ 測試註冊 API
3. ✅ 創建測試數據
4. ✅ 前端切換到真實 API
5. ✅ 全棧測試
