# 🔒 安全配置指南

## ⚠️ 重要安全警告

### 絕不要提交以下文件到 Git/GitHub：
- `.env` - 包含數據庫密碼、API 密鑰等敏感信息
- `.env.local`
- `.env.development`
- `.env.production`
- 任何包含密碼、API 密鑰、Token 的文件

---

## ✅ 安全檢查清單

### 1. 確認 .gitignore 配置正確

檢查以下文件是否在 `.gitignore` 中：

```gitignore
# 環境變數文件
.env
.env.local
.env.development
.env.production
.env.*.local

# 日誌文件
*.log
npm-debug.log*

# 依賴
node_modules/

# 構建產物
dist/
build/

# 系統文件
.DS_Store
Thumbs.db

# IDE 配置
.vscode/
.idea/
*.swp
*.swo
```

### 2. 使用 .env.example 作為模板

✅ **正確做法**：
```bash
# .env.example (可以提交)
DATABASE_URL="postgresql://user:password@host:port/db"
JWT_SECRET="your-secret-here"
```

❌ **錯誤做法**：
```bash
# .env (永遠不要提交！)
DATABASE_URL="postgresql://postgres:Password1234@db.jpcdablvabnuqdmnenqd.supabase.co:5432/postgres"
JWT_SECRET="actual-secret-key-12345"
```

### 3. 檢查是否已經提交了敏感信息

```bash
# 檢查當前狀態
git status

# 檢查歷史記錄
git log --all --full-history -- ".env"

# 搜尋可能的密碼
git log -p | grep -i "password"
```

### 4. 如果不小心提交了敏感信息

#### 方案 A: 從最近提交中刪除（還未推送到遠端）

```bash
# 取消最後一次提交，保留修改
git reset --soft HEAD~1

# 從暫存區移除 .env
git reset HEAD .env

# 重新提交
git commit -m "your message"
```

#### 方案 B: 已經推送到 GitHub

🚨 **立即採取以下步驟**：

1. **更改所有暴露的密碼和密鑰**：
   - Supabase: 重置數據庫密碼
   - JWT Secret: 生成新的隨機字符串
   - API Keys: 撤銷並重新生成

2. **從 Git 歷史中完全刪除**（使用 BFG Repo-Cleaner）：
   ```bash
   # 安裝 BFG
   # 或使用 git filter-branch（更複雜）
   
   # 使用 BFG 刪除文件
   bfg --delete-files .env
   
   # 清理和強制推送
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force --all
   ```

3. **聯繫 GitHub 支援**：
   - 請求從緩存中刪除敏感信息

---

## 🔐 生成安全的密鑰

### JWT Secret
```bash
# 使用 Node.js 生成 64 字節隨機字符串
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 數據庫密碼
```bash
# 使用 openssl 生成強密碼
openssl rand -base64 32
```

---

## 📋 環境變數管理最佳實踐

### 開發環境

1. **本地開發**：
   ```bash
   # 複製模板
   cp .env.example .env
   
   # 編輯並填入實際值
   nano .env
   ```

2. **團隊協作**：
   - 使用密碼管理器（如 1Password、Bitwarden）共享敏感信息
   - 通過安全渠道（加密消息）分享，不要使用電子郵件

### 生產環境

1. **使用環境變數**：
   - Docker: 使用 `docker-compose.yml` 的 `env_file` 或環境變數
   - Cloud: 使用雲服務提供商的秘密管理（AWS Secrets Manager、Azure Key Vault）
   - Kubernetes: 使用 Secrets

2. **不要在代碼中硬編碼**：
   ```typescript
   // ❌ 錯誤
   const apiKey = 'sk-1234567890abcdef';
   
   // ✅ 正確
   const apiKey = process.env.API_KEY;
   ```

---

## 🔍 定期安全審查

### 每月檢查：
- [ ] 審查 `.gitignore` 文件
- [ ] 檢查 Git 歷史是否有敏感信息洩漏
- [ ] 輪換密碼和 API 密鑰
- [ ] 審查訪問日誌

### 部署前檢查：
- [ ] 確認 `.env` 未被追蹤
- [ ] 驗證生產環境變數已設置
- [ ] 測試應用程序可以正常讀取環境變數
- [ ] 確認沒有硬編碼的敏感信息

---

## 🛡️ Supabase 特定安全建議

### 1. 密碼管理
- 定期更換數據庫密碼（每 90 天）
- 使用強密碼（至少 32 字符）
- 不要在多個服務使用相同密碼

### 2. API 密鑰類型

- **Anon Key** (`SUPABASE_ANON_KEY`):
  - 可以在前端使用
  - 受 Row Level Security (RLS) 保護
  - 相對安全，但仍應小心

- **Service Role Key** (`SUPABASE_SERVICE_KEY`):
  - ⚠️ 僅在後端使用
  - 擁有完全訪問權限
  - 永遠不要暴露在前端代碼中
  - 永遠不要提交到 Git

### 3. 連接字符串類型

- **Direct Connection**: 
  - 用於數據庫遷移
  - 格式: `db.[project-ref].supabase.co:5432`
  
- **Connection Pooler**:
  - 用於應用程序連接
  - 格式: `aws-0-[region].pooler.supabase.com:6543`

---

## 📝 當前項目配置

### ✅ 已實施的安全措施：

1. ✅ `.env` 已添加到 `.gitignore`
2. ✅ 創建了 `.env.example` 模板
3. ✅ `.env` 文件從未被提交到 Git
4. ✅ 創建了安全配置文檔

### 📋 配置文件結構：

```
backend/
├── .env                      # 包含實際密鑰（不提交）
├── .env.example              # 模板（可以提交）
├── .env.production.example   # 生產環境模板（可以提交）
└── .gitignore                # 包含 .env
```

### 🔑 敏感信息清單：

當前項目中需要保密的信息：
- Supabase 數據庫密碼
- Supabase Anon Key
- JWT Secret
- 任何未來添加的 API 密鑰

---

## 🆘 緊急響應計劃

如果發現敏感信息已經洩露：

1. **立即行動**（在 1 小時內）：
   - [ ] 更改所有暴露的密碼
   - [ ] 撤銷並重新生成 API 密鑰
   - [ ] 檢查訪問日誌是否有異常活動

2. **短期行動**（在 24 小時內）：
   - [ ] 從 Git 歷史中刪除敏感信息
   - [ ] 通知團隊成員
   - [ ] 審查可能受影響的系統

3. **長期行動**（在 1 週內）：
   - [ ] 實施額外的安全措施
   - [ ] 進行安全審計
   - [ ] 更新安全流程和文檔

---

## 📚 相關資源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Supabase Security Guide](https://supabase.com/docs/guides/platform/security)
- [12-Factor App: Config](https://12factor.net/config)

---

## ✅ 快速檢查命令

```bash
# 檢查 .env 是否被追蹤
git ls-files | grep .env

# 應該返回空結果（如果 .env 正確被忽略）

# 檢查是否有密碼在代碼中
git grep -i "password" -- "*.ts" "*.js" "*.tsx" "*.jsx"

# 應該只找到變數名，不應該有實際密碼
```

---

**記住**：安全是持續的過程，不是一次性的任務！🛡️
