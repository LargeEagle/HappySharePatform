# 故障排除指南

## 🐛 已知問題

### 1. WSL 環境無法連接 Supabase Direct Connection

**問題編號**：#001  
**發現日期**：2025-10-29  
**嚴重程度**：高  
**狀態**：已解決

#### 問題描述
在 Windows WSL (Windows Subsystem for Linux) 環境中，無法連接到 Supabase 的 Direct Connection。

#### 錯誤信息
```
Error: P1001: Can't reach database server at `db.jpcdablvabnuqdmneqnd.supabase.co:5432`

Please make sure your database server is running at `db.jpcdablvabnuqdmneqnd.supabase.co:5432`.
```

#### 根本原因
1. Supabase Direct Connection 使用 IPv6 地址
2. DNS 解析返回 IPv6：`2406:da18:243:7426:51e:978a:c58e:7b4`
3. WSL 默認不支持 IPv6 網絡連接
4. 導致 "Network is unreachable" 錯誤

#### 診斷步驟
```bash
# 1. DNS 解析測試
nslookup db.jpcdablvabnuqdmneqnd.supabase.co
# 返回 IPv6 地址

# 2. 連接測試
ping db.jpcdablvabnuqdmneqnd.supabase.co
# 返回：Network is unreachable

# 3. TCP 端口測試
timeout 5 bash -c 'cat < /dev/null > /dev/tcp/db.jpcdablvabnuqdmneqnd.supabase.co/5432'
# 返回：Network is unreachable
```

#### 解決方案

##### ✅ 方案 1：使用 Session Pooler（推薦）

更新 `.env` 文件使用 Session Pooler 連接字符串：

```env
# 使用 Session Pooler（支持 IPv4）
DATABASE_URL="postgresql://postgres.jpcdablvabnuqdmneqnd:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

**優點**：
- ✅ 支持 IPv4，兼容 WSL
- ✅ 連接池管理，性能更好
- ✅ 適用於開發和生產環境

##### 方案 2：在 Windows 本機運行

在 Windows PowerShell 或 CMD 中執行：

```cmd
cd backend
npx prisma migrate dev --name init
```

**優點**：
- ✅ Windows 本機支持 IPv6
- ✅ 可以使用 Direct Connection

**缺點**：
- ❌ 需要在 Windows 和 WSL 之間切換

##### 方案 3：啟用 WSL IPv6（高級）

修改 WSL 配置啟用 IPv6 支持（較複雜，不推薦）。

#### 預防措施

1. **優先使用 Session Pooler**：
   - 在 `.env.example` 中使用 Session Pooler 格式
   - 更新文檔說明優先選擇

2. **環境檢測**：
   - 添加啟動腳本檢測環境
   - 提供友好的錯誤提示

3. **文檔更新**：
   - 在 `SUPABASE_SETUP.md` 中標註 WSL 限制
   - 提供多種連接方案

#### 參考資料
- [WSL IPv6 Support Issue](https://github.com/microsoft/WSL/issues/4926)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma Connection Management](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

---

## 📝 報告新問題

如果遇到新問題，請按以下格式記錄：

### 問題模板

```markdown
### [問題編號]. [簡短標題]

**問題編號**：#XXX  
**發現日期**：YYYY-MM-DD  
**嚴重程度**：低/中/高/緊急  
**狀態**：待處理/進行中/已解決/已關閉

#### 問題描述
[詳細描述問題]

#### 錯誤信息
```
[完整的錯誤信息]
```

#### 重現步驟
1. [步驟 1]
2. [步驟 2]
3. [步驟 3]

#### 根本原因
[分析問題的根本原因]

#### 解決方案
[解決方案和實施步驟]

#### 預防措施
[如何避免未來再次發生]
```

---

## 🔍 常見問題 FAQ

### Q1: 如何選擇正確的 Supabase 連接方式？

**A**: 根據環境選擇：

| 環境 | 推薦連接方式 | 端口 |
|------|-------------|------|
| WSL 開發環境 | Session Pooler | 6543 |
| Windows 本機 | Direct Connection | 5432 |
| Docker 容器 | Session Pooler | 6543 |
| 生產環境 | Session Pooler | 6543 |

### Q2: Session Pooler 和 Direct Connection 有什麼區別？

**A**: 

**Session Pooler**:
- 使用連接池管理
- 支持 IPv4（WSL 兼容）
- 更好的併發性能
- 端口 6543

**Direct Connection**:
- 直接連接數據庫
- 使用 IPv6（WSL 不兼容）
- 適合低延遲需求
- 端口 5432

### Q3: Prisma migrate 失敗怎麼辦？

**A**: 按以下順序檢查：

1. **檢查連接字符串**：
   ```bash
   echo $DATABASE_URL
   ```

2. **測試網絡連接**：
   ```bash
   # WSL 環境使用 Session Pooler
   curl -I https://aws-0-ap-southeast-1.pooler.supabase.com
   ```

3. **驗證數據庫密碼**：
   - 登入 Supabase Dashboard
   - 確認密碼正確

4. **清理 Prisma 緩存**：
   ```bash
   rm -rf node_modules/.prisma
   npx prisma generate
   ```

### Q4: 如何在 WSL 中啟用 IPv6？

**A**: 不推薦在 WSL 中啟用 IPv6，因為：
- 配置複雜且不穩定
- 可能影響其他網絡功能
- Session Pooler 是更好的解決方案

如果確實需要，請參考 [WSL GitHub Issue #4926](https://github.com/microsoft/WSL/issues/4926)

---

## 🛠️ 診斷工具

### 網絡連接測試腳本

創建 `backend/scripts/test-connection.sh`：

```bash
#!/bin/bash

echo "🔍 診斷 Supabase 連接..."
echo ""

# 測試 DNS 解析
echo "1. DNS 解析測試"
nslookup db.jpcdablvabnuqdmneqnd.supabase.co
echo ""

# 測試 Session Pooler
echo "2. Session Pooler 測試"
curl -I https://aws-0-ap-southeast-1.pooler.supabase.com 2>&1 | head -5
echo ""

# 測試環境變數
echo "3. 環境變數檢查"
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL 未設置"
else
  echo "✅ DATABASE_URL 已設置"
  # 隱藏密碼顯示
  echo "${DATABASE_URL}" | sed 's/:[^@]*@/:****@/'
fi
echo ""

# 測試 Prisma
echo "4. Prisma 連接測試"
npx prisma db execute --stdin <<< "SELECT 1;" 2>&1 | head -10
echo ""

echo "✅ 診斷完成"
```

使用方法：
```bash
chmod +x backend/scripts/test-connection.sh
./backend/scripts/test-connection.sh
```

---

## 📊 更新日誌

| 日期 | 版本 | 更新內容 |
|------|------|---------|
| 2025-10-29 | 1.0 | 初始版本，記錄 WSL IPv6 連接問題 |

