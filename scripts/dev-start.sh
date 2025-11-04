#!/bin/bash
# ============================================================================
# HappyShare Platform - 開發環境統一啟動腳本
# ============================================================================
# 功能：
#   - 環境檢查（Node.js、npm、依賴）
#   - 停止舊進程（避免端口衝突）
#   - 啟動後端服務 + 條件等待
#   - 啟動前端服務 + 條件等待
#   - 顯示訪問 URL 和操作提示
#
# 使用：
#   ./scripts/dev-start.sh          # 啟動前後端
#   ./scripts/dev-start.sh backend  # 只啟動後端
#   ./scripts/dev-start.sh frontend # 只啟動前端
#
# 停止服務：
#   ./scripts/dev-stop.sh
#   或按 Ctrl+C
# ============================================================================

set -e  # 遇到錯誤立即退出

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 項目根目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 載入等待工具函數
WAIT_UTILS="$PROJECT_ROOT/backend/scripts/lib/wait-utils.sh"
if [ -f "$WAIT_UTILS" ]; then
  source "$WAIT_UTILS"
else
  echo -e "${RED}❌ Error: wait-utils.sh not found at $WAIT_UTILS${NC}"
  exit 1
fi

# ============================================================================
# 顯示橫幅
# ============================================================================
show_banner() {
  echo -e "${CYAN}"
  cat << 'EOF'
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║           HAPPY SHARE 社交平台 - 開發環境              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
EOF
  echo -e "${NC}"
}

# ============================================================================
# 檢查命令是否存在
# ============================================================================
command_exists() {
  command -v "$1" &> /dev/null
}

# ============================================================================
# 環境檢查
# ============================================================================
check_environment() {
  echo -e "${BLUE}📋 檢查開發環境...${NC}\n"
  
  local has_error=0
  
  # 檢查 Node.js
  if command_exists node; then
    local node_version=$(node --version)
    echo -e "${GREEN}✅ Node.js: $node_version${NC}"
  else
    echo -e "${RED}❌ Node.js 未安裝${NC}"
    has_error=1
  fi
  
  # 檢查 npm
  if command_exists npm; then
    local npm_version=$(npm --version)
    echo -e "${GREEN}✅ npm: $npm_version${NC}"
  else
    echo -e "${RED}❌ npm 未安裝${NC}"
    has_error=1
  fi
  
  # 檢查 Git
  if command_exists git; then
    echo -e "${GREEN}✅ Git: $(git --version | cut -d' ' -f3)${NC}"
  else
    echo -e "${YELLOW}⚠️  Git 未安裝（可選）${NC}"
  fi
  
  echo ""
  
  if [ $has_error -eq 1 ]; then
    echo -e "${RED}❌ 環境檢查失敗，請先安裝缺少的工具${NC}"
    exit 1
  fi
}

# ============================================================================
# 檢查依賴安裝
# ============================================================================
check_dependencies() {
  echo -e "${BLUE}📦 檢查項目依賴...${NC}\n"
  
  # 檢查後端依賴
  if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  後端依賴未安裝${NC}"
    read -p "是否現在安裝後端依賴？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${BLUE}📥 安裝後端依賴...${NC}"
      cd "$PROJECT_ROOT/backend"
      npm install
    else
      echo -e "${RED}❌ 後端依賴未安裝，無法繼續${NC}"
      exit 1
    fi
  else
    echo -e "${GREEN}✅ 後端依賴已安裝${NC}"
  fi
  
  # 檢查前端依賴
  if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    echo -e "${YELLOW}⚠️  前端依賴未安裝${NC}"
    read -p "是否現在安裝前端依賴？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo -e "${BLUE}📥 安裝前端依賴...${NC}"
      cd "$PROJECT_ROOT/frontend"
      npm install
    else
      echo -e "${RED}❌ 前端依賴未安裝，無法繼續${NC}"
      exit 1
    fi
  else
    echo -e "${GREEN}✅ 前端依賴已安裝${NC}"
  fi
  
  echo ""
}

# ============================================================================
# 停止舊進程
# ============================================================================
cleanup_old_processes() {
  echo -e "${BLUE}🧹 清理舊進程...${NC}\n"
  
  # 檢查並停止 5000 端口
  if is_port_in_use 5000; then
    echo -e "${YELLOW}⚠️  端口 5000 已被佔用，正在停止...${NC}"
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
  
  # 檢查並停止 8081 端口
  if is_port_in_use 8081; then
    echo -e "${YELLOW}⚠️  端口 8081 已被佔用，正在停止...${NC}"
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true
    sleep 1
  fi
  
  echo -e "${GREEN}✅ 清理完成${NC}\n"
}

