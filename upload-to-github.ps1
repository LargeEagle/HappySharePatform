# HAPPY SHARE - GitHub Upload Script (PowerShell)
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "HAPPY SHARE - GitHub Upload Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Step 1: Check Git
Write-Host "Step 1: Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/download/win" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Step 2: Configure Git
Write-Host "Step 2: Configuring Git..." -ForegroundColor Yellow
$userName = git config --global user.name
if (-not $userName) {
    $userName = Read-Host "Enter your GitHub username"
    git config --global user.name $userName
}
$userEmail = git config --global user.email
if (-not $userEmail) {
    $userEmail = Read-Host "Enter your GitHub email"
    git config --global user.email $userEmail
}
Write-Host "Git configured for: $userName <$userEmail>" -ForegroundColor Green
Write-Host ""

# Step 3: Initialize repository
Write-Host "Step 3: Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path .git) {
    Write-Host "Repository already initialized." -ForegroundColor Green
} else {
    git init
    Write-Host "Repository initialized!" -ForegroundColor Green
}
Write-Host ""

# Step 4: Add files
Write-Host "Step 4: Adding all files..." -ForegroundColor Yellow
git add .
Write-Host "Files added!" -ForegroundColor Green
Write-Host ""

# Step 5: Create commit
Write-Host "Step 5: Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: HAPPY SHARE 社交平台"
Write-Host "Commit created!" -ForegroundColor Green
Write-Host ""

# Step 6: Setup remote
Write-Host "Step 6: Setting up GitHub remote..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Before continuing, please:" -ForegroundColor Cyan
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Create a new repository named: social-media-platform" -ForegroundColor White
Write-Host "3. DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
Write-Host "4. Copy the repository URL" -ForegroundColor White
Write-Host ""
$repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/social-media-platform.git)"

try {
    git remote remove origin 2>$null
} catch {}
git remote add origin $repoUrl
Write-Host "Remote added!" -ForegroundColor Green
Write-Host ""

# Step 7: Rename branch
Write-Host "Step 7: Renaming branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "Branch renamed!" -ForegroundColor Green
Write-Host ""

# Step 8: Push to GitHub
Write-Host "Step 8: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may be prompted for your GitHub credentials." -ForegroundColor Cyan
Write-Host ""
try {
    git push -u origin main
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "SUCCESS! Your project is now on GitHub!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL: $repoUrl" -ForegroundColor Cyan
} catch {
    Write-Host ""
    Write-Host "ERROR: Push failed!" -ForegroundColor Red
    Write-Host "This might be due to:" -ForegroundColor Yellow
    Write-Host "- Invalid repository URL" -ForegroundColor White
    Write-Host "- Authentication issues" -ForegroundColor White
    Write-Host "- Network problems" -ForegroundColor White
    Write-Host ""
    Write-Host "Please check and try again." -ForegroundColor Yellow
}
Write-Host ""
Read-Host "Press Enter to exit"
