# 開發測試腳本

這些腳本是在開發過程中使用的簡單 API 測試工具。

## 📝 說明

這些腳本已被更完整的測試工具取代，位於項目根目錄的 `testing-tools/` 中。

## 🧪 可用腳本

### 1. test-api.sh
早期的綜合 API 測試腳本，測試基本的認證和文章功能。

### 2. test-api-simple.sh
簡化版的 API 測試，用於快速驗證基本端點。

### 3. test-search-api.sh
搜尋功能開發時使用的專用測試腳本，測試搜尋和標籤 API。

### 4. quick-test.sh
快速測試腳本，用於驗證服務器是否正常運行。

## ⚡ 使用建議

**推薦使用項目根目錄的測試工具**：

```bash
# 從項目根目錄運行
npm run test:api              # 標準測試
npm run test:api:html         # HTML 報告
npm run test:api:json         # JSON 輸出
npm run test:api:markdown     # Markdown 報告
npm run test:api:verbose      # 詳細輸出
```

**如果需要使用這些腳本**：

```bash
# 確保後端服務正在運行
cd backend
npm run start:dev

# 在另一個終端運行測試
cd backend/scripts/dev-tests
./test-search-api.sh
```

## 🗑️ 清理

這些腳本可以保留作為開發參考，或者在確認測試工具完全滿足需求後刪除。

```bash
# 如果要刪除這些腳本
cd backend/scripts
rm -rf dev-tests/
```
