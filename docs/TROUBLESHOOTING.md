# HAPPY SHARE 問題排查指南

> **🚨 重要規範**：
> 
> **所有技術問題的診斷和解決方案必須記錄在此文檔中！**
> 
> - ✅ **TROUBLESHOOTING.md** → 所有問題的診斷步驟、原因分析、解決方案
> - ✅ **開發文件.md** → 僅記錄簡短摘要 + 引用 TROUBLESHOOTING.md 章節號
> - ✅ **\*_SUMMARY.md** → 重大問題的獨立深度總結（可選）
>
> **記錄原則**：
> 1. 問題發生 → 先在 TROUBLESHOOTING.md 中搜尋是否已有解決方案
> 2. 解決後 → 在 TROUBLESHOOTING.md 中詳細記錄（使用下方模板）
> 3. 摘要 → 在開發文件.md 中添加一句話摘要 + 引用章節號
> 4. 歸檔 → 重大問題可選創建獨立 SUMMARY.md 文檔

---

## 📌 故障排查流程

### 遇到問題時的標準流程

```
1. 🔍 搜尋本文檔
   └─ 使用 Ctrl+F 搜尋錯誤訊息關鍵字
   └─ 檢查對應分類章節
   └─ 查看類似問題的解決方案

2. 🧪 嘗試解決
   └─ 按文檔中的步驟操作
   └─ 記錄嘗試結果

3. 📝 記錄新問題（如果文檔中沒有）
   └─ 使用下方的【問題記錄模板】
   └─ 添加到對應分類章節（§ 3.X, § 4.X 等）
   └─ 在開發文件.md 添加簡短引用
   └─ 提交到版本控制

4. ⚠️ 不要在開發文件.md 中寫詳細的診斷和解決步驟！
   └─ 開發文件.md 只記錄「發生了什麼」和「在哪裡查看詳情」
   └─ 詳細內容必須在 TROUBLESHOOTING.md 中
```

### 快速搜尋關鍵字建議

| 問題類型 | 搜尋關鍵字 |
|---------|-----------|
| 導航錯誤 | `NAVIGATE`, `Screen`, `Navigator` |
| API 錯誤 | `404`, `500`, `API`, `fetch`, `axios` |
| 資料庫 | `Prisma`, `P1001`, `P2024`, `database`, `connection`, `pool` |
| 編譯錯誤 | `TypeScript`, `type`, `undefined`, `module` |
| 樣式問題 | `View`, `Text`, `StyleSheet`, `layout` |
| 環境配置 | `.env`, `config`, `port`, `CORS` |

---

## 📝 問題記錄模板

**當遇到新問題並成功解決後，請按此格式添加到對應章節**：

```markdown
### X.X 問題簡述（一句話描述）

**錯誤訊息**：
```
完整的錯誤訊息（複製原文）
```

**問題現象**：
- 描述問題出現時的情況
- 影響範圍
- 觸發條件

**問題原因**：
- 根本原因分析
- 為什麼會發生

**診斷步驟**：
```bash
# 列出診斷命令
command-to-check-issue
```

**解決方案**：

**方案 A（推薦）**：
```typescript
// 修改前
舊代碼

// 修改後
新代碼
```

**方案 B（備選）**：
```bash
# 替代方案
alternative-solution
```

**驗證測試**：
```bash
# 如何確認問題已解決
test-command
```

**相關文件**：
- `path/to/file1.ts`
- `path/to/file2.ts`

**記錄時間**：YYYY-MM-DD
**解決時長**：X 小時/分鐘
**優先級**：🔴高 / ⚠️中 / 💡低

---
```

### 記錄範例

