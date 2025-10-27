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

**目前狀態**: 🔄 技術棧遷移中

- **原技術棧**: Express.js + MongoDB + Mongoose
- **新技術棧**: NestJS + Prisma + PostgreSQL
- **遷移文檔**: 詳見 [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)
- **執行狀態**: ⏸️ 待執行（預計明天開始）

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

- ✅ **開發工具**
  - 自動化文檔更新系統
  - 開發變更追蹤
  - 測試帳號管理

### 規劃中功能

- 📋 使用者個人檔案
- 🔔 通知系統
- 🔍 搜尋功能
- 🏷️ 標籤系統
- 📊 數據分析儀表板

## 🛠️ 技術棧

### 前端

- **框架**: React Native + Expo
- **語言**: TypeScript
- **UI 框架**: React Native Paper
- **導航**: React Navigation
- **狀態管理**: React Hooks
- **HTTP 客戶端**: Axios

### 後端（🔄 遷移中）

#### 目標技術棧（即將實現）
- **框架**: NestJS (TypeScript)
- **ORM**: Prisma
- **資料庫**: PostgreSQL
- **認證**: JWT + Passport
- **API 規範**: RESTful
- **測試**: Jest + Supertest

#### 原技術棧（已實現，保留作為參考）
- **框架**: Express.js
- **ODM**: Mongoose
- **資料庫**: MongoDB
- **認證**: JWT + bcryptjs

**遷移狀態**: 詳見 [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)

## 🚀 快速開始

### 環境需求

**前端**
- Node.js >= 18.0.0
- npm 或 yarn
- Expo CLI
- iOS Simulator (Mac) 或 Android Studio（可選）

**後端（即將實現）**
- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- 或 Supabase 帳號（推薦）

### 安裝步驟

1. **克隆專案**

```bash
git clone https://github.com/LargeEagle/HappySharePatform.git
cd HappySharePatform
```

2. **安裝前端依賴**

```bash
cd frontend
npm install
```

3. **啟動開發伺服器**

使用批次檔（Windows）：
```bash
# 從專案根目錄執行
start-dev.bat
```

或手動啟動：
```bash
cd frontend
npm start
```

4. **運行應用**

- **iOS**: 按 `i` 或在 iOS Simulator 中打開
- **Android**: 按 `a` 或在 Android Emulator 中打開
- **Web**: 按 `w` 或在瀏覽器中打開 `http://localhost:8081`

### 開發模式說明

⚡ **無需後端伺服器！**

專案已配置為在開發期間使用 DUMMY DATA，所有功能都可以正常測試：

- ✅ 瀏覽文章列表（8 篇模擬文章）
- ✅ 查看用戶個人資料（3 個模擬用戶）
- ✅ 閱讀評論（預設評論數據）
- ✅ 測試所有 UI 互動

要切換到使用真實後端 API，請修改 `frontend/src/config/app.config.ts`：

```typescript
const devConfig: AppConfig = {
  dev: {
    useDummyData: false, // 改為 false 使用真實 API
  },
  // ...
};
```

### 測試帳號

開發環境提供了三個測試帳號供快速測試：

| 角色 | 郵箱 | 密碼 | 說明 |
|------|------|------|------|
| 管理員 | admin@happyshare.com | Admin123! | 管理員權限 |
| 測試用戶 | test@happyshare.com | Test123! | 一般用戶 |
| 演示帳號 | demo@happyshare.com | Demo123! | 演示用途 |

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
