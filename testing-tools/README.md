# 🧪 API 自動化測試工具

一個強大、靈活、易用的 API 自動化測試工具，支持多種輸出格式，可在多個項目中複用。

## ✨ 特性

- 🚀 **簡單易用**: 基於 JSON 配置文件，無需編寫代碼
- 🔄 **可複用**: 支持變數提取和引用，實現測試間的數據傳遞
- 📊 **多種報告**: 支持控制台、JSON、Markdown、HTML 等多種輸出格式
- 🎯 **靈活驗證**: 支持狀態碼、響應體、響應頭等多維度驗證
- 🔧 **高度可配置**: 全局變數、全局請求頭、超時設置等
- 📦 **獨立工具**: 可在任何項目中使用，不依賴特定框架
- 🎨 **美觀輸出**: 彩色控制台輸出，清晰易讀的測試結果

## 📦 安裝

### 本地項目使用

```bash
cd testing-tools
npm install
npm run build
```

### 作為全局工具安裝（可選）

```bash
npm install -g .
```

## 🚀 快速開始

### 1. 初始化配置文件

```bash
npm run dev -- init --name "My API" --url "http://localhost:3000/api"
```

這會創建一個 `api-test.config.json` 配置文件。

### 2. 編輯配置文件

```json
{
  "projectName": "My API",
  "baseUrl": "http://localhost:3000/api",
  "testSuites": [
    {
      "name": "用戶認證",
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
              "success": true,
              "data.token": "{{NOT_EMPTY}}"
            }
          },
          "extract": {
            "token": "data.token"
          }
        }
      ]
    }
  ]
}
```

### 3. 運行測試

```bash
# 控制台輸出
npm run dev -- run

# 生成 HTML 報告
npm run dev -- run --output html --file report.html

# 使用自定義配置文件
npm run dev -- run --config my-config.json
```

## 📖 配置文件詳解

### 基本結構

```typescript
{
  "projectName": "項目名稱",           // 必填
  "baseUrl": "http://api.example.com", // 必填: API 基礎 URL
  "timeout": 30000,                     // 可選: 請求超時（毫秒）
  "verbose": false,                     // 可選: 詳細日誌
  "globalHeaders": {                    // 可選: 全局請求頭
    "Content-Type": "application/json"
  },
  "globalVariables": {                  // 可選: 全局變數
    "apiKey": "your-api-key"
  },
  "testSuites": [...]                   // 必填: 測試套件數組
}
```

### 測試套件結構

```typescript
{
  "name": "套件名稱",
  "description": "套件描述",  // 可選
  "tests": [...]             // 測試用例數組
}
```

### 測試用例結構

```typescript
{
  "name": "測試名稱",
  "description": "測試描述",  // 可選
  "method": "GET",           // HTTP 方法: GET, POST, PUT, DELETE, PATCH
  "path": "/api/endpoint",   // API 路徑
  "headers": {               // 可選: 請求頭
    "Authorization": "Bearer {{token}}"
  },
  "params": {                // 可選: 查詢參數
    "page": 1,
    "limit": 10
  },
  "body": {                  // 可選: 請求體
    "key": "value"
  },
  "expect": {                // 預期結果
    "status": 200,           // HTTP 狀態碼
    "body": {                // 響應體驗證
      "success": true,
      "data.user.id": "{{ANY}}"
    }
  },
  "extract": {               // 可選: 提取變數
    "userId": "data.user.id"
  },
  "dependencies": ["token"], // 可選: 依賴的變數
  "skip": false              // 可選: 是否跳過此測試
}
```

## 🔧 高級功能

### 1. 變數系統

#### 定義全局變數

```json
{
  "globalVariables": {
    "apiUrl": "https://api.example.com",
    "testUser": "test@example.com"
  }
}
```

#### 提取響應中的變數

```json
{
  "name": "登入並提取 token",
  "method": "POST",
  "path": "/auth/login",
  "body": {
    "email": "user@example.com",
    "password": "password"
  },
  "extract": {
    "token": "data.token",
    "userId": "data.user.id"
  }
}
```

#### 使用變數

使用 `{{變數名}}` 語法引用變數：

```json
{
  "name": "獲取用戶信息",
  "method": "GET",
  "path": "/users/{{userId}}",
  "headers": {
    "Authorization": "Bearer {{token}}"
  }
}
```

### 2. 響應驗證

#### 狀態碼驗證

```json
{
  "expect": {
    "status": 200
  }
}
```

#### 響應體驗證

