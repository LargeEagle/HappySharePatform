#!/bin/bash
# ============================================================================
# Wait Utilities Library
# ============================================================================
# 提供可重用的服務就緒檢查函數，避免使用固定 sleep
# 
# 使用方式：
#   source "$(dirname "$0")/lib/wait-utils.sh"
#   wait_for_backend
#   wait_for_frontend
#
# 詳細文檔：docs/TROUBLESHOOTING.md § 3.1
# ============================================================================

# 顏色輸出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================================================
# 通用端口等待函數
# ============================================================================
# 參數：
#   $1 - 端口號
#   $2 - 服務名稱（用於顯示）
#   $3 - 最大等待時間（秒，可選，默認60）
# 返回：
#   0 - 成功
#   1 - 超時失敗
# ============================================================================
wait_for_port() {
  local port=$1
  local service_name=${2:-"Service"}
  local max_wait=${3:-60}
  local elapsed=0
  
  echo -e "${YELLOW}⏳ Waiting for ${service_name} on port ${port}...${NC}"
  
  while [ $elapsed -lt $max_wait ]; do
    # TCP 端口檢查
    if timeout 1 bash -c "</dev/tcp/localhost/$port" 2>/dev/null; then
      echo -e "${GREEN}✅ Port ${port} is open${NC}"
      
      # HTTP 健康檢查
      local http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port 2>/dev/null || echo "000")
      if [[ "$http_code" =~ ^(200|301|302|404)$ ]]; then
        echo -e "${GREEN}✅ ${service_name} is responding (HTTP ${http_code})${NC}"
        return 0
      fi
    fi
    
    sleep 1
    elapsed=$((elapsed + 1))
    echo -ne "${YELLOW}⏳ Waited ${elapsed}s...${NC}\r"
  done
  
  echo -e "\n${RED}❌ ${service_name} not ready after ${max_wait}s${NC}"
  return 1
}

# ============================================================================
# 後端服務等待（NestJS on port 5000）
# ============================================================================
wait_for_backend() {
  local max_wait=${1:-60}
  
  echo -e "${YELLOW}⏳ Waiting for Backend (NestJS)...${NC}"
  
  if wait_for_port 5000 "Backend" $max_wait; then
    # 額外檢查：測試健康檢查端點
    local health_check=$(curl -s http://localhost:5000/api/health/status 2>/dev/null || echo "")
    if [[ "$health_check" == *"application"* ]]; then
      echo -e "${GREEN}✅ Backend health check passed${NC}"
      return 0
    else
      echo -e "${YELLOW}⚠️  Backend responding but health check incomplete${NC}"
      return 0
    fi
  else
    return 1
  fi
}

# ============================================================================
# 前端服務等待（Expo/Metro on port 8081）
# ============================================================================
wait_for_frontend() {
  local max_wait=${1:-90}
  
  echo -e "${YELLOW}⏳ Waiting for Frontend (Expo/Metro)...${NC}"
  echo -e "${YELLOW}   Note: Metro bundler may take 30-60s for initial compilation${NC}"
  
  if wait_for_port 8081 "Frontend" $max_wait; then
    echo -e "${GREEN}✅ Frontend is ready${NC}"
    return 0
  else
    return 1
  fi
}

# ============================================================================
# MongoDB 等待（port 27017）
# ============================================================================
wait_for_mongodb() {
  local max_wait=${1:-30}
  local elapsed=0
  
  echo -e "${YELLOW}⏳ Waiting for MongoDB...${NC}"
  
  while [ $elapsed -lt $max_wait ]; do
    # 檢查 MongoDB 是否在運行
    if command -v mongosh &> /dev/null; then
      if mongosh --eval "db.adminCommand('ping')" --quiet &> /dev/null; then
        echo -e "${GREEN}✅ MongoDB is ready${NC}"
        return 0
      fi
    elif command -v mongo &> /dev/null; then
      if mongo --eval "db.adminCommand('ping')" --quiet &> /dev/null; then
        echo -e "${GREEN}✅ MongoDB is ready${NC}"
        return 0
      fi
    fi
    
    # 如果是遠端 MongoDB（Supabase/Atlas），檢查連線
    if timeout 1 bash -c "</dev/tcp/localhost/27017" 2>/dev/null; then
      echo -e "${GREEN}✅ MongoDB port is accessible${NC}"
      return 0
    fi
    
    sleep 1
    elapsed=$((elapsed + 1))
    echo -ne "${YELLOW}⏳ Waited ${elapsed}s...${NC}\r"
  done
  
  echo -e "\n${YELLOW}⚠️  MongoDB check timeout (may use remote DB)${NC}"
  return 0  # 不阻塞，因為可能使用遠端數據庫
}

# ============================================================================
# 數據庫連接等待（通用）
# ============================================================================
wait_for_database() {
  local db_type=${1:-"mongodb"}
  local max_wait=${2:-30}
  
  case "$db_type" in
    mongodb|mongo)
      wait_for_mongodb $max_wait
      ;;
    postgresql|postgres)
      wait_for_port 5432 "PostgreSQL" $max_wait
      ;;
    mysql)
      wait_for_port 3306 "MySQL" $max_wait
      ;;
    *)
      echo -e "${YELLOW}⚠️  Unknown database type: $db_type${NC}"
      return 0
      ;;
  esac
}

# ============================================================================
# 檢查進程是否在運行
# ============================================================================
is_port_in_use() {
  local port=$1
  lsof -ti:$port &>/dev/null
  return $?
}

# ============================================================================
# 等待進程停止
# ============================================================================
wait_for_port_free() {
  local port=$1
  local service_name=${2:-"Service"}
  local max_wait=${3:-10}
  local elapsed=0
  
  echo -e "${YELLOW}⏳ Waiting for port ${port} to be free...${NC}"
  
  while [ $elapsed -lt $max_wait ]; do
    if ! is_port_in_use $port; then
      echo -e "${GREEN}✅ Port ${port} is free${NC}"
      return 0
    fi
    
    sleep 1
    elapsed=$((elapsed + 1))
    echo -ne "${YELLOW}⏳ Waited ${elapsed}s...${NC}\r"
  done
  
  echo -e "\n${RED}❌ Port ${port} still in use after ${max_wait}s${NC}"
  return 1
}

# ============================================================================
# 顯示幫助信息
# ============================================================================
show_wait_utils_help() {
  cat << 'EOF'
Wait Utilities Library - 使用說明
============================================================

可用函數：

  wait_for_port <port> [service_name] [max_wait]
    通用端口等待函數
    例：wait_for_port 5000 "Backend" 60

  wait_for_backend [max_wait]
    等待後端服務 (port 5000)
    例：wait_for_backend 60

  wait_for_frontend [max_wait]
    等待前端服務 (port 8081)
    例：wait_for_frontend 90

  wait_for_mongodb [max_wait]
    等待 MongoDB 服務
    例：wait_for_mongodb 30

  wait_for_database <db_type> [max_wait]
    等待數據庫服務
    例：wait_for_database mongodb 30

  is_port_in_use <port>
    檢查端口是否被佔用
    例：is_port_in_use 5000 && echo "Port in use"

  wait_for_port_free <port> [service_name] [max_wait]
    等待端口釋放
    例：wait_for_port_free 5000 "Backend" 10

使用方式：
  source ./backend/scripts/lib/wait-utils.sh
  wait_for_backend

詳細文檔：docs/TROUBLESHOOTING.md § 3.1
============================================================
EOF
}

# 如果直接執行此腳本，顯示幫助
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  show_wait_utils_help
fi