參考本文檔中的 [3.3 Prisma P1001 錯誤 - WSL2 + Supabase 連接問題](#33-prisma-p1001-錯誤---wsl2--supabase-連接問題-) 作為完整範例。

---

## 目錄

1. [導航與路由問題](#1-導航與路由問題)
2. [API 與網路請求問題](#2-api-與網路請求問題)
3. [資料庫與後端問題](#3-資料庫與後端問題)
4. [快取與瀏覽器問題](#4-快取與瀏覽器問題)
5. [React Native 與 Expo 問題](#5-react-native-與-expo-問題)
6. [TypeScript 類型問題](#6-typescript-類型問題)
7. [環境配置問題](#7-環境配置問題)

---

## 1. 導航與路由問題

### 1.1 導航錯誤：Screen 未註冊（The action 'NAVIGATE' was not handled）

**錯誤訊息**：
```
The action 'NAVIGATE' with payload {"name":"Search"} was not handled by any navigator.
```

**問題原因**：
- Screen 組件未在 Navigator 中註冊
- **常見陷阱**：項目中存在多個同名配置文件，修改了錯誤的文件

**診斷步驟**：
1. **確認實際使用的配置文件**
   ```bash
   # 搜尋所有同名文件
   find . -name "App.tsx"
   
   # 檢查入口文件的導入
   cat frontend/index.ts | grep "import App"
   ```

2. **檢查文件導入路徑**
   - `import App from './App'` → 指向 `frontend/App.tsx`（根目錄）
   - `import App from './src/App'` → 指向 `frontend/src/App.tsx`

3. **確認 Screen 註冊**
   ```tsx
   // 檢查是否有對應的 Screen 定義
   <Stack.Screen name="Search" component={SearchScreen} />
   ```

**解決方案**：

**方案 A：修復雙文件問題（推薦）**
```bash
# 1. 找出所有 App.tsx
find . -name "App.tsx"

# 2. 確認入口文件導入
cat frontend/index.ts

# 3. 修改正確的文件（系統實際使用的）
# 如果 index.ts 導入 './App'，則修改 frontend/App.tsx

# 4. 建議刪除多餘文件避免混淆
mv frontend/src/App.tsx frontend/src/App.tsx.backup
```

**方案 B：添加缺失的 Screen**
```tsx
// frontend/App.tsx (根目錄)
import { SearchScreen } from "./src/screens/SearchScreen";
import { TagPostsScreen } from "./src/screens/TagPostsScreen";

<Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
  {/* 現有 Screens */}
  
  {/* 添加缺失的 Screens */}
  <Stack.Screen 
    name="Search" 
    component={SearchScreen}
    options={{ 
      title: "搜尋",
      header: (props) => <HeaderBar {...props} title="搜尋" />
    }}
  />
  <Stack.Screen 
    name="TagPosts" 
    component={TagPostsScreen}
    options={{ 
      title: "標籤",
      header: (props) => <HeaderBar {...props} title="標籤" />
    }}
  />
</Stack.Navigator>
```

**驗證修復**：
```bash
# 1. 清除快取
cd frontend
rm -rf .expo .expo-shared node_modules/.cache

# 2. 重啟服務
pkill -9 -f "expo|metro"
npm run dev:frontend

# 3. 等待編譯完成後測試導航
```

**預防措施**：
- ✅ 定期檢查是否有重複的配置文件
- ✅ 統一文件命名和目錄結構
- ✅ 使用 `find` 命令確認文件位置
- ✅ 參考歷史記錄（docs/開發文件.md）

**相關記錄**：
- 2025-10-27：首次遇到雙文件問題
- 2025-11-01：再次遇到，已在開發文件中詳細記錄

---

### 3.1 靜態 sleep（例如 sleep 5）導致測試或自動化卡住

**問題現象**：
- 測試腳本中使用固定的 `sleep 5`、`sleep 10` 等等待，偶爾會在等待結束後「無反應」或服務尚未就緒導致後續請求失敗。

**根本原因**：
- 固定等待依賴啟動時間是恆定的，但服務啟動時間受主機負載、資料庫初始化或熱重載等因素影響，容易導致競態條件。

**建議做法（優先順序）**：
1. 使用「等待條件」（wait-for condition）替代固定 sleep：
   - 對於後端服務，先檢查 TCP 端口是否可連線（`/dev/tcp` 或 `nc -z`），再以短輪詢確認 HTTP 請求可接通。
   - 對於前端測試（Chrome MCP / Playwright / Puppeteer），等待特定 DOM 元素或導航事件（例如等待 selector、network idle 或 navigation event），不要用固定 sleep。
2. 若需重試，使用可配置且有限次數的重試機制，並採用指數退避或固定退避（參考資料庫連線重試策略）。
3. 在腳本中提供清晰的超時與錯誤訊息，超時後回傳非 0 狀態以便 CI/自動化能感知失敗。

**範例（shell）**：
```bash
# 等待 TCP 端口
wait_for_port() {
  local host=${1:-localhost}
  local port=${2:-5000}
  local retries=${3:-60}
  local i=0
  while ! (echo > /dev/tcp/${host}/${port}) >/dev/null 2>&1; do
    i=$((i+1))
    if [ "$i" -ge "$retries" ]; then
      echo "Timeout waiting for ${host}:${port}"
      return 1
    fi
    sleep 1
  done
  return 0
}
``` 

**範例（Chrome MCP / Playwright）**：
```js
// 等待元素而非固定 sleep
await page.waitForSelector('#notification-icon', { timeout: 30000 });
```

**文件記錄**：
- 已在 `backend/scripts/dev-tests/test-search-api.sh` 中將固定 `sleep` 替換為 port/HTTP 檢查（見 repo 變更）。
- 如需更深入的測試流程範例，參見 `CHROME_MCP_TEST_REPORT.md` 與 `docs/開發文件.md` 的測試步驟摘要。


### 1.2 條件渲染 Screen 導致導航失敗

**問題現象**：
- 有時能導航，有時不能
- 登入前後導航行為不一致

**問題原因**：
使用條件渲染 Screen 導致某些 Screen 不在 Navigator 中

**錯誤示例**：
```tsx
<Stack.Navigator>
  {isAuthenticated && (
    <Stack.Screen name="Search" component={SearchScreen} />
  )}
</Stack.Navigator>
```

**正確做法**：
```tsx
// 方案 A：始終註冊所有 Screen，用 initialRouteName 控制起始頁
<Stack.Navigator 
  initialRouteName={isAuthenticated ? "Home" : "Login"}
>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Search" component={SearchScreen} />
  {/* 所有 Screens 都註冊 */}
</Stack.Navigator>

// 方案 B：在 Screen 內部檢查權限
export const SearchScreen = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="Login" />;
  }
  
  return <View>...</View>;
};
```

---

## 2. API 與網路請求問題

### 2.1 API 路徑重複（/api/api/... 404 錯誤）

**錯誤訊息**：
```
GET http://localhost:5000/api/api/users/123 404 (Not Found)
```

**問題原因**：
- `apiClient` 的 `baseURL` 已包含 `/api/`
- service 文件中路徑又加了 `/api/`
- 導致路徑重複

**診斷方法**：
```bash
# 搜尋可能有問題的路徑
grep -r "apiClient.get(\`/api/" frontend/src/services/
grep -r "apiClient.post(\`/api/" frontend/src/services/
```

**解決方案**：

**檢查配置**：
```typescript
// frontend/src/config/app.config.ts
export const appConfig = {
  api: {
    baseURL: 'http://localhost:5000/api', // ← 已包含 /api/
  }
};
```

**修改 service 文件**：
```typescript
// ❌ 錯誤：路徑包含 /api/
apiClient.get(`/api/users/${id}`);

// ✅ 正確：路徑不包含 /api/
apiClient.get(`/users/${id}`);
```

**批量修復**：
```typescript
// frontend/src/services/user.api.ts
export const userApi = {
  // 修改前
  getUser: (id: string) => apiClient.get(`/api/users/${id}`),
  updateUser: (id: string, data) => apiClient.put(`/api/users/${id}`, data),
  
  // 修改後
  getUser: (id: string) => apiClient.get(`/users/${id}`),
  updateUser: (id: string, data) => apiClient.put(`/users/${id}`, data),
};
```

**驗證修復**：
```bash
# 後端測試
curl http://localhost:5000/api/users/123

# 瀏覽器測試
# 打開 DevTools → Network 標籤
# 檢查請求 URL 應該是：
# ✅ http://localhost:5000/api/users/123
# ❌ http://localhost:5000/api/api/users/123
```

**預防措施**：
- 統一規範：service 路徑不包含 `/api/` 前綴
- 參考正確示例（如 `posts.api.ts`）
- 代碼審查時檢查路徑配置

**相關文件**：
- `frontend/API_PATH_GUIDE.md`：完整的路徑配置指南

---

### 2.2 前端顯示 500 錯誤但後端 API 正常

**錯誤訊息**：
```
Request failed with status code 500
GET http://localhost:5000/api/posts 500 (Internal Server Error)
```

**診斷步驟**：

**1. 確認後端是否真的有錯誤**
```bash
# 直接測試後端 API
curl -v http://localhost:5000/api/posts

# 應該看到：
# < HTTP/1.1 200 OK
# < Content-Type: application/json
# {"success":true,"data":{...}}
```

**2. 檢查後端日誌**
```bash
# 查看後端終端輸出
# 或查看日誌文件
tail -f /tmp/backend.log
```

**3. 檢查瀏覽器 DevTools**
- 打開 Network 標籤
- 點擊失敗的請求
- 查看 Response 標籤（後端實際響應）
- 查看 Headers 標籤（HTTP 狀態碼）

**可能原因和解決方案**：

**原因 A：瀏覽器快取問題**
- **現象**：後端測試正常，但瀏覽器報錯
- **解決**：
  ```bash
  # 清除前端快取
  cd frontend
  rm -rf .expo .expo-shared node_modules/.cache
  
  # 硬重載瀏覽器
  # Windows/Linux: Ctrl + Shift + R
  # Mac: Cmd + Shift + R
  ```

**原因 B：CORS 問題**
- **現象**：控制台顯示 CORS 錯誤
- **解決**：
  ```typescript
  // backend/src/main.ts
  app.enableCors({
    origin: true, // 開發環境允許所有來源
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  ```

**原因 C：認證 token 問題**
- **現象**：需要認證的端點返回 401
- **解決**：
  ```typescript
  // 檢查 token 是否正確設置
  const auth = await authStorage.getAuth();
  console.log('Token:', auth?.token);
  ```

**原因 D：請求參數格式錯誤**
- **檢查**：query parameters、request body 格式
- **解決**：對比 API 文檔確認格式正確

**驗證修復**：
```bash
# 1. 重啟後端
pkill -9 -f "nest|node.*backend"
cd backend && npm run start:dev

# 2. 重啟前端
pkill -9 -f "expo|metro"
cd frontend && npm start

# 3. 清除瀏覽器快取並測試
```

---

### 2.3 API 請求超時

**錯誤訊息**：
```
Error: timeout of 10000ms exceeded
```

**診斷**：
```typescript
// 檢查 timeout 設置
// frontend/src/services/api.client.ts
this.client = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: 10000, // ← 當前超時設置
});
```

**解決方案**：

**方案 A：增加超時時間**
```typescript
timeout: 30000, // 改為 30 秒
```

**方案 B：優化後端性能**
- 添加數據庫索引
- 優化查詢語句
- 使用分頁限制返回數據量

**方案 C：添加載入狀態**
```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    await api.getData();
  } finally {
    setLoading(false);
  }
};
```

---

## 3. 資料庫與後端問題

### 3.1 Prisma 連接失敗

**錯誤訊息**：
```
Error: Can't reach database server
```

**診斷步驟**：
```bash
# 1. 檢查環境變數
cat backend/.env | grep DATABASE_URL

# 2. 測試數據庫連接
npx prisma db push --preview-feature

# 3. 檢查 Prisma Client
npx prisma generate
```

**解決方案**：

**確認 DATABASE_URL 格式**：
```env
# PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

**重新生成 Prisma Client**：
```bash
cd backend
npx prisma generate
npx prisma db push
npm run start:dev
```

---

### 3.2 搜尋返回空結果

**問題現象**：
- 搜尋 API 返回空陣列
- 資料庫中有數據但搜不到

**診斷方法**：
```sql
-- 直接在資料庫中測試搜尋
SELECT * FROM "Post" 
WHERE to_tsvector('simple', title || ' ' || content) 
@@ to_tsquery('simple', 'react');
```

**可能原因**：

**原因 A：搜尋語法錯誤**
```typescript
// ❌ 錯誤：特殊字符未處理
const query = "react native"; // 空格會導致錯誤

// ✅ 正確：使用 & 連接
const query = "react&native";
```

**原因 B：語言配置不匹配**
```typescript
// 使用 'simple' 配置支援多語言
to_tsvector('simple', content)
```

---

### 3.3 Prisma P1001 錯誤 - WSL2 + Supabase 連接問題 ⭐

**錯誤訊息**：
```
PrismaClientInitializationError: P1001: Can't reach database server at `aws-1-ap-southeast-1.pooler.supabase.com`:`5432`
```

**問題根源**：
- Supabase **Direct Connection** 僅支持 IPv6
- **WSL2** (Windows Subsystem for Linux) 對 IPv6 支持有限
- 導致無法建立數據庫連接

**關鍵發現**（來自 Supabase Dashboard）:
```
⚠️ Direct Connection: "Not IPv4 compatible"
💡 建議: "Use Session Pooler if on a IPv4 network"
```

---

#### 四次嘗試記錄

**嘗試 1: 原始 Pooler** ❌ 失敗
```bash
DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```
- ✅ 網絡測試: 成功
- ❌ Prisma 連接: P1001 錯誤
- **失敗原因**: 配置或權限問題

---

**嘗試 2: Direct Connection** ❌ 失敗
```bash
DATABASE_URL="postgresql://postgres:PASSWORD@db.jpcdablvabnuqdmneqnd.supabase.co:5432/postgres"
```

**測試命令**：
```bash
$ nc -zv db.jpcdablvabnuqdmneqnd.supabase.co 5432
nc: connect to db.jpcdablvabnuqdmneqnd.supabase.co port 5432 (tcp) failed: Network is unreachable
```

- ❌ 網絡測試: DNS 解析失敗（IPv6 only）
- ❌ 後端啟動: P1001 錯誤
- **失敗原因**: **WSL2 無法連接 IPv6 端點**

---

**嘗試 3: Transaction Pooler** ❌ 失敗
```bash
DATABASE_URL="postgresql://postgres.jpcdablvabnuqdmneqnd:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

**測試命令**：
```bash
$ nc -zv aws-1-ap-southeast-1.pooler.supabase.com 6543
Connection to aws-1-ap-southeast-1.pooler.supabase.com (13.213.241.248) 6543 port [tcp/*] succeeded!
```

- ✅ 網絡連接: 成功
- ✅ 後端啟動: 成功
- ❌ Prisma 連接: 身份驗證失敗

**錯誤信息**：
```
PrismaClientInitializationError: Error querying the database: 
FATAL: Tenant or user not found
```

- **失敗原因**: Transaction Pooler 用戶名格式不匹配

---

**嘗試 4: Session Pooler** ✅ 成功！
```bash
DATABASE_URL="postgresql://postgres.jpcdablvabnuqdmneqnd:PASSWORD@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

**完整配置 (backend/.env)**：
```bash
# Database - Session Pooler (IPv4 Compatible)
DATABASE_URL="postgresql://postgres.jpcdablvabnuqdmneqnd:e4vycDLP26CimmQC@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=*
```

**驗證測試**：

1. **網絡連接**: ✅
   ```bash
   $ nc -zv aws-1-ap-southeast-1.pooler.supabase.com 5432
   Connection to aws-1-ap-southeast-1.pooler.supabase.com (13.213.241.248) 5432 port [tcp/postgresql] succeeded!
   ```

2. **後端啟動**: ✅
   ```
   ✅ Prisma connected to database
   [Nest] 99360 - LOG [NestApplication] Nest application successfully started +442ms
   🚀 Application is running on: http://localhost:5000/api
   ```

3. **API 測試**: ✅
   ```bash
   # TypeScript 搜索
   $ curl http://localhost:5000/api/search/suggestions?q=TypeScript
   {"success":true,"data":{"suggestions":[{"text":"TypeScript 最佳實踐","type":"post"}]}}
   
   # 用戶搜索
   $ curl http://localhost:5000/api/search/suggestions?q=alice
   {"success":true,"data":{"suggestions":[{"text":"Alice Wang","type":"user","avatar":"..."}]}}
   ```

---

#### Supabase 連接類型比較

| 連接類型 | 端口 | IPv4/IPv6 | 用戶名格式 | 適用場景 | WSL2 兼容 |
|---------|------|-----------|-----------|---------|-----------|
| **Direct Connection** | 5432 | ❌ IPv6 only | `postgres` | 直接數據庫訪問 | ❌ 不兼容 |
| **Transaction Pooler** | 6543 | 混合 | `postgres.[ref]` | 無狀態短連接 | ⚠️ 認證問題 |
| **Session Pooler** | 5432 | ✅ **IPv4 Compatible** | `postgres.[ref]` | 有狀態長連接 | ✅ **完全兼容** |

**關鍵配置要點**：
- **主機名**: `aws-1-ap-southeast-1.pooler.supabase.com` (Pooler 端點)
- **端口**: `5432` (Session mode，不是 6543)
- **用戶名**: `postgres.<project_ref_id>` (附加專案參考 ID)

**用戶名格式規則**：
- Direct Connection: `postgres`
- Pooler (Transaction/Session): `postgres.<project_ref_id>`
- 專案參考 ID 在 Supabase Dashboard 連接字符串中可找到

---

#### 解決方案步驟

**Step 1: 獲取正確的連接字符串**

1. 登錄 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案
3. 前往: **Project Settings** → **Database** → **Connection Info**
4. 選擇: **"Connection pooling"** → **"Session mode"**
5. **直接複製官方提供的完整字符串**

**Step 2: 更新環境變量**

```bash
cd backend

# 創建備份
cp .env .env.backup

# 更新 .env
nano .env
```

```env
DATABASE_URL="postgresql://postgres.<project-ref>:<password>@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

**Step 3: 驗證連接**

```bash
# 1. 測試網絡連接
nc -zv aws-1-ap-southeast-1.pooler.supabase.com 5432

# 2. 清理舊進程
ps aux | grep -E "node.*dist/main|nest.*start" | awk '{print $2}' | xargs -r kill -9

# 3. 重啟後端
npm run start:prod

# 4. 檢查日誌
tail -f backend.log | grep "Prisma\|Application"

# 5. 測試 API
curl http://localhost:5000/api/search/suggestions?q=test
```

---

#### 故障排查清單

如果仍然無法連接，按順序檢查：

**✓ 檢查項目 1: 網絡連接**
```bash
nc -zv aws-1-ap-southeast-1.pooler.supabase.com 5432
# 預期結果: Connection succeeded
```

**✓ 檢查項目 2: 用戶名格式**
```bash
# Session Pooler 必須使用: postgres.<project-ref>
# 不是: postgres
echo $DATABASE_URL | grep "postgres\."
```

**✓ 檢查項目 3: 端口號**
```bash
# Session Pooler: 5432
# Transaction Pooler: 6543
echo $DATABASE_URL | grep ":5432/"
```

**✓ 檢查項目 4: 密碼正確性**
```bash
# 確認密碼沒有特殊字符轉義問題
# 如有特殊字符，可能需要 URL 編碼
```

**✓ 檢查項目 5: 環境變量加載**
```bash
# 確認 .env 被正確加載
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

---

#### 最佳實踐

**開發環境推薦**：

| 環境 | 推薦連接方式 | 原因 |
|------|------------|------|
| **WSL2** | Session Pooler | IPv4 compatible ✅ |
| **Docker** | Session Pooler | 網絡隔離，IPv4 穩定 |
| **原生 Linux/Mac** | Direct Connection 或 Session Pooler | 支持 IPv6 |
| **Windows 原生** | Session Pooler | 網絡兼容性最佳 |

**安全提示**：
```bash
# ⚠️ 不要將 .env 提交到 Git
echo ".env" >> .gitignore

# ✅ 創建示例文件
cp .env .env.example
# 然後手動移除敏感信息
```

**部署提示**：
```bash
# 生產環境應使用環境變量，不是 .env 文件
# Vercel/Netlify: 在 Dashboard 設置
# Docker: 使用 docker-compose.yml 或 --env-file
# Kubernetes: 使用 ConfigMap/Secret
```

---

#### 常見問題 FAQ

**Q1: 為什麼 Direct Connection 在 WSL2 上不工作？**

A: Supabase Direct Connection 僅支持 IPv6。WSL2 對 IPv6 支持有限，導致無法建立連接。解決方案：使用 **Session Pooler**（IPv4 compatible）。

---

**Q2: "Tenant or user not found" 錯誤怎麼辦？**

A: 這是用戶名格式問題：
- ❌ 錯誤: `postgres:password@...`
- ✅ 正確: `postgres.<project-ref>:password@...`

---

**Q3: Session Pooler 和 Transaction Pooler 有什麼區別？**

| 特性 | Session Pooler | Transaction Pooler |
|------|----------------|-------------------|
| 端口 | 5432 | 6543 |
| 連接模式 | 長連接 | 短連接 |
| 狀態保持 | ✅ 有狀態 | ❌ 無狀態 |
| 適用場景 | 傳統應用 | Serverless 函數 |
| WSL2 兼容 | ✅ 完全支持 | ⚠️ 可能有認證問題 |

---

**Q4: 如何確認我使用的是哪種連接？**

```bash
# 檢查 DATABASE_URL
echo $DATABASE_URL

# Direct Connection 特徵:
# - 主機名: db.<project-ref>.supabase.co
# - 端口: 5432
# - 用戶名: postgres

# Session Pooler 特徵:
# - 主機名: aws-*-*.pooler.supabase.com
# - 端口: 5432
# - 用戶名: postgres.<project-ref>

# Transaction Pooler 特徵:
# - 主機名: aws-*-*.pooler.supabase.com
# - 端口: 6543
# - 用戶名: postgres.<project-ref>
```

---

**Q5: 測試連接的完整流程是什麼？**

```bash
# 1. 測試 DNS 解析
nslookup aws-1-ap-southeast-1.pooler.supabase.com

# 2. 測試網絡連接
nc -zv aws-1-ap-southeast-1.pooler.supabase.com 5432

# 3. 測試應用連接
cd backend
npm run start:prod

# 4. 檢查日誌
tail -50 backend.log | grep -E "Prisma|Application|error"

# 5. 測試 API
curl http://localhost:5000/api/search/suggestions?q=test
```

---

#### 時間線參考

解決此問題總時長約 **3 小時**（2025-11-01 20:30 - 23:50）：

| 階段 | 時間 | 活動 |
|------|------|------|
| 問題發現 | 30 分鐘 | 發現 P1001 錯誤，初步診斷 |
| 第一輪測試 | 60 分鐘 | 測試原始配置，檢查環境變量 |
| 新憑證測試 | 30 分鐘 | Direct Connection 失敗（IPv6） |
| Transaction Pooler | 30 分鐘 | 網絡成功但認證失敗 |
| 最終突破 | 30 分鐘 | Session Pooler 配置成功 ✅ |

**關鍵轉折點**: 用戶提供 Supabase Dashboard 截圖，發現 "Not IPv4 compatible" 提示。

---

#### 相關資源

- [Supabase Database Connection Documentation](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Prisma Connection Troubleshooting](https://www.prisma.io/docs/guides/database/troubleshooting-database-connection-issues)
- [WSL2 Networking Limitations](https://docs.microsoft.com/en-us/windows/wsl/networking)
- [PostgreSQL Connection Pooling](https://www.postgresql.org/docs/current/runtime-config-connection.html)

---

**記錄時間**: 2025-11-01 23:50
**狀態**: ✅ 問題已解決
**解決方案**: Session Pooler (IPv4 Compatible)
**適用環境**: WSL2, Docker, Windows 原生

---

### 3.4 Prisma 連接池超時 - 並發查詢導致連接耗盡 ⭐⭐

**錯誤訊息**：
```
PrismaClientKnownRequestError: P2024
Timed out fetching a new connection from the connection pool
(Current connection pool timeout: 10, connection limit: 5)
```

**問題症狀**：
- ✅ 第一次 API 查詢成功（HTTP 200）
- ❌ 後續查詢全部失敗（HTTP 500）
- ❌ 需要重啟後端才能恢復
- ⚠️ 健康檢查顯示連接正常，但查詢仍失敗

**問題根源**：
1. **連接池默認配置太小** (`connection_limit=5`)
2. **並發查詢消耗多個連接** (Promise.all 同時查詢3個表)
3. **超時設置過短** (`pool_timeout=10秒`)
4. **連接未正確釋放或重用**

---

#### 診斷步驟

**Step 1: 確認錯誤類型**

檢查後端日誌中是否有以下錯誤：
```bash
tail -50 backend/backend.log | grep -E "P2024|connection pool|timeout"
```

錯誤特徵：
```
Invalid `this.prisma.xxx.findMany()` invocation
Timed out fetching a new connection from the connection pool
connection_limit: 5
timeout: 10
```

**Step 2: 檢查並發查詢模式**

檢查代碼中是否使用 `Promise.all` 進行並發數據庫查詢：
```typescript
// ❌ 問題代碼：同時需要3個連接
const [tags, users, posts] = await Promise.all([
  this.prisma.tag.findMany({ ... }),    // 連接 1
  this.prisma.user.findMany({ ... }),   // 連接 2
  this.prisma.post.findMany({ ... }),   // 連接 3
]);
// 如果連接池只有5個，剩餘2個無法滿足多個並發請求
```

**Step 3: 連續測試驗證**

```bash
# 連續測試10次
for i in {1..10}; do 
  echo "Test $i"
  curl -s http://localhost:5000/api/search/suggestions?q=test | \
  python3 -c "import sys, json; print('Success' if json.load(sys.stdin).get('success') else 'Failed')"
done
```

**預期結果**：
- **修復前**: 1-2次成功，後續全部失敗
- **修復後**: 10次全部成功

---

#### 解決方案

**方案 1: 優化連接池參數** ✅ **推薦**

修改 `backend/.env`:
```env
# 修復前
DATABASE_URL="postgresql://...@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

# 修復後 - 添加連接池參數
DATABASE_URL="postgresql://...@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?connection_limit=20&pool_timeout=20&connect_timeout=30"
```

**參數說明**：
- `connection_limit=20`: 連接池大小（默認5 → 20）
- `pool_timeout=20`: 獲取連接超時（默認10秒 → 20秒）
- `connect_timeout=30`: 建立連接超時（新增）

**連接池大小計算公式**：
```
推薦值 = (CPU核心數 × 2 + 1) + 並發查詢數 + 預留
       = (4 × 2 + 1) + 3 + 5
       = 17 ≈ 20
```

---

**方案 2: 實現自動重試機制** ✅ **推薦**

修改 `backend/src/prisma/prisma.service.ts`:

```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * 執行帶自動重試的查詢
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        const isConnectionError = 
          error.code === 'P1001' ||  // 無法連接
          error.code === 'P1017' ||  // 連接關閉
          error.code === 'P2024' ||  // 連接池超時
          error.message?.includes("Can't reach database server");

        if (isConnectionError && attempt < maxRetries) {
          this.logger.warn(
            `🔄 Query failed (attempt ${attempt}/${maxRetries}), retrying...`
          );
          
          // 重新連接
          await this.$disconnect();
          await new Promise(resolve => setTimeout(resolve, 500));
          await this.$connect();
          
          // 指數退避
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        } else {
          throw error;
        }
      }
    }
    throw new Error('Query failed after all retries');
  }
}
```

**使用方式**：
```typescript
// 在搜索引擎中使用
async getSuggestions(query: string): Promise<Suggestion[]> {
  return this.prisma.executeWithRetry(async () => {
    const [tags, users, posts] = await Promise.all([...]);
    return [...];
  });
}
```

---

**方案 3: 添加健康檢查**

創建 `backend/src/health/health.controller.ts`:
```typescript
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get('db')
  async databaseCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
```

**測試健康檢查**：
```bash
curl http://localhost:5000/api/health/db
# 預期: {"status":"healthy","database":"connected"}
```

---

**方案 4: 定期健康檢查（保持連接活躍）**

在 `PrismaService` 中添加：
```typescript
private startHealthCheck(): void {
  this.healthCheckInterval = setInterval(async () => {
    try {
      await this.$queryRaw`SELECT 1`;
      this.logger.debug('💚 Database health check passed');
    } catch (error) {
      this.logger.error('💔 Database health check failed');
      await this.reconnect();
    }
  }, 30000); // 每30秒檢查一次
}
```

---

#### 完整實施步驟

**Step 1: 更新連接URL**
```bash
cd backend
nano .env
# 添加 ?connection_limit=20&pool_timeout=20&connect_timeout=30
```

**Step 2: 更新 PrismaService**
```bash
# 複製上面的 executeWithRetry 方法到 prisma.service.ts
nano src/prisma/prisma.service.ts
```

**Step 3: 重新編譯和部署**
```bash
# 停止舊進程
pkill -9 -f "node.*dist/main"

# 重新編譯
npm run build

# 重新生成 Prisma Client
npx prisma generate

# 啟動
npm run start:prod
```

**Step 4: 驗證修復**
```bash
# 測試健康檢查
curl http://localhost:5000/api/health/db

# 連續測試10次
for i in {1..10}; do 
  echo "Test $i"
  curl -s http://localhost:5000/api/search/suggestions?q=alice
done
```

---

#### 測試結果

**修復前**：
```bash
測試 10 次連續查詢:
✅ Test 1: Success
❌ Test 2-10: Failed (500 Error)
成功率: 10%
```

**修復後**：
```bash
測試 10 次連續查詢:
✅✅✅✅✅✅✅✅✅✅ 10/10 Success
成功率: 100% 🎉
```

**性能改進**：

| 指標 | 修復前 | 修復後 | 改進 |
|------|--------|--------|------|
| 連接池大小 | 5 | 20 | +300% |
| 連接池超時 | 10秒 | 20秒 | +100% |
| 查詢成功率 | 10% | 100% | +900% |
| 啟動連接成功率 | 20% | 100% | +400% |
| 需要手動重啟 | 是 | 否 | N/A |

---

#### 經驗教訓

1. **連接池配置至關重要**
   - ❌ 不要依賴默認值（5個連接通常不夠）
   - ✅ 根據並發需求計算合適的連接池大小
   - ✅ 預留 20-30% 緩衝空間

2. **並發查詢要預留足夠連接**
   - ❌ `Promise.all` 會同時消耗多個連接
   - ✅ 確保 `連接池大小 > 最大並發查詢數`
   - ✅ 或改用串行執行非關鍵查詢

3. **健康檢查是必要的**
   - ✅ 定期檢查連接狀態（每30秒）
   - ✅ 自動重連比手動重啟好
   - ✅ 提供健康檢查 API 便於監控

4. **重試機制提高穩定性**
   - ✅ 網絡波動不應導致整個請求失敗
   - ✅ 指數退避避免雪崩效應
   - ✅ 限制重試次數防止死循環

5. **Session Pooler vs Transaction Pooler**
   - **Session Pooler**: 適合短連接、多查詢（本項目）
   - **Transaction Pooler**: 適合長連接、事務操作
   - **選擇依據**: 查詢模式和持續時間

---

#### 相關資源

- [Prisma Connection Pooling](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [PostgreSQL Connection Pool Best Practices](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [Supabase Connection Pooling Guide](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- 完整修復總結: `DATABASE_CONNECTION_FIX_SUMMARY.md`
- 測試報告: `SEARCH_SUGGESTIONS_TEST_REPORT.md`

---

**記錄時間**: 2025-11-02 01:15
**狀態**: ✅ 問題已完全解決
**解決方案**: 連接池參數優化 + 自動重試機制 + 健康檢查
**修復耗時**: 約 45 分鐘
**適用環境**: 所有使用 Prisma + Supabase Session Pooler 的環境

---

**原因 C：數據未正確索引**
```sql
-- 檢查是否需要創建索引
CREATE INDEX idx_post_search 
ON "Post" 
USING gin(to_tsvector('simple', title || ' ' || content));
```

---

### 3.5 N+1 查詢導致連接池快速耗盡 ⭐⭐⭐

**錯誤訊息**：
```
PrismaClientKnownRequestError: P2024
Timed out fetching a new connection from the connection pool
(Current connection pool timeout: 20, connection_limit: 20)
at PostsService.getPosts (dist/main.js:1244:32)
```

**前端錯誤**：
```javascript
AxiosError: timeout of 10000ms exceeded
Failed to load posts
```

**問題現象**：
- ✅ 後端健康檢查顯示 "healthy" 和 "database connected"
- ❌ 但 POST `/api/posts` 請求返回 500 錯誤
- ❌ 前端在 10 秒後超時
- ❌ 連接池的 20 個連接全部耗盡
- ⚠️ 重啟後端可暫時緩解，但問題很快復發

**根本原因**：
1. **N+1 查詢問題** - 為每篇文章單獨查詢點讚和收藏狀態
2. **未使用連接重試機制** - 直接調用 `prisma.*` 而不是 `prisma.executeWithRetry`
3. **並發查詢過多** - 10 篇文章 × 2 查詢/篇 + 2 初始查詢 = **22 個並發連接**

**錯誤的代碼**（PostsService.getPosts）：
```typescript
// ❌ 錯誤：為每篇文章單獨查詢（N+1 問題）
const postsWithInteractions = await Promise.all(
  posts.map(async (post) => {
    if (currentUserId) {
      const [isLiked, isBookmarked] = await Promise.all([
        this.prisma.like.findUnique({...}),      // 查詢 1
        this.prisma.bookmark.findUnique({...}),  // 查詢 2
      ]);
      // 10 篇文章 × 2 = 20 個並發查詢！
    }
  })
);
```

**診斷步驟**：

```bash
# 1. 檢查後端日誌
tail -50 backend/backend.log | grep -A 10 "Error\|P2024"

# 2. 測試 API 端點
curl -s "http://localhost:5000/api/posts?page=1&limit=10"

# 3. 檢查連接池配置
cat backend/.env | grep DATABASE_URL
# 應該看到: connection_limit=20&pool_timeout=20

# 4. 檢查 PostsService 代碼
grep -A 30 "async getPosts" backend/src/posts/posts.service.ts
```

**解決方案**：

**1. 批量查詢代替 N+1**：
```typescript
// ✅ 正確：一次查詢所有點讚和收藏
if (currentUserId && posts.length > 0) {
  const postIds = posts.map(p => p.id);
  
  // 只用 2 個查詢而不是 N*2 個
  const [likes, bookmarks] = await Promise.all([
    this.prisma.like.findMany({
      where: {
        userId: currentUserId,
        postId: { in: postIds },  // ← 批量查詢
      },
      select: { postId: true },
    }),
    this.prisma.bookmark.findMany({
      where: {
        userId: currentUserId,
        postId: { in: postIds },  // ← 批量查詢
      },
      select: { postId: true },
    }),
  ]);

  // 用 Set 快速查找
  const likedPostIds = new Set(likes.map(l => l.postId));
  const bookmarkedPostIds = new Set(bookmarks.map(b => b.postId));

  postsWithInteractions = posts.map(post => ({
    ...post,
    isLiked: likedPostIds.has(post.id),
    isBookmarked: bookmarkedPostIds.has(post.id),
  }));
}
```

**2. 使用連接重試包裝**：
```typescript
// ✅ 整個方法包裹在 executeWithRetry 中
async getPosts(query: PostQueryDto, currentUserId?: string) {
  return await this.prisma.executeWithRetry(async () => {
    // 所有查詢邏輯
    const [posts, total] = await Promise.all([...]);
    // ...
    return { success: true, data: {...} };
  });
}
```

**實際修改的文件**：
```bash
backend/src/posts/posts.service.ts
  - getPosts() 方法：批量查詢 + executeWithRetry 包裝
  - getPost() 方法：executeWithRetry 包裝
```

**性能對比**：

| 方法 | 10 篇文章的查詢數 | 連接池壓力 |
|-----|-----------------|----------|
| ❌ N+1 查詢 | 22 個查詢 | **超過限制** (20 connections) |
| ✅ 批量查詢 | 4 個查詢 | **正常** (遠低於限制) |

**驗證步驟**：

```bash
# 1. 重新編譯
cd backend && npm run build

# 2. 重啟後端
pkill -9 -f "node.*dist/main" && npm run start:prod

# 3. 測試 API（應立即返回）
time curl -s "http://localhost:5000/api/posts?page=1&limit=10" | jq .success
# 應該 < 1 秒並返回 true

# 4. 連續測試 10 次（檢查連接池穩定性）
for i in {1..10}; do 
  curl -s "http://localhost:5000/api/posts?page=1&limit=2" > /dev/null
  echo "Test $i completed"
done

# 5. 檢查後端日誌無錯誤
tail -30 backend/backend.log | grep -i error
# 應該沒有 P2024 錯誤
```

**測試結果**：
```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": {
    "posts": [
      {
        "id": "...",
        "title": "讀書分享：原子習慣",
        "author": {"username": "bob", ...},
        "isLiked": false,       // ✅ 正確返回
        "isBookmarked": false   // ✅ 正確返回
      }
    ],
    "pagination": {...}
  }
}
```

**關鍵學習點**：

1. **N+1 查詢危害**
   - 在循環中執行查詢會快速耗盡連接池
   - 應該批量查詢然後在內存中映射

2. **連接池限制**
   - Session Pooler 有連接數限制（本項目：20）
   - 並發查詢數不應接近或超過限制

3. **批量查詢優化**
   ```sql
   -- ❌ N+1: 執行 N 次
   SELECT * FROM likes WHERE userId=? AND postId=?
   
   -- ✅ 批量: 執行 1 次
   SELECT * FROM likes WHERE userId=? AND postId IN (?,?,?,...)
   ```

4. **使用 Set 優化查找**
   - `Array.includes()`: O(n)
   - `Set.has()`: O(1)
   - 10 篇文章：Set 快 10 倍

5. **總是使用重試機制**
   - 網絡波動時自動重試
   - 連接池暫時耗盡時等待重試
   - 避免瞬時錯誤導致請求失敗

**相關問題**：
- § 3.4: 連接池超時（增加連接數）
- § 3.5: N+1 查詢（本節 - 減少查詢數）
- § 2.3: API 超時配置

**最佳實踐**：
```typescript
// ✅ Service 方法的標準模式
async getSomething(query, userId?) {
  return await this.prisma.executeWithRetry(async () => {
    // 1. 主查詢（盡量用 include 預加載）
    const items = await this.prisma.model.findMany({
      include: { relation: true }  // ← 預加載關聯
    });
    
    // 2. 批量查詢額外數據（如果需要）
    if (userId && items.length > 0) {
      const itemIds = items.map(i => i.id);
      const additionalData = await this.prisma.other.findMany({
        where: { itemId: { in: itemIds } }  // ← 批量查詢
      });
    }
    
    // 3. 在內存中組合結果
    return items.map(item => ({...}));
  });
}
```

---

**記錄時間**: 2025-11-02 01:45
**狀態**: ✅ 問題已完全解決
**解決方案**: N+1 查詢優化 + 批量查詢 + executeWithRetry 包裝
**修復耗時**: 約 30 分鐘（診斷 15 分鐘 + 修復 15 分鐘）
**適用環境**: 所有使用 Prisma 的 Node.js 應用
**性能提升**: 從 22 個並發查詢降至 4 個（**降低 82% 連接使用**）

---

## 4. 快取與瀏覽器問題

### 4.1 代碼已修改但瀏覽器仍顯示舊版本

**問題現象**：
- 修改了代碼並重啟服務
- 瀏覽器仍然執行舊代碼
- 錯誤依然存在

**原因**：
瀏覽器快取了舊的 JavaScript bundle

**解決方案**：

**方案 A：硬重載（最快）**
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**方案 B：完全清除快取**
1. 打開 DevTools (F12)
2. 右鍵點擊重新整理按鈕
3. 選擇「清除快取並強制重新整理」

**方案 C：清除所有網站數據**
1. DevTools → Application 標籤
2. Storage → Clear storage
3. 點擊「Clear site data」
4. 關閉並重新打開瀏覽器

**方案 D：開發時禁用快取**
1. 打開 DevTools (F12)
2. Network 標籤
3. 勾選「Disable cache」
4. 保持 DevTools 開啟狀態

**方案 E：清除 Metro bundler 快取**
```bash
cd frontend
rm -rf .expo .expo-shared node_modules/.cache
npm start -- --clear
```

**預防措施**：
- 開發時始終保持 DevTools 開啟並禁用快取
- 定期清除 Metro bundler 快取
- 使用版本號或 hash 防止生產環境快取問題

---

### 4.2 Service Worker 導致更新無效

**問題現象**：
- 部署新版本後用戶仍看到舊版本
- 需要多次重新整理才能看到更新

**解決方案**：
```typescript
// 配置 service worker 更新策略
// frontend/src/serviceWorkerRegistration.ts
export function register(config) {
  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    
    navigator.serviceWorker.register(swUrl).then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 新版本可用，提示用戶重新整理
              console.log('New content available; please refresh.');
            }
          }
        };
      };
    });
  });
}
```

---

## 5. React Native 與 Expo 問題

### 5.1 Expo 編譯錯誤

**錯誤訊息**：
```
Error: Unable to resolve module...
```

**解決步驟**：
```bash
# 1. 清除快取
cd frontend
rm -rf .expo .expo-shared node_modules/.cache

