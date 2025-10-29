# 🚀 HAPPY SHARE 平台 - 快速開始指南

## 📋 項目結構

```
social-media-platform/
├── backend/          # NestJS + Prisma + PostgreSQL 後端
├── frontend/         # React Native + Expo 前端
├── testing-tools/    # 通用 API 測試工具
└── docs/            # 開發文件
```

## ⚡ 快速開始

### 1️⃣ 首次設置

```bash
# 安裝所有依賴（前端、後端、測試工具）
npm run setup

# 配置數據庫並填充測試數據
npm run db:migrate
npm run db:seed
```

### 2️⃣ 啟動開發環境

```bash
# 方式 1: 同時啟動前端和後端（推薦）
npm run dev

# 方式 2: 分別啟動
npm run dev:backend   # 只啟動後端
npm run dev:frontend  # 只啟動前端
```

### 3️⃣ 測試 API

```bash
# 快速測試
npm run test:health   # 測試後端健康狀態
npm run test:login    # 測試登錄功能
npm run test:api      # 運行完整 API 測試套件

# 生成測試報告
npm run test:api:html      # HTML 報告
npm run test:api:markdown  # Markdown 報告
npm run test:api:json      # JSON 報告
```

## 📦 可用的 npm 命令

### 🚀 開發命令

| 命令 | 說明 |
|------|------|
| `npm run dev` | 同時啟動前端和後端 |
| `npm run dev:backend` | 只啟動後端服務器 |
| `npm run dev:frontend` | 只啟動前端應用 |

### 🧪 測試命令

| 命令 | 說明 |
|------|------|
| `npm run test:api` | 運行 API 自動化測試 |
| `npm run test:api:html` | 生成 HTML 測試報告 |
| `npm run test:api:json` | 生成 JSON 測試報告 |
| `npm run test:api:markdown` | 生成 Markdown 測試報告 |
| `npm run test:api:verbose` | 詳細模式運行測試 |
| `npm run test:health` | 測試後端 API 健康狀態 |
| `npm run test:login` | 快速測試登錄功能 |

### 🗃️ 數據庫管理

| 命令 | 說明 |
|------|------|
| `npm run db:seed` | 填充測試數據 |
| `npm run db:migrate` | 執行數據庫遷移 |
| `npm run db:studio` | 打開 Prisma Studio（數據庫可視化） |

### 🔧 項目管理

| 命令 | 說明 |
|------|------|
| `npm run setup` | 安裝所有子項目的依賴 |
| `npm run setup:backend` | 只安裝後端依賴 |
| `npm run setup:frontend` | 只安裝前端依賴 |
| `npm run setup:testing` | 只安裝測試工具依賴 |
| `npm run clean` | 清除所有 node_modules |
| `npm run clean:cache` | 清除構建緩存 |

## 📊 測試帳號

所有測試帳號密碼: **Test@1234**

| 郵箱 | 用戶名 | 說明 |
|------|--------|------|
| alice@happyshare.com | alice | 測試用戶 1 |
| bob@happyshare.com | bob | 測試用戶 2 |
| carol@happyshare.com | carol | 測試用戶 3 |
| david@happyshare.com | david | 測試用戶 4 |
| emma@happyshare.com | emma | 測試用戶 5 |

## 🌐 訪問地址

- **後端 API**: http://localhost:5000/api
- **前端應用**: http://localhost:8081 (Expo Web)
- **Prisma Studio**: http://localhost:5555 (需運行 `npm run db:studio`)

## 📖 完整開發流程示例

```bash
# 1. 克隆項目後的首次設置
git clone <repository-url>
cd social-media-platform
npm run setup                # 安裝所有依賴
npm run db:migrate          # 設置數據庫
npm run db:seed             # 填充測試數據

# 2. 啟動開發環境
npm run dev                 # 一鍵啟動前端和後端

# 3. 驗證一切正常
npm run test:health         # 檢查後端
npm run test:login          # 測試登錄
npm run test:api            # 運行完整測試

# 4. 開始開發...
# 前端: http://localhost:8081
# 後端 API: http://localhost:5000/api
```

## 🐛 故障排除

### 端口被占用

```bash
# 查找並關閉占用 5000 端口的進程
lsof -ti:5000 | xargs kill -9

# 或關閉 8081 端口
lsof -ti:8081 | xargs kill -9
```

### 依賴問題

```bash
# 清除所有依賴並重新安裝
npm run clean
npm run setup
```

### 數據庫問題

```bash
# 重置數據庫並重新填充
npm run db:reset
npm run db:seed
```

## 📚 詳細文檔

- [開發文件](./docs/開發文件.md) - 完整的開發指南和技術棧說明
- [後端測試指南](./backend/TESTING_GUIDE.md) - 後端 API 測試詳細說明
- [API 測試文檔](./backend/API_TESTING.md) - API 端點說明
- [遷移文檔](./MIGRATION_PLAN.md) - 技術棧遷移記錄
- [E2E 測試清單](./E2E_TEST_CHECKLIST.md) - 端到端測試檢查清單

## 🛠️ 技術棧

### 後端
- **框架**: NestJS 11.1.8
- **ORM**: Prisma 6.18.0
- **數據庫**: PostgreSQL (Supabase)
- **認證**: JWT + Passport

### 前端
- **框架**: React Native + Expo
- **UI**: React Native Paper (Material Design 3)
- **狀態管理**: React Context API
- **HTTP**: Axios

### 測試
- **API 測試**: 自定義 TypeScript 測試工具
- **報告格式**: Console, JSON, Markdown, HTML

## 🤝 貢獻

1. Fork 這個項目
2. 創建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 📄 授權

MIT License - 查看 [LICENSE](./LICENSE) 文件了解詳情

## 📞 支持

如有問題，請查看：
- [開發文件](./docs/開發文件.md)
- [故障排除指南](./backend/TESTING_GUIDE.md#故障排除)
- 或提交 Issue
