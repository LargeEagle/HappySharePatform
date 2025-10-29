# 數據庫配置指南

## 環境策略

### 開發環境 (當前)
- **使用**: Supabase
- **原因**: 免費、雲端、無需本地安裝
- **配置**: 已在 `.env` 中配置

### 生產環境 (計劃)
- **使用**: Docker PostgreSQL
- **原因**: 完全控制、性能優化、數據安全
- **配置**: 使用 Docker Compose

---

## 開發環境配置 (Supabase)

### 當前配置

已配置在 `.env` 文件中：

```env
DATABASE_URL="postgresql://postgres.jpcdablvabnuqdmnenqd:FEagle0714@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
SUPABASE_URL="https://jpcdablvabnuqdmnenqd.supabase.co"
SUPABASE_ANON_KEY="eyJhbGci..."
```

### 運行數據庫遷移

```bash
cd backend
npx prisma migrate dev --name init
```

### 查看數據庫

```bash
npx prisma studio
```

或訪問 Supabase Dashboard:
https://supabase.com/dashboard/project/jpcdablvabnuqdmnenqd

---

## 生產環境配置 (Docker PostgreSQL)

### Docker Compose 配置

創建 `docker-compose.yml` (未來使用):

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: happyshare-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: social_media
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: happyshare-backend
    restart: always
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/social_media?schema=public
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

### 生產環境 .env 配置

```env
# 生產環境變數
NODE_ENV=production
PORT=5000

# 數據庫
DB_PASSWORD=your-secure-password-here
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@postgres:5432/social_media?schema=public"

# JWT
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
JWT_EXPIRES_IN=7d

# Supabase (如果使用 Storage)
SUPABASE_URL=""
SUPABASE_SERVICE_KEY=""
```

### 啟動生產環境

```bash
# 構建和啟動
docker-compose up -d

# 查看日誌
docker-compose logs -f backend

# 停止
docker-compose down

# 完全清理（包括數據）
docker-compose down -v
```

### 生產環境數據庫遷移

```bash
# 在容器內運行遷移
docker-compose exec backend npx prisma migrate deploy

# 或使用腳本
docker-compose exec backend npm run migrate:deploy
```

---

## 備份策略

### 開發環境 (Supabase)
- 自動備份由 Supabase 處理
- 可手動導出: Database > Backups

### 生產環境 (Docker)

定期備份腳本 `backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
CONTAINER="happyshare-postgres"

mkdir -p $BACKUP_DIR

# 創建備份
docker exec $CONTAINER pg_dump -U postgres social_media > "$BACKUP_DIR/backup_$DATE.sql"

# 保留最近 30 天的備份
find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql"
```

設置定時任務 (cron):

```bash
# 每天凌晨 2 點備份
0 2 * * * /path/to/backup.sh
```

---

## 遷移指南

### 從 Supabase 遷移到 Docker PostgreSQL

1. **導出 Supabase 數據**:
   ```bash
   # 使用 Supabase CLI
   supabase db dump -f dump.sql
   
   # 或使用 pg_dump
   pg_dump -h aws-0-ap-southeast-1.pooler.supabase.com \
           -U postgres.jpcdablvabnuqdmnenqd \
           -p 6543 \
           postgres > supabase_dump.sql
   ```

2. **啟動 Docker PostgreSQL**:
   ```bash
   docker-compose up -d postgres
   ```

3. **導入數據**:
   ```bash
   docker exec -i happyshare-postgres psql -U postgres social_media < supabase_dump.sql
   ```

4. **更新 .env**:
   ```env
   DATABASE_URL="postgresql://postgres:password@postgres:5432/social_media?schema=public"
   ```

5. **重啟應用**:
   ```bash
   docker-compose restart backend
   ```

---

## 性能優化

### 生產環境建議

1. **連接池配置**:
   ```env
   DATABASE_URL="postgresql://...?connection_limit=20&pool_timeout=10"
   ```

2. **PostgreSQL 調優** (`postgresql.conf`):
   ```conf
   max_connections = 100
   shared_buffers = 256MB
   effective_cache_size = 1GB
   maintenance_work_mem = 64MB
   checkpoint_completion_target = 0.9
   ```

3. **索引優化**:
   - Prisma Schema 中已配置關鍵索引
   - 定期運行 `ANALYZE` 和 `VACUUM`

4. **監控**:
   - 使用 `pg_stat_statements`
   - 設置 slow query log
   - 監控連接數和查詢性能

---

## 安全建議

### 生產環境

1. **使用強密碼**:
   - 數據庫密碼至少 32 字符
   - JWT Secret 至少 64 字符
   - 使用密碼生成器

2. **網絡安全**:
   - 僅暴露必要端口
   - 使用 Docker 網絡隔離
   - 配置防火牆規則

3. **SSL/TLS**:
   ```env
   DATABASE_URL="postgresql://...?sslmode=require"
   ```

4. **定期更新**:
   - 定期更新 PostgreSQL 版本
   - 更新依賴套件
   - 監控安全公告

---

## 故障排除

### 常見問題

1. **連接失敗**:
   ```bash
   # 檢查容器狀態
   docker-compose ps
   
   # 檢查日誌
   docker-compose logs postgres
   
   # 測試連接
   docker-compose exec postgres psql -U postgres -c "SELECT 1"
   ```

2. **遷移失敗**:
   ```bash
   # 重置數據庫（開發環境）
   npx prisma migrate reset
   
   # 生產環境手動修復
   docker-compose exec backend npx prisma migrate resolve --applied [migration_name]
   ```

3. **性能問題**:
   ```bash
   # 查看慢查詢
   docker-compose exec postgres psql -U postgres -c "
     SELECT query, calls, total_time, mean_time 
     FROM pg_stat_statements 
     ORDER BY mean_time DESC 
     LIMIT 10;
   "
   ```

---

## 總結

- ✅ **開發**: Supabase (當前使用)
- 🔄 **生產**: Docker PostgreSQL (計劃中)
- 📦 **遷移**: 平滑過渡，數據可完整遷移
- 🔒 **安全**: 完整的安全和備份策略
- 📊 **監控**: 性能監控和優化建議