```json
{
  "expect": {
    "body": {
      "success": true,              // 精確匹配
      "data.user.email": "{{ANY}}", // 只檢查存在
      "data.token": "{{NOT_EMPTY}}" // 檢查非空
    }
  }
}
```

支持嵌套路徑訪問：`data.user.profile.name`

#### 響應頭驗證

```json
{
  "expect": {
    "headers": {
      "content-type": "application/json"
    }
  }
}
```

### 3. 測試依賴

確保測試按順序執行，並檢查所需變數是否存在：

```json
{
  "name": "需要 token 的測試",
  "dependencies": ["token", "userId"]
}
```

## 📊 輸出格式

### 控制台輸出

```bash
npm run dev -- run
```

彩色輸出，實時顯示測試進度和結果。

### JSON 報告

```bash
npm run dev -- run --output json --file report.json
```

生成結構化的 JSON 報告，便於程序處理。

### Markdown 報告

```bash
npm run dev -- run --output markdown --file report.md
```

生成 Markdown 格式報告，便於文檔化。

### HTML 報告

```bash
npm run dev -- run --output html --file report.html
```

生成美觀的 HTML 報告，可在瀏覽器中查看。

## 📝 HAPPY SHARE 項目範例

本工具包含一個完整的 HAPPY SHARE API 測試配置範例：

```bash
# 運行 HAPPY SHARE 測試
npm run test:example

# 或手動指定配置
npm run dev -- run --config examples/happyshare.config.json

# 生成 HTML 報告
npm run dev -- run --config examples/happyshare.config.json --output html --file happyshare-report.html
```

### 測試覆蓋範圍

範例配置包含以下測試：

1. **認證測試**
   - ✅ 健康檢查
   - ✅ 用戶登入
   - ✅ 獲取當前用戶
   - ✅ 未授權訪問驗證

2. **文章測試**
   - ✅ 獲取文章列表
   - ✅ 獲取單篇文章
   - ✅ 創建文章
   - ✅ 更新文章
   - ✅ 點讚文章
   - ✅ 收藏文章
   - ✅ 刪除文章

3. **評論測試**
   - ✅ 獲取評論列表
   - ✅ 創建評論
   - ✅ 評論點讚
   - ✅ 刪除評論

4. **用戶測試**
   - ✅ 獲取用戶信息
   - ✅ 獲取用戶文章
   - ✅ 更新用戶信息

## 🎯 在其他項目中使用

### 方法 1: 複製工具到項目

```bash
# 複製整個 testing-tools 目錄到你的項目
cp -r testing-tools /path/to/your/project/

cd /path/to/your/project/testing-tools
npm install
```

### 方法 2: 作為 npm 包使用（需要先發布）

```bash
npm install @your-org/api-test-tool
```

### 創建項目專屬配置

```bash
# 初始化配置
npm run dev -- init --name "Your Project" --url "http://localhost:8000"

# 編輯配置文件
# 添加你的測試用例

# 運行測試
npm run dev -- run
```

## 🔍 驗證配置文件

在運行測試前，可以先驗證配置文件的正確性：

```bash
npm run dev -- validate --config your-config.json
```

## 📋 命令參考

### `init` - 初始化配置

```bash
api-test init [options]

選項:
  -n, --name <name>  項目名稱（默認: My API Project）
  -u, --url <url>    API 基礎 URL（默認: http://localhost:5000/api）
```

### `run` - 運行測試

```bash
api-test run [options]

選項:
  -c, --config <path>   配置文件路徑（默認: api-test.config.json）
  -o, --output <format> 輸出格式: console|json|markdown|html（默認: console）
  -f, --file <path>     報告輸出文件路徑
  -v, --verbose         顯示詳細日誌
```

### `validate` - 驗證配置

```bash
api-test validate [options]

選項:
  -c, --config <path>  配置文件路徑（默認: api-test.config.json）
```

## 🛠️ 開發

### 項目結構

```
testing-tools/
├── src/
│   ├── types.ts       # TypeScript 類型定義
│   ├── runner.ts      # 測試執行器
│   ├── reporter.ts    # 報告生成器
│   └── cli.ts         # 命令行接口
├── examples/
│   └── happyshare.config.json  # HAPPY SHARE 範例配置
├── package.json
├── tsconfig.json
└── README.md
```

### 構建項目

```bash
npm run build
```

### 開發模式

```bash
npm run dev -- run --config examples/happyshare.config.json
```

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License

## 📞 支持

如有問題，請創建 Issue 或聯繫維護者。

---

**Happy Testing! 🎉**
