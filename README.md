# HAPPY SHARE 社交平台

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

一個注重分享快樂、正向能量的跨平台社交平台

[功能特色](#功能特色) • [技術棧](#技術棧) • [快速開始](#快速開始) • [開發指南](#開發指南) • [文檔](#文檔)

</div>

---

## 📱 專案簡介

HAPPY SHARE 是一個現代化的社交平台，旨在創造一個讓用戶能夠分享生活中美好時刻、互相鼓勵支持的溫暖社群。平台支援：

- 🌐 **網頁版**（基於 React Native Web）
- 📱 **iOS 應用**
- 🤖 **Android 應用**

### 🚀 開發模式特色

在開發期間，專案已配置為使用 **DUMMY DATA**，無需啟動後端伺服器即可開發和測試前端功能！

- 完整的模擬用戶數據（含頭像、個人資料、統計數據）
- 豐富的模擬文章內容（包含圖片、標籤、互動數據）
- 真實的評論系統模擬
- 網路延遲模擬（500ms）提供更真實的開發體驗

### ⚠️ 後端開發狀態

**目前狀態**: ✅ **遷移完成並運行中**

- **原技術棧**: Express.js + MongoDB + Mongoose
- **新技術棧**: NestJS + Prisma + PostgreSQL ✅
- **遷移文檔**: 詳見 [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)
- **執行狀態**: ✅ **完成** - 後端服務運行於 `http://localhost:5000/api`
- **測試狀態**: ✅ 18 個 API 端點全部測試通過
- **數據狀態**: ✅ 測試數據已填充（5 用戶，11 文章，15 評論）

## ✨ 功能特色

### 已實現功能

- ✅ **用戶認證系統**
  - 用戶註冊與登入
  - JWT Token 認證
  - 測試帳號快速登入（開發環境）
  - 自動登入與 Token 管理

- ✅ **用戶個人資料**
  - 個人資料頁面
  - 編輯個人資料（用戶名、簡介、位置、網站）
  - 用戶統計數據（文章數、粉絲數、追蹤數、點讚數）
  - 用戶文章列表

- ✅ **主題系統**
  - 深色/淺色模式切換
  - Apple 風格設計系統
  - 動態主題配色

- ✅ **文章管理**
  - 文章發布與編輯
  - 無限滾動文章列表
  - 下拉重新整理
  - 文章詳情頁面

- ✅ **互動功能**
  - 文章點讚/取消點讚
  - 文章收藏/取消收藏
  - 評論系統
  - 評論點讚

- ✅ **搜尋功能** 🆕
  - 文章搜尋（標題、內容）
  - 用戶搜尋（用戶名、姓名、簡介）
  - 文件搜尋（附件名稱）
  - 標籤搜尋
  - 搜尋建議（自動完成）
  - 搜尋歷史記錄

- ✅ **標籤系統** 🆕
  - 自定義標籤創建
  - 熱門標籤展示
  - 標籤文章列表
  - 文章標籤管理
  - 標籤統計

- ✅ **開發工具**
  - 自動化文檔更新系統
  - 開發變更追蹤
  - 測試帳號管理
  - 通用 API 測試工具

### 規劃中功能

- 📋 用戶關注系統
- 🔔 即時通知系統
- � 數據分析儀表板
- 🖼️ 圖片上傳和預覽
- � 文件管理系統

## 🛠️ 技術棧

### 前端

- **框架**: React Native + Expo
- **語言**: TypeScript
- **UI 框架**: React Native Paper
- **導航**: React Navigation
- **狀態管理**: React Hooks
- **HTTP 客戶端**: Axios

### 後端

- **框架**: NestJS 11.1.8 ✅
- **ORM**: Prisma 6.18.0 ✅
- **資料庫**: PostgreSQL (Supabase) ✅
- **認證**: JWT + Passport ✅
- **語言**: TypeScript ✅
- **API 規範**: RESTful ✅
- **測試**: 自定義 API 測試工具 ✅

### 測試工具

- **框架**: TypeScript + axios
- **報告格式**: Console, JSON, Markdown, HTML
- **特性**: 變數系統、自動 token 管理、靈活驗證

## 🚀 快速開始

詳細的快速開始指南請參考: [QUICK_START.md](./QUICK_START.md)

### 環境需求

- Node.js >= 18.0.0
- npm 或 yarn
- Expo CLI（前端）
- PostgreSQL（後端，或使用 Supabase）

### 一鍵啟動

```bash
# 1. 首次安裝（安裝所有依賴）
npm run setup

# 2. 設置數據庫（如果還沒有）
npm run db:migrate
npm run db:seed

# 3. 啟動開發環境（前端 + 後端同時啟動）
npm run dev
```

### 分別啟動

```bash
# 只啟動後端
npm run dev:backend

# 只啟動前端
npm run dev:frontend
```

### 快速測試

```bash
# 測試後端健康狀態
npm run test:health

# 測試登錄功能
npm run test:login

# 運行完整 API 測試
npm run test:api
```

### 測試帳號

所有測試帳號密碼: **Test@1234**

| 郵箱 | 用戶名 | 說明 |
|------|--------|------|
| alice@happyshare.com | alice | 測試用戶 1 |
| bob@happyshare.com | bob | 測試用戶 2 |
| carol@happyshare.com | carol | 測試用戶 3 |
| david@happyshare.com | david | 測試用戶 4 |
| emma@happyshare.com | emma | 測試用戶 5 |

### 訪問地址

- **後端 API**: http://localhost:5000/api
- **前端應用**: http://localhost:8081
- **Prisma Studio**: http://localhost:5555 (運行 `npm run db:studio`)

## 📖 開發指南

### 專案結構

```
social-media-platform/
├── frontend/                # 前端應用（React Native + Expo）
│   ├── src/
│   │   ├── components/     # 可重用組件
│   │   │   ├── common/     # 通用組件
│   │   │   └── layout/     # 佈局組件
│   │   ├── screens/        # 頁面組件
│   │   ├── hooks/          # 自定義 Hooks
│   │   ├── services/       # API 服務層（Strategy Pattern）
│   │   ├── utils/          # 工具函數和 Dummy Data
│   │   ├── config/         # 應用配置
│   │   ├── types/          # TypeScript 類型定義
│   │   └── providers/      # Context Providers
│   └── package.json
├── backend/                 # 後端 API（⚠️ 遷移中）
│   └── (即將使用 NestJS + Prisma + PostgreSQL)
├── backend-express/         # 舊後端（保留作為參考）
│   ├── src/
│   │   ├── controllers/    # Express 控制器
│   │   ├── models/         # Mongoose 模型
│   │   ├── routes/         # API 路由
│   │   └── middlewares/    # 中間件
│   └── package.json
├── docs/                    # 文檔
│   └── 開發文件.md
├── MIGRATION_PLAN.md        # 後端遷移計劃
└── README.md
```
│   │   ├── services/       # API 服務
│   │   ├── types/          # TypeScript 類型定義
│   │   ├── utils/          # 工具函數
│   │   ├── config/         # 配置文件
│   │   └── providers/      # Context Providers
│   ├── assets/             # 靜態資源
│   └── App.tsx             # 應用入口
├── backend/                # 後端應用（開發中）
├── docs/                   # 專案文檔
│   ├── 開發文件.md         # 完整開發文檔
│   └── 主題系統.md         # 主題系統文檔
└── README.md               # 專案說明
```

### 編碼規範

- **語言**: TypeScript (嚴格模式)
- **代碼風格**: ESLint + Prettier
- **命名規範**: 
  - 組件: PascalCase
  - 函數/變數: camelCase
  - 常量: UPPER_SNAKE_CASE
  - 類型: PascalCase (以 Type/Interface 結尾)

### Git 工作流程

1. 從 `main` 分支創建功能分支
2. 開發並提交變更
3. 推送到遠端倉庫
4. 創建 Pull Request
5. 代碼審查後合併

### 提交訊息規範

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 類型**:
- `feat`: 新功能
- `fix`: 錯誤修復
- `docs`: 文檔更新
- `style`: 代碼格式調整
- `refactor`: 代碼重構
- `test`: 測試相關
- `chore`: 構建/工具變動

**範例**:
```
feat(auth): 實現用戶登入功能

- 添加登入表單驗證
- 實現 JWT Token 管理
- 添加自動登入功能

Closes #123
```

## 📚 文檔

- [完整開發文件](./docs/開發文件.md) - 詳細的開發流程、技術規範和 API 文檔
- [主題系統文檔](./docs/主題系統.md) - 主題設計系統和使用指南

## 🧪 測試

```bash
# 運行單元測試
npm test

# 運行測試覆蓋率
npm run test:coverage

# 運行 E2E 測試
npm run test:e2e
```

## 📦 構建與部署

### 構建應用

```bash
# 構建生產版本
npm run build

# 構建 Android APK
expo build:android

# 構建 iOS IPA
expo build:ios
```

### 環境變數

創建 `.env` 文件並配置：

```env
API_BASE_URL=https://api.happyshare.com
API_TIMEOUT=10000
JWT_SECRET=your-secret-key
```

## 🤝 貢獻指南

我們歡迎所有形式的貢獻！

1. Fork 本專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### 開發建議

- 在提交前運行 `npm run lint` 確保代碼風格一致
- 為新功能編寫測試
- 更新相關文檔
- 遵循既定的編碼規範

## 📝 更新日誌

查看 [開發文件](./docs/開發文件.md#7-更新記錄) 以了解詳細的更新歷史。

### 最近更新 (2025-10-26)

- ✨ 修復登入導航功能
- ✨ 實現文章互動功能
- ✨ 添加評論系統
- ✨ 實現首頁文章列表
- ✨ 支援深色模式切換

## 📄 授權

本專案採用 MIT 授權 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 👥 團隊

- **開發者**: Your Name
- **設計師**: Your Name
- **專案負責人**: Your Name

## 📞 聯絡方式

- **Email**: contact@happyshare.com
- **Issues**: [GitHub Issues](https://github.com/your-username/social-media-platform/issues)
- **Discussion**: [GitHub Discussions](https://github.com/your-username/social-media-platform/discussions)

## 🙏 致謝

感謝所有為這個專案做出貢獻的開發者們！

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [React Navigation](https://reactnavigation.org/)

---

<div align="center">

Made with ❤️ by HAPPY SHARE Team

[⬆ 回到頂部](#happy-share-社交平台)

</div>
