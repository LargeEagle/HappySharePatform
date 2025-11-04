@echo off
REM ============================================================================
REM HappyShare Platform - Windows 開發環境停止腳本
REM ============================================================================
REM 功能：安全地停止所有開發服務
REM ============================================================================

echo.
echo [停止] 停止 HappyShare 開發服務...
echo.

REM 停止端口 5000 (後端)
echo [清理] 清理端口 5000 (後端)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    taskkill /F /PID %%a >nul 2>nul
    if !ERRORLEVEL! EQU 0 (
        echo [成功] 後端服務已停止 (PID: %%a)
    )
)

REM 停止端口 8081 (前端)
echo [清理] 清理端口 8081 (前端)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8081') do (
    taskkill /F /PID %%a >nul 2>nul
    if !ERRORLEVEL! EQU 0 (
        echo [成功] 前端服務已停止 (PID: %%a)
    )
)

REM 停止相關進程
taskkill /F /IM "node.exe" /FI "WINDOWTITLE eq HappyShare*" >nul 2>nul

echo.
echo [成功] 所有服務已停止
echo.

pause
