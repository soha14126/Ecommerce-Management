@echo off
echo ==============================================
echo  ShopEasy Backend Server - Startup Helper
echo ==============================================
echo.
echo [1] Checking Node.js...
node -v || (echo Node.js not found! Please install from nodejs.org && pause && exit /b 1)
echo.
echo [2] Checking dependencies...
if not exist node_modules (
    echo node_modules missing. Installing...
    npm install
)
echo.
echo [3] Starting server...
echo.
node server.js
echo.
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Server crashed. Please check your MySQL credentials in .env
    pause
)
pause
