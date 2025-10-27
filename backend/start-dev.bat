@echo off
echo ========================================
echo 後端開發環境啟動腳本
echo ========================================
echo.

REM 檢查 MongoDB 是否運行
echo [1/3] 檢查 MongoDB 服務...
sc query MongoDB | find "RUNNING" >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ MongoDB 服務正在運行
) else (
    echo × MongoDB 服務未運行
    echo.
    echo 嘗試啟動 MongoDB 服務...
    net start MongoDB >nul 2>&1
    if %errorlevel% == 0 (
        echo ✓ MongoDB 服務已啟動
    ) else (
        echo × 無法啟動 MongoDB 服務
        echo.
        echo 請確保:
        echo 1. 已安裝 MongoDB
        echo 2. MongoDB 已配置為 Windows 服務
        echo 3. 或手動運行: mongod
        echo.
        echo 替代方案: 使用 MongoDB Atlas 雲端數據庫
        echo https://www.mongodb.com/cloud/atlas
        pause
        exit /b 1
    )
)

echo.
echo [2/3] 檢查 Node.js 依賴...
if not exist "node_modules" (
    echo 安裝依賴包...
    call npm install
) else (
    echo ✓ 依賴包已安裝
)

echo.
echo [3/3] 啟動後端服務器...
echo.
echo ========================================
echo 服務器將在 http://localhost:5000 運行
echo 按 Ctrl+C 停止服務器
echo ========================================
echo.

call npm run dev
