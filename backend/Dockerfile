# Dockerfile for Production Deployment
# 多階段構建以優化鏡像大小

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# 複製 package files
COPY package*.json ./
COPY prisma ./prisma/

# 安裝依賴
RUN npm ci

# 複製源代碼
COPY . .

# 生成 Prisma Client
RUN npx prisma generate

# 構建應用
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# 安裝 production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# 複製 Prisma schema
COPY --from=builder /app/prisma ./prisma

# 生成 Prisma Client
RUN npx prisma generate

# 複製構建產物
COPY --from=builder /app/dist ./dist

# 創建非 root 用戶
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# 切換到非 root 用戶
USER nestjs

# 暴露端口
EXPOSE 5000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:5000/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 啟動應用
CMD ["node", "dist/main"]
