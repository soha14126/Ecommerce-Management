@echo off
echo ============================================
echo  ShopEasy - Online Shopping System Setup
echo ============================================
echo.

REM Step 1: Install backend dependencies
echo [1/2] Installing backend dependencies...
cd /d "%~dp0backend"
npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed. Make sure Node.js is installed.
    pause
    exit /b 1
)
echo.
echo [2/2] Dependencies installed successfully!
echo.
echo ============================================
echo  NEXT STEPS:
echo ============================================
echo.
echo 1. Setup MySQL database:
echo    - Open MySQL Workbench or phpMyAdmin
echo    - Run the file: backend\database.sql
echo.
echo 2. Configure your MySQL password:
echo    - Open: backend\.env
echo    - Set DB_PASSWORD=your_mysql_password
echo.
echo 3. Start the server:
echo    cd backend
echo    npm start
echo.
echo 4. Open the website:
echo    - Open frontend\index.html in your browser
echo    - OR use VS Code Live Server extension
echo.
echo ============================================
pause