# 2. 重新安裝依賴
rm -rf node_modules
npm install

# 3. 重啟 Metro bundler
npm start -- --clear

# 4. 如果仍然失敗，檢查導入路徑
# 確保文件存在且路徑正確
```

---

### 5.2 React Native 廢棄警告

**警告訊息**：
```
Warning: props.pointerEvents is deprecated
Warning: "shadow*" style props are deprecated
Warning: useNativeDriver not supported
```

**解決方案**：

**pointerEvents 廢棄**
```tsx
// ❌ 舊寫法
<View pointerEvents="none" />

// ✅ 新寫法
<View style={{ pointerEvents: 'none' }} />
```

**shadow 屬性廢棄**
```tsx
// ❌ 舊寫法
<View
  shadowColor="#000"
  shadowOffset={{ width: 0, height: 2 }}
  shadowOpacity={0.25}
  shadowRadius={3.84}
/>

// ✅ 新寫法
<View style={{ boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)' }} />
```

**useNativeDriver 警告**
```typescript
// 添加條件檢查
Animated.timing(animation, {
  toValue: 1,
  duration: 300,
  useNativeDriver: Platform.OS !== 'web', // Web 不支援
}).start();
```

---

### 5.3 Cannot read properties of undefined

**錯誤訊息**：
```
TypeError: Cannot read properties of undefined (reading 'property')
```

**問題原因**：
嘗試訪問 undefined 或 null 對象的屬性

**解決方案**：

**方案 A：使用可選鏈（推薦）**
```typescript
// ❌ 錯誤
const value = response.data.history;

// ✅ 正確
const value = response.data?.history || [];
```

**方案 B：添加類型檢查**
```typescript
if (response && response.data && response.data.history) {
  const history = response.data.history;
}
```

**方案 C：使用 TypeScript 嚴格模式**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true
  }
}
```

---

### 5.4 react-native-maps Web 兼容性問題（codegenNativeComponent is not a function）

**錯誤訊息**：
```
Error: (0 , _reactNativeWebDistIndex.codegenNativeComponent) is not a function
```

**問題現象**：
- Web 瀏覽器無法正常加載應用
- 頁面顯示空白
- 控制台報錯 `codegenNativeComponent is not a function`
- 移動端（iOS/Android）運行正常

**問題原因**：
- `react-native-maps` 組件不支持 Web 平台
- MapView 是原生組件，需要 iOS/Android 原生代碼
- 在 Web 環境中導入 `react-native-maps` 會導致應用崩潰
- 影響組件：
  - `LocationPicker.tsx` - 地圖位置選擇器
  - `MapPreview.tsx` - 地圖預覽組件
  - `MapSearchScreen.tsx` - 地圖搜尋畫面

**診斷步驟**：
```bash
# 1. 檢查控制台錯誤
# 打開 http://localhost:8081 
# F12 → Console

# 2. 搜尋使用 MapView 的文件
cd frontend/src
grep -r "from 'react-native-maps'" .

# 3. 檢查平台檢測
grep -r "Platform.OS" components/
```

**解決方案**：

**方案 A：條件導入 + 平台檢測（推薦）**

```typescript
// LocationPicker.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Button } from 'react-native-paper';

// Region 類型定義
interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// 條件導入 MapView（僅在非 Web 平台）
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
}

export function LocationPicker({ /* props */ }) {
  // ... state declarations

  return (
    <Portal>
      <Modal>
        {/* ... header and search */}
        
        {/* 地圖容器 */}
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            // Web 平台替代 UI
            <View style={[styles.webFallback, { backgroundColor: theme.colors.surfaceVariant }]}>
              <Text variant="titleMedium">🗺️ 地圖選擇器</Text>
              <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 8 }}>
                地圖功能在網頁版中不可用
              </Text>
              <Text variant="bodySmall" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                請在行動裝置上使用此功能
              </Text>
              {locationInfo && (
                <View style={styles.webLocationInfo}>
                  <Text>📍 {locationInfo.placeName}</Text>
                  <Text>座標: {latitude}, {longitude}</Text>
                </View>
              )}
            </View>
          ) : (
            // 移動端 MapView
            MapView && (
              <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                onPress={handleMapPress}
              >
                {Marker && (
                  <Marker
                    coordinate={markerPosition}
                    draggable
                    onDragEnd={handleMarkerDragEnd}
                  />
                )}
              </MapView>
            )
          )}
        </View>
        
        {/* ... info and buttons */}
      </Modal>
    </Portal>
  );
}

// 添加 Web fallback 樣式
const styles = StyleSheet.create({
  // ... existing styles
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderRadius: 8,
  },
  webLocationInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
});
```

**方案 B：MapPreview 組件**

```typescript
// MapPreview.tsx
import { Platform } from 'react-native';

// 條件導入
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
}

export function MapPreview({ location, onPress, height = 150 }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.mapContainer, { height }]}>
      {Platform.OS === 'web' ? (
        // Web 平台簡化預覽
        <View style={[styles.webFallback, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text variant="titleMedium">🗺️</Text>
          <Text variant="bodySmall" style={{ marginTop: 8 }}>
            {location.placeName}
          </Text>
          <Text variant="bodySmall" style={{ fontSize: 10 }}>
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        </View>
      ) : (
        // 移動端 MapView
        MapView && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            {Marker && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
              />
            )}
          </MapView>
        )
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // ... existing styles
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
```

**方案 C：MapSearchScreen 畫面級處理**

```typescript
// MapSearchScreen.tsx
import { Platform } from 'react-native';
import { Button } from 'react-native-paper';

export default function MapSearchScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  
  // Web 平台直接返回提示畫面
  if (Platform.OS === 'web') {
    return (
      <SafeAreaLayout>
        <View style={styles.container}>
          <Surface style={[styles.toolbar, { backgroundColor: theme.colors.surface }]}>
            <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
            <Text variant="titleMedium">地圖搜尋</Text>
          </Surface>
          <View style={styles.webNotice}>
            <Text variant="headlineMedium">🗺️</Text>
            <Text variant="titleLarge" style={{ marginBottom: 8 }}>
              地圖搜尋功能
            </Text>
            <Text variant="bodyLarge" style={{ textAlign: 'center', marginBottom: 16 }}>
              此功能僅適用於行動裝置
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
              請使用 iOS 或 Android 設備訪問此功能
            </Text>
            <Button 
              mode="contained" 
              onPress={() => navigation.goBack()}
              style={{ marginTop: 24 }}
            >
              返回
            </Button>
          </View>
        </View>
      </SafeAreaLayout>
    );
  }
  
  // 移動端正常邏輯
  // ...
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webNotice: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  // ... other styles
});
```

**驗證測試**：

```bash
# 1. 清除快取
cd frontend
rm -rf .expo node_modules/.cache

# 2. 重啟開發服務器
npm start

# 3. 在瀏覽器測試
# 打開 http://localhost:8081
# 應該能看到登入畫面，不再有 codegenNativeComponent 錯誤

# 4. 測試地圖相關功能
# - 創建文章時添加位置 → 應顯示 Web fallback UI
# - 查看包含位置的文章 → 應顯示簡化地圖預覽
# - 訪問地圖搜尋 → 應顯示「僅適用於行動裝置」提示

# 5. 在移動模擬器測試（確保原生功能正常）
# iOS: Press i
# Android: Press a
```

**相關文件**：
- `frontend/src/components/common/LocationPicker.tsx`
- `frontend/src/components/common/MapPreview.tsx`
- `frontend/src/screens/MapSearchScreen.tsx`
- `frontend/src/screens/CreatePostScreen.tsx`

**修復效果**：

**移動端 (iOS/Android)**:
- ✅ 完整 MapView 功能
- ✅ 地圖選擇器正常工作
- ✅ 地圖預覽正常顯示
- ✅ 地圖搜尋功能完整

**Web 端**:
- ✅ 不再崩潰
- ✅ 顯示友好提示 UI
- ✅ 保留基本位置信息顯示
- ✅ 提供返回選項

**注意事項**：
1. 條件導入必須在組件外部進行，不能在 render 內部
2. 使用 `Platform.OS !== 'web'` 而非 `Platform.OS === 'ios'`，以支持 Android
3. 為 Web 提供有意義的替代 UI，不要留空白
4. 測試時確保移動端功能未受影響

**替代方案（高級）**：

如果需要在 Web 上也顯示地圖，可以考慮：

**使用 React Leaflet（Web 專用地圖）**
```bash
npm install react-leaflet leaflet
```

```typescript
// MapView.web.tsx
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export function MapView({ region, children }) {
  return (
    <MapContainer 
      center={[region.latitude, region.longitude]} 
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
```

**記錄時間**：2025-11-03 23:50  
**解決時長**：1 小時  
**優先級**：🔴高（阻塞 Web 測試）

---

## 6. TypeScript 類型問題

### 6.1 Type 'never' 錯誤

**錯誤訊息**：
```
Argument of type '[never, never]' is not assignable to parameter of type 'never'
```

**問題原因**：
TypeScript 無法推斷 navigation 的類型

**解決方案**：

**方案 A：定義導航類型**
```typescript
// frontend/src/types/navigation.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  Profile: { userId: string };
  TagPosts: { slug: string };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
```

**方案 B：使用類型斷言（臨時方案）**
```typescript
// 不推薦，但可以快速修復編譯錯誤
navigation.navigate('Profile' as never, { userId: user.id } as never);
```

**方案 C：正確使用（推薦）**
```typescript
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '../types/navigation';

const navigation = useNavigation<NavigationProp>();

// 現在可以正確使用
navigation.navigate('Profile', { userId: user.id });
```

---

## 7. 環境配置問題

### 7.1 環境變數讀取失敗

**問題現象**：
- `process.env.VARIABLE` 返回 undefined
- 配置值未正確載入

**診斷**：
```bash
# 檢查 .env 文件是否存在
ls -la backend/.env

# 檢查內容
cat backend/.env
```

**解決方案**：

**確認 .env 文件格式**
```env
# ✅ 正確格式
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=5000

# ❌ 錯誤格式（有空格）
DATABASE_URL = "postgresql://..."

# ❌ 錯誤格式（有註釋在同一行）
PORT=5000 # 端口號
```

**重啟服務載入環境變數**
```bash
# 修改 .env 後必須重啟
pkill -9 -f "nest|node.*backend"
cd backend && npm run start:dev
```

---

### 7.2 端口已被佔用

**錯誤訊息**：
```
Error: listen EADDRINUSE: address already in use :::5000
```

**解決方案**：

**方案 A：查找並終止進程**
```bash
# 查找佔用端口的進程
lsof -i :5000
# 或
netstat -ano | grep :5000

# 終止進程
kill -9 [PID]
```

**方案 B：更換端口**
```env
# backend/.env
PORT=5001
```

**方案 C：一鍵清理所有相關進程**
```bash
# 清理後端進程
pkill -9 -f "nest|node.*backend"

# 清理前端進程
pkill -9 -f "expo|metro"
```

---

## 快速診斷檢查清單

當遇到問題時，按順序檢查：

### ✅ 基礎檢查
- [ ] 服務是否正在運行（`ps aux | grep node`）
- [ ] 環境變數是否正確載入（檢查 .env）
- [ ] 是否有拼寫錯誤
- [ ] 是否修改了正確的文件

### ✅ 快取檢查
- [ ] 清除瀏覽器快取（Ctrl+Shift+R）
- [ ] 清除 Metro bundler 快取
- [ ] 清除 node_modules/.cache

### ✅ 配置檢查
- [ ] API baseURL 配置正確
- [ ] 導航配置完整
- [ ] 類型定義正確

### ✅ 網路檢查
- [ ] 後端 API 直接測試正常（curl）
- [ ] CORS 配置正確
- [ ] 防火牆未阻擋請求

### ✅ 日誌檢查
- [ ] 查看後端控制台輸出
- [ ] 查看瀏覽器 Console
- [ ] 查看瀏覽器 Network 標籤

---

## 常用診斷命令

```bash
# 查看進程
ps aux | grep -E "node|expo|metro|nest"

# 查看端口佔用
lsof -i :5000
lsof -i :8081

# 測試 API
curl -v http://localhost:5000/api/posts

# 清除所有快取
cd frontend
rm -rf .expo .expo-shared node_modules/.cache
cd ../backend
rm -rf dist

# 重啟所有服務
pkill -9 -f "node|expo|metro|nest"
cd backend && npm run start:dev &
cd frontend && npm start &

# 檢查文件編碼
file frontend/App.tsx

# 搜尋重複文件
find . -name "App.tsx"

# 搜尋可能的問題路徑
grep -r "apiClient.get(\`/api/" frontend/src/
```

---

## 添加新問題記錄模板

```markdown
### X.X 問題標題

**錯誤訊息**：
```
在此貼上完整錯誤訊息
```

**問題現象**：
- 描述問題如何發生
- 重現步驟

**問題原因**：
解釋為什麼會發生這個問題

**診斷步驟**：
1. 第一步診斷方法
2. 第二步診斷方法

**解決方案**：

**方案 A：推薦方案**
```bash
# 命令或代碼
```

**方案 B：替代方案**
```bash
# 命令或代碼
```

**驗證修復**：
```bash
# 如何確認問題已解決
```

**預防措施**：
- 如何避免未來再次發生

**相關記錄**：
- 日期：首次遇到時間
- 相關文件或提交
```

---

## 更新日誌

### 2025-11-02
- ✅ 添加故障排查標準流程
- ✅ 添加問題記錄模板
- ✅ 添加快速搜尋關鍵字表
- ✅ 添加最近解決問題追蹤
- ✅ 建立知識庫管理規範

### 2025-11-01
- ✅ 創建問題排查文檔
- ✅ 添加導航問題（雙文件問題）
- ✅ 添加 API 路徑問題
- ✅ 添加前端 500 錯誤診斷
- ✅ 添加快取問題解決方案
- ✅ 添加 React Native 常見問題
- ✅ 添加 TypeScript 類型問題
- ✅ 添加環境配置問題
- ✅ **重點：添加 Prisma P1001 錯誤 - WSL2 + Supabase 完整解決方案**

---

## 📊 最近解決的問題（按時間倒序）

### 🎯 2025-11-01: Prisma P1001 - WSL2 無法連接 Supabase ⭐

**問題**: 後端無法連接數據庫，持續出現 P1001 錯誤  
**根本原因**: WSL2 不支持 IPv6，Supabase Direct Connection 僅支持 IPv6  
**解決方案**: 使用 Session Pooler (IPv4 Compatible)  
**耗時**: 3 小時  
**詳細記錄**: 見 [3.3 Prisma P1001 錯誤](#33-prisma-p1001-錯誤---wsl2--supabase-連接問題-)  
**關鍵學習**: 
- WSL2 環境必須使用 Session Pooler
- 不同 Pooler 類型的用戶名格式不同
- 網絡測試成功不代表應用連接成功

---

### 📋 問題追蹤看板

| 問題 ID | 狀態 | 優先級 | 問題簡述 | 記錄日期 |
|---------|------|--------|---------|---------|
| #001 | ✅ 已解決 | 🔴 高 | Prisma P1001 - WSL2 + Supabase | 2025-11-01 |
| #002 | ✅ 已解決 | ⚠️ 中 | API 路徑重複 /api/api/ | 2025-10-XX |
| #003 | ✅ 已解決 | ⚠️ 中 | Screen 未註冊導航錯誤 | 2025-10-XX |
| - | - | - | (新問題請添加到此處) | - |

---

## 🤝 貢獻指南

### 如何添加新問題記錄

**Step 1: 確認問題不存在**
```bash
# 在文檔中搜尋關鍵字
grep -i "關鍵錯誤訊息" docs/TROUBLESHOOTING.md
```

**Step 2: 選擇合適的分類**
- 導航與路由問題 → Section 1
- API 與網路請求問題 → Section 2
- 資料庫與後端問題 → Section 3
- 快取與瀏覽器問題 → Section 4
- React Native 與 Expo 問題 → Section 5
- TypeScript 類型問題 → Section 6
- 環境配置問題 → Section 7

**Step 3: 使用問題記錄模板**

參考上方的 [📝 問題記錄模板](#-問題記錄模板)，確保包含：
- ✅ 完整的錯誤訊息
- ✅ 問題現象描述
- ✅ 根本原因分析
- ✅ 診斷步驟（可執行命令）
- ✅ 解決方案（至少一個）
- ✅ 驗證測試方法

**Step 4: 更新追蹤看板**

在 [📊 最近解決的問題](#-最近解決的問題按時間倒序) 中添加簡要記錄。

**Step 5: 提交到版本控制**
```bash
git add docs/TROUBLESHOOTING.md
git commit -m "docs: 添加 [問題簡述] 到故障排查指南"
git push
```

---

## 💡 最佳實踐

### 問題診斷的黃金法則

1. **先搜尋，再嘗試** - 70% 的問題已有解決方案
2. **記錄過程** - 即使失敗的嘗試也很有價值
3. **根本原因** - 不只是修復症狀，要找到原因
4. **可重現** - 解決方案應該能被他人重現
5. **持續更新** - 技術棧更新時，及時更新文檔

### 診斷技巧

**使用分層診斷法**：
```
網絡層 → 連接層 → 應用層 → 業務層
  ↓         ↓         ↓         ↓
ping/nc   curl    API測試   功能測試
```

**收集完整信息**：
- 錯誤訊息（完整複製）
- 系統環境（OS, Node版本, 依賴版本）
- 重現步驟（詳細且可重複）
- 已嘗試方案（成功和失敗的都記錄）

---

## 🔗 相關資源

### 官方文檔
- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [Expo Debugging](https://docs.expo.dev/debugging/runtime-issues/)
- [Prisma Error Reference](https://www.prisma.io/docs/reference/api-reference/error-reference)
- [NestJS FAQ](https://docs.nestjs.com/faq)
- [Supabase Database Connection](https://supabase.com/docs/guides/database/connecting-to-postgres)

### 團隊文檔
- [開發文件.md](./開發文件.md) - 完整開發記錄
- [主題系統.md](./主題系統.md) - 主題系統文檔
- [API_TESTING.md](../backend/API_TESTING.md) - API 測試指南

---

## 待補充分類

### 8. MongoDB 特定問題
- 預留位置

### 9. 部署相關問題
- 預留位置

### 10. 性能優化問題
- 預留位置

### 11. 安全性問題
- 預留位置

---

**文檔維護者**: 開發團隊全體成員  
**最後更新**: 2025-11-02  
**版本**: 2.0

---

**使用提示**：
1. 📖 遇到問題先用 Ctrl+F 搜尋關鍵字
2. 🔍 按照診斷步驟逐步排查
3. ✍️ 解決後記得更新文檔（使用模板）
4. 📊 在追蹤看板添加問題記錄
5. 🔄 定期回顧和優化解決方案

---

**記住**：每個解決的問題都是團隊寶貴的知識資產！💎
