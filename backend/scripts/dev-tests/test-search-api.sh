#!/bin/bash
# HAPPY SHARE - 搜尋功能 API 測試腳本

echo "🧪 HAPPY SHARE 搜尋功能 API 測試"
echo "================================="
echo ""

# 基本 API URL（提前定義以供等候檢查使用）
BASE_URL="http://localhost:5000/api"

# 等待服務器可連線並回應（比固定 sleep 更穩健）
wait_for_port() {
  local host="localhost"
  local port=5000
  local retries=60
  local i=0

  echo "⏳ 等待 ${host}:${port} 可連線...（最多等 ${retries} 秒）"
  # 使用 bash /dev/tcp 檢查 TCP 端口是否可連線
  while ! (echo > /dev/tcp/${host}/${port}) >/dev/null 2>&1; do
    i=$((i+1))
    if [ "$i" -ge "$retries" ]; then
      echo "❌ 等待 ${host}:${port} 超時 (${retries}s)，請檢查後端日誌或啟動狀態。"
      exit 1
    fi
    sleep 1
  done
  echo "✅ ${host}:${port} 已可連線"

  # 嘗試以 HTTP 請求確認服務可接受連線（容錯：不以 HTTP 狀態碼作為唯一判斷）
  local ok=0
  for attempt in $(seq 1 6); do
    if curl -s -o /dev/null "${BASE_URL}"; then
      ok=1
      break
    fi
    sleep 1
  done
  if [ "$ok" -eq 1 ]; then
    echo "✅ ${BASE_URL} 已回應 HTTP 連線" 
  else
    echo "⚠️ ${BASE_URL} 未回應 HTTP（但 TCP 可連線）。如果後端需要更長時間初始化，請稍後重試。"
  fi
}

wait_for_port

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 測試函數
test_api() {
  local name=$1
  local url=$2
  echo -e "${BLUE}測試: ${name}${NC}"
  echo "URL: ${url}"
  response=$(curl -s -w "\n%{http_code}" "${url}")
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ 成功 (HTTP ${http_code})${NC}"
    echo "$body" | head -c 500
    echo ""
  else
    echo -e "${RED}❌ 失敗 (HTTP ${http_code})${NC}"
    echo "$body"
  fi
  echo ""
  echo "---"
  echo ""
}

# 1. 熱門標籤
test_api "1. 獲取熱門標籤" "${BASE_URL}/tags/popular?limit=5"

# 2. 所有標籤
test_api "2. 獲取所有標籤" "${BASE_URL}/tags?page=1&limit=10"

# 3. 標籤詳情
test_api "3. 獲取標籤詳情 (travel)" "${BASE_URL}/tags/travel"

# 4. 標籤下的文章
test_api "4. 獲取標籤下的文章" "${BASE_URL}/tags/travel/posts?page=1&limit=5"

# 5. 綜合搜尋
test_api "5. 綜合搜尋 (旅遊)" "${BASE_URL}/search?q=旅遊&type=all"

# 6. 搜尋文章
test_api "6. 搜尋文章 (分享)" "${BASE_URL}/search/posts?q=分享&page=1&limit=5"

# 7. 搜尋用戶
test_api "7. 搜尋用戶 (Alice)" "${BASE_URL}/search/users?q=Alice&page=1&limit=5"

# 8. 搜尋文件
test_api "8. 搜尋文件 (pdf)" "${BASE_URL}/search/files?q=pdf&page=1&limit=5"

# 9. 搜尋標籤
test_api "9. 搜尋標籤 (旅)" "${BASE_URL}/search/tags?q=旅&page=1&limit=5"

# 10. 搜尋建議
test_api "10. 搜尋建議 (美)" "${BASE_URL}/search/suggestions?q=美"

echo "================================="
echo "✅ 所有測試完成！"
