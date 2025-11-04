#!/bin/bash
# ============================================================================
# HappyShare Platform - 開發環境停止腳本
# ============================================================================
# 功能：安全地停止所有開發服務
# ============================================================================

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🛑 停止 HappyShare 開發服務...${NC}\n"

# 停止後端
if [ -f /tmp/happyshare-backend.pid ]; then
  backend_pid=$(cat /tmp/happyshare-backend.pid)
  if ps -p $backend_pid > /dev/null 2>&1; then
    echo -e "${YELLOW}⏳ 停止後端服務 (PID: $backend_pid)...${NC}"
    kill $backend_pid 2>/dev/null || true
    sleep 1
    # 強制結束（如果還在運行）
    kill -9 $backend_pid 2>/dev/null || true
    echo -e "${GREEN}✅ 後端服務已停止${NC}"
  fi
  rm /tmp/happyshare-backend.pid
fi

# 清理端口 5000
if lsof -ti:5000 &>/dev/null; then
  echo -e "${YELLOW}⏳ 清理端口 5000...${NC}"
  lsof -ti:5000 | xargs kill -9 2>/dev/null || true
  echo -e "${GREEN}✅ 端口 5000 已釋放${NC}"
fi

# 停止前端
if [ -f /tmp/happyshare-frontend.pid ]; then
  frontend_pid=$(cat /tmp/happyshare-frontend.pid)
  if ps -p $frontend_pid > /dev/null 2>&1; then
    echo -e "${YELLOW}⏳ 停止前端服務 (PID: $frontend_pid)...${NC}"
    kill $frontend_pid 2>/dev/null || true
    sleep 1
    kill -9 $frontend_pid 2>/dev/null || true
    echo -e "${GREEN}✅ 前端服務已停止${NC}"
  fi
  rm /tmp/happyshare-frontend.pid
fi

# 清理端口 8081
if lsof -ti:8081 &>/dev/null; then
  echo -e "${YELLOW}⏳ 清理端口 8081...${NC}"
  lsof -ti:8081 | xargs kill -9 2>/dev/null || true
  echo -e "${GREEN}✅ 端口 8081 已釋放${NC}"
fi

# 清理其他相關進程
pkill -f "nest start" 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ 所有服務已停止${NC}\n"
