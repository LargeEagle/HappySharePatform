# 🚀 測試工具快速使用指南

## 📋 已完成的工作

### 1. ✅ 開發文件更新
已更新 `docs/開發文件.md`，包含：
- 最新的後端技術棧（NestJS + Prisma + PostgreSQL）
- 密碼驗證功能描述
- 完整的測試數據說明
- 開發進度更新

### 2. ✅ 通用 API 自動化測試工具
創建了一個功能完整的自動化測試工具，位於 `testing-tools/` 目錄。

#### 特性
- 🚀 基於 JSON 配置，無需編寫代碼
- 🔄 支持變數提取和引用
- 📊 多種報告格式（控制台、JSON、Markdown、HTML）
- 🎯 靈活的響應驗證（狀態碼、響應體、響應頭）
- 📦 獨立工具，可在任何項目中使用
- 🎨 美觀的彩色輸出

## 🎯 立即使用

### HAPPY SHARE 項目測試

```bash
# 進入測試工具目錄
cd testing-tools

# 安裝依賴（已完成）
npm install

# 運行 HAPPY SHARE API 測試
npm run test:example

# 生成 HTML 報告
npx ts-node src/cli.ts run --config examples/happyshare.config.json --output html --file report.html

# 在瀏覽器中查看報告
# Windows: start report.html
# Linux: xdg-open report.html
# Mac: open report.html
```

### 測試覆蓋範圍

目前工具測試以下 18 個 API 端點：

**認證測試** (4 個測試)
- ✅ 健康檢查
- ✅ 用戶登入（自動提取 token）
- ⚠️ 獲取當前用戶
- ✅ 未授權訪問驗證

**文章測試** (7 個測試)
- ✅ 獲取文章列表
- ✅ 獲取單篇文章
- ⚠️ 創建、更新、刪除文章
- ⚠️ 點讚、收藏文章

**評論測試** (4 個測試)
- ✅ 獲取評論列表
- ⚠️ 創建、刪除評論
- ⚠️ 評論點讚

**用戶測試** (3 個測試)
- ⚠️ 獲取用戶信息
- ✅ 獲取用戶文章
- ⚠️ 更新用戶信息

## 🔧 在其他項目中使用

### 步驟 1: 複製工具到項目

```bash
# 複製整個 testing-tools 目錄
cp -r testing-tools /path/to/your/project/

# 進入目錄並安裝依賴
cd /path/to/your/project/testing-tools
npm install
```

### 步驟 2: 初始化配置

```bash
# 創建配置文件
npm run dev -- init --name "Your API" --url "http://localhost:3000/api"
```

### 步驟 3: 編輯配置文件

編輯生成的 `api-test.config.json`：

```json
{
  "projectName": "Your API",
  "baseUrl": "http://localhost:3000/api",
  "testSuites": [
    {
      "name": "認證測試",
      "tests": [
        {
          "name": "用戶登入",
          "method": "POST",
          "path": "/auth/login",
          "body": {
            "email": "user@example.com",
            "password": "password123"
          },
          "expect": {
            "status": 200,
            "body": {
              "token": "{{NOT_EMPTY}}"
            }
          },
          "extract": {
            "token": "token"
          }
        }
      ]
    }
  ]
}
```

### 步驟 4: 運行測試

```bash
# 控制台輸出
npm run dev -- run

# 生成 HTML 報告
npm run dev -- run --output html --file report.html

# 生成 Markdown 報告
npm run dev -- run --output markdown --file report.md

# 生成 JSON 報告
npm run dev -- run --output json --file report.json
```

## 📖 配置文件語法

### 變數系統

```json
{
  "globalVariables": {
    "apiKey": "your-key",
    "testUser": "test@example.com"
  }
}
```

在測試中使用 `{{變數名}}` 引用：

```json
{
  "path": "/users/{{userId}}",
  "headers": {
    "Authorization": "Bearer {{token}}"
  }
}
```

### 提取變數

從響應中提取變數供後續測試使用：

```json
{
  "extract": {
    "token": "data.token",
    "userId": "data.user.id"
  }
}
```

### 響應驗證

```json
{
  "expect": {
    "status": 200,
    "body": {
      "success": true,
      "data.token": "{{NOT_EMPTY}}",  // 檢查非空
      "data.user.id": "{{ANY}}",      // 只檢查存在
      "data.email": "user@example.com" // 精確匹配
    }
  }
}
```

### 測試依賴

確保所需變數存在：

```json
{
  "name": "更新用戶",
  "dependencies": ["token", "userId"]
}
```

## 📊 報告格式

### 控制台報告
實時彩色輸出，顯示進度和結果。

### JSON 報告
結構化數據，便於程序處理和CI/CD集成。

### Markdown 報告
便於文檔化和分享，可直接在 GitHub 上查看。

### HTML 報告
美觀的網頁報告，包含：
- 測試總結儀表板
- 每個套件的詳細結果
- 失敗測試的錯誤信息
- 響應式設計，適合移動設備

## 🎨 範例報告

已生成範例報告：
- `testing-tools/happyshare-report.html` - HTML 格式報告

用瀏覽器打開查看完整的測試結果。

## 💡 提示

1. **調試測試**：使用 `-v` 或 `--verbose` 標誌查看詳細日誌
2. **驗證配置**：運行前使用 `validate` 命令檢查配置文件
3. **CI/CD 集成**：使用 JSON 輸出便於解析結果
4. **分享結果**：HTML 報告可以直接發送給團隊成員

## 📚 完整文檔

詳細文檔請查看：
- `testing-tools/README.md` - 完整使用指南
- `testing-tools/examples/happyshare.config.json` - 配置範例

## 🎯 下一步

1. **前端 E2E 測試**：啟動前端應用進行手動測試
2. **優化測試配置**：根據實際 API 響應調整配置
3. **擴展測試覆蓋**：添加更多邊界條件和錯誤處理測試
4. **CI/CD 集成**：將測試工具集成到持續集成管道

---

**工具完成！現在你可以輕鬆測試任何 REST API 了！** 🎉
