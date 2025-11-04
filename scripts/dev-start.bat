@echo off
REM ============================================================================
REM HappyShare Platform - Windows 開發環境啟動腳本
REM ============================================================================
REM 功能：
REM   - 環境檢查
REM   - 停止舊進程
REM   - 啟動後端服務
REM   - 啟動前端服務
REM   - 顯示訪問 URL
REM
REM 使用：
REM   scripts\dev-start.bat          # 啟動前後端
REM   scripts\dev-start.bat backend  # 只啟動後端
REM   scripts\dev-start.bat frontend # 只啟動前端
REM
REM 停止服務：
REM   scripts\dev-stop.bat
REM ============================================================================

setlocal enabledelayedexpansion

REM 設置專案根目錄
set SCRIPT_DIR=%~dp0
set PROJECT_ROOT=%SCRIPT_DIR%..

REM 顯示橫幅
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║                                                          ║
echo ║           HAPPY SHARE 社交平台 - 開發環境              ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM ============================================================================
REM 環境檢查
REM ============================================================================
echo [檢查] 檢查開發環境...
echo.

REM 檢查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [錯誤] Node.js 未安裝
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [成功] Node.js: %NODE_VERSION%

REM 檢查 npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [錯誤] npm 未安裝
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [成功] npm: %NPM_VERSION%

echo.

REM ============================================================================
REM 檢查依賴
REM ============================================================================
echo [檢查] 檢查項目依賴...
echo.

REM 檢查後端依賴
if not exist "%PROJECT_ROOT%\backend\node_modules" (
    echo [警告] 後端依賴未安裝
    set /p install_backend="是否現在安裝後端依賴？(Y/N): "
    if /i "!install_backend!"=="Y" (
        echo [安裝] 安裝後端依賴...
        cd /d "%PROJECT_ROOT%\backend"
        call npm install
        if %ERRORLEVEL% NEQ 0 (
            echo [錯誤] 後端依賴安裝失敗
            exit /b 1
        )
    ) else (
        echo [錯誤] 後端依賴未安裝，無法繼續
        exit /b 1
    )
) else (
    echo [成功] 後端依賴已安裝
)

REM 檢查前端依賴
if not exist "%PROJECT_ROOT%\frontend\node_modules" (
    echo [警告] 前端依賴未安裝
    set /p install_frontend="是否現在安裝前端依賴？(Y/N): "
    if /i "!install_frontend!"=="Y" (
        echo [安裝] 安裝前端依賴...
        cd /d "%PROJECT_ROOT%\frontend"
        call npm install
        if %ERRORLEVEL% NEQ 0 (
            echo [錯誤] 前端依賴安裝失敗
            exit /b 1
        )
    ) else (
        echo [錯誤] 前端依賴未安裝，無法繼續
        exit /b 1
    )
) else (
    echo [成功] 前端依賴已安裝
)

echo.

REM ============================================================================
REM 清理舊進程
REM ============================================================================
echo [清理] 清理舊進程...
echo.

REM 停止端口 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    taskkill /F /PID %%a >nul 2>nul
)

REM 停止端口 8081
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8081') do (
    taskkill /F /PID %%a >nul 2>nul
)

echo [成功] 清理完成
echo.

REM ============================================================================
REM 解析啟動模式
REM ============================================================================
set MODE=%1
if "%MODE%"=="" set MODE=all

REM ============================================================================
REM 啟動後端
REM ============================================================================
if "%MODE%"=="backend" goto START_BACKEND
if "%MODE%"=="all" goto START_BACKEND
goto START_FRONTEND

:START_BACKEND
echo [啟動] 啟動後端服務 (NestJS)...
echo.

cd /d "%PROJECT_ROOT%\backend"
start "HappyShare Backend" cmd /c "npm run start:dev"

echo [等待] 等待後端服務就緒 (端口 5000)...
call :WAIT_FOR_PORT 5000 90
if %ERRORLEVEL% NEQ 0 (
    echo [錯誤] 後端服務啟動失敗
    exit /b 1
)

echo [成功] 後端服務啟動成功
echo          URL: http://localhost:5000/api
echo          健康檢查: http://localhost:5000/api/health
echo.

if "%MODE%"=="backend" goto SHOW_STATUS

REM ============================================================================
REM 啟動前端
REM ============================================================================
:START_FRONTEND
if "%MODE%"=="frontend" goto DO_START_FRONTEND
if "%MODE%"=="all" goto DO_START_FRONTEND
goto SHOW_STATUS

:DO_START_FRONTEND
echo [啟動] 啟動前端服務 (Expo Web)...
echo.

cd /d "%PROJECT_ROOT%\frontend"
start "HappyShare Frontend" cmd /c "npm run web"

echo [等待] 等待前端服務就緒 (端口 8081)...
echo          注意: Metro bundler 可能需要 30-60 秒進行初始編譯
call :WAIT_FOR_PORT 8081 120
if %ERRORLEVEL% NEQ 0 (
    echo [錯誤] 前端服務啟動失敗
    exit /b 1
)

echo [成功] 前端服務啟動成功
echo          URL: http://localhost:8081
echo.

REM ============================================================================
REM 顯示狀態
REM ============================================================================
:SHOW_STATUS
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║               🎉 所有服務已啟動完成！                  ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo [訪問] 服務訪問地址：
echo.
echo    前端應用:    http://localhost:8081
echo    後端 API:    http://localhost:5000/api
echo    健康檢查:    http://localhost:5000/api/health
echo.
echo [測試] 測試帳號：
echo.
echo    管理員: admin@happyshare.com / Admin123!
echo    用戶1:  alice@happyshare.com / Password123!
echo    用戶2:  bob@happyshare.com   / Password123!
echo.
echo [停止] 停止服務： scripts\dev-stop.bat
echo.
echo [成功] 開發環境已就緒，開始愉快地開發吧！🚀
echo.

goto END

REM ============================================================================
REM 等待端口函數
REM ============================================================================
:WAIT_FOR_PORT
set PORT=%1
set MAX_WAIT=%2
set ELAPSED=0

:WAIT_LOOP
if %ELAPSED% GEQ %MAX_WAIT% (
    echo [超時] 端口 %PORT% 在 %MAX_WAIT% 秒後仍未就緒
    exit /b 1
)

netstat -an | findstr ":%PORT% " | findstr "LISTENING" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    REM 端口已開啟，再等待 2 秒確保服務完全就緒
    timeout /t 2 /nobreak >nul
    exit /b 0
)

timeout /t 1 /nobreak >nul
set /a ELAPSED+=1
goto WAIT_LOOP

:END
endlocal
