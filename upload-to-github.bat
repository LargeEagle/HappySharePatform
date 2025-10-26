@echo off
echo =====================================
echo HAPPY SHARE - GitHub Upload Script
echo =====================================
echo.

cd /d "%~dp0"

echo Step 1: Checking Git installation...
git --version
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH!
    echo Please install Git from https://git-scm.com/download/win
    pause
    exit /b 1
)
echo Git is installed successfully!
echo.

echo Step 2: Configuring Git (if not already configured)...
git config --global user.name >nul 2>&1
if errorlevel 1 (
    set /p username="Enter your GitHub username: "
    git config --global user.name "%username%"
)

git config --global user.email >nul 2>&1
if errorlevel 1 (
    set /p email="Enter your GitHub email: "
    git config --global user.email "%email%"
)
echo Git configuration complete!
echo.

echo Step 3: Initializing Git repository...
if exist .git (
    echo Repository already initialized.
) else (
    git init
    echo Repository initialized!
)
echo.

echo Step 4: Adding all files...
git add .
echo Files added!
echo.

echo Step 5: Creating initial commit...
git commit -m "Initial commit: HAPPY SHARE 社交平台"
echo Commit created!
echo.

echo Step 6: Setting up GitHub remote...
echo.
echo Before continuing, please:
echo 1. Go to https://github.com/new
echo 2. Create a new repository named: social-media-platform
echo 3. DO NOT initialize with README, .gitignore, or license
echo 4. Copy the repository URL
echo.
set /p repo_url="Enter your GitHub repository URL (e.g., https://github.com/username/social-media-platform.git): "

git remote remove origin >nul 2>&1
git remote add origin %repo_url%
echo Remote added!
echo.

echo Step 7: Renaming branch to main...
git branch -M main
echo Branch renamed!
echo.

echo Step 8: Pushing to GitHub...
echo You may be prompted for your GitHub credentials.
git push -u origin main
echo.

if errorlevel 1 (
    echo.
    echo ERROR: Push failed!
    echo This might be due to:
    echo - Invalid repository URL
    echo - Authentication issues
    echo - Network problems
    echo.
    echo Please check and try again.
    pause
    exit /b 1
)

echo =====================================
echo SUCCESS! Your project is now on GitHub!
echo =====================================
echo.
echo Repository URL: %repo_url%
echo.
pause