# ============================================================================
# 啟動後端服務
# ============================================================================
start_backend() {
  echo -e "${BLUE}🚀 啟動後端服務 (NestJS)...${NC}\n"
  
  cd "$PROJECT_ROOT/backend"
  
  # 在背景啟動
  npm run start:dev > /tmp/happyshare-backend.log 2>&1 &
  local backend_pid=$!
  echo -e "${GREEN}✅ 後端進程已啟動 (PID: $backend_pid)${NC}"
  echo "$backend_pid" > /tmp/happyshare-backend.pid
  
  # 條件等待
  echo ""
  if wait_for_backend 90; then
    echo -e "${GREEN}🎉 後端服務啟動成功！${NC}"
    echo -e "${CYAN}   URL: http://localhost:5000/api${NC}"
    echo -e "${CYAN}   健康檢查: http://localhost:5000/api/health${NC}"
    echo -e "${CYAN}   日誌: /tmp/happyshare-backend.log${NC}\n"
    return 0
  else
    echo -e "${RED}❌ 後端服務啟動失敗${NC}"
    echo -e "${YELLOW}查看日誌: tail -100 /tmp/happyshare-backend.log${NC}\n"
    return 1
  fi
}

# ============================================================================
# 啟動前端服務
# ============================================================================
start_frontend() {
  echo -e "${BLUE}🚀 啟動前端服務 (Expo Web)...${NC}\n"
  
  cd "$PROJECT_ROOT/frontend"
  
  # 在背景啟動
  npm run web > /tmp/happyshare-frontend.log 2>&1 &
  local frontend_pid=$!
  echo -e "${GREEN}✅ 前端進程已啟動 (PID: $frontend_pid)${NC}"
  echo "$frontend_pid" > /tmp/happyshare-frontend.pid
  
  # 條件等待（前端需要更長時間進行編譯）
  echo ""
  if wait_for_frontend 120; then
    echo -e "${GREEN}🎉 前端服務啟動成功！${NC}"
    echo -e "${CYAN}   URL: http://localhost:8081${NC}"
    echo -e "${CYAN}   日誌: /tmp/happyshare-frontend.log${NC}\n"
    return 0
  else
    echo -e "${RED}❌ 前端服務啟動失敗${NC}"
    echo -e "${YELLOW}查看日誌: tail -100 /tmp/happyshare-frontend.log${NC}\n"
    return 1
  fi
}

# ============================================================================
# 顯示服務狀態
# ============================================================================
show_status() {
  echo -e "${CYAN}"
  cat << 'EOF'
╔══════════════════════════════════════════════════════════╗
║               🎉 所有服務已啟動完成！                  ║
╚══════════════════════════════════════════════════════════╝
EOF
  echo -e "${NC}"
  
  echo -e "${GREEN}✅ 服務訪問地址：${NC}\n"
  echo -e "   🌐 前端應用:    ${CYAN}http://localhost:8081${NC}"
  echo -e "   🔧 後端 API:    ${CYAN}http://localhost:5000/api${NC}"
  echo -e "   ❤️  健康檢查:    ${CYAN}http://localhost:5000/api/health${NC}"
  echo ""
  
  echo -e "${YELLOW}📋 測試帳號：${NC}\n"
  echo -e "   管理員: admin@happyshare.com / Admin123!"
  echo -e "   用戶1:  alice@happyshare.com / Password123!"
  echo -e "   用戶2:  bob@happyshare.com   / Password123!"
  echo ""
  
  echo -e "${BLUE}🛠️  有用命令：${NC}\n"
  echo -e "   查看後端日誌: ${CYAN}tail -f /tmp/happyshare-backend.log${NC}"
  echo -e "   查看前端日誌: ${CYAN}tail -f /tmp/happyshare-frontend.log${NC}"
  echo -e "   停止所有服務: ${CYAN}./scripts/dev-stop.sh${NC}"
  echo -e "   或按 ${RED}Ctrl+C${NC} 然後執行停止腳本"
  echo ""
}

# ============================================================================
# 主函數
# ============================================================================
main() {
  show_banner
  
  local mode=${1:-"all"}
  
  # 環境檢查
  check_environment
  check_dependencies
  
  # 清理舊進程
  cleanup_old_processes
  
  # 根據模式啟動服務
  case "$mode" in
    backend)
      start_backend
      ;;
    frontend)
      start_frontend
      ;;
    all|*)
      # 啟動後端
      if start_backend; then
        sleep 2
        # 啟動前端
        start_frontend
      else
        echo -e "${RED}❌ 後端啟動失敗，停止啟動流程${NC}"
        exit 1
      fi
      ;;
  esac
  
  # 顯示狀態
  if [ "$mode" == "all" ]; then
    show_status
  fi
  
  echo -e "${GREEN}✅ 開發環境已就緒，開始愉快地開發吧！🚀${NC}\n"
}

# 執行主函數
main "$@"
