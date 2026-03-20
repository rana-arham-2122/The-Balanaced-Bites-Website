#!/usr/bin/env pwsh

Write-Host "`n╔════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "       DETAILED DEBUGGING REPORT`n" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════╝`n" -ForegroundColor Green

# Kill previous Node processes
Write-Host "[STEP 1] Clearing Node processes..." -ForegroundColor Yellow
$processes = Get-Process node -ErrorAction SilentlyContinue
if ($processes) {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Killed $(($processes | Measure-Object).Count) Node process(es)" -ForegroundColor Green
} else {
    Write-Host "✅ No Node processes running" -ForegroundColor Green
}

Start-Sleep -Seconds 2

# Check Ports
Write-Host "`n[STEP 2] Port Status..." -ForegroundColor Yellow
$port5000 = netstat -ano 2>$null | Select-String ":5000" | Select-String "LISTEN"
$port5173 = netstat -ano 2>$null | Select-String ":5173" | Select-String "LISTEN"

if ($port5000) {
    Write-Host "❌ Port 5000 is IN USE: $port5000" -ForegroundColor Red
} else {
    Write-Host "✅ Port 5000 is FREE" -ForegroundColor Green
}

if ($port5173) {
    Write-Host "❌ Port 5173 is IN USE: $port5173" -ForegroundColor Red
} else {
    Write-Host "✅ Port 5173 is FREE" -ForegroundColor Green
}

# Check ENV file
Write-Host "`n[STEP 3] Environment Configuration..." -ForegroundColor Yellow
$envPath = "D:\Work Place\Web_Project\balanced-bites-complete\backend\.env"
if (Test-Path $envPath) {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    $mongoUri = Select-String -Path $envPath -Pattern "MONGO_URI"
    if ($mongoUri) {
        Write-Host "✅ MONGO_URI configured" -ForegroundColor Green
        Write-Host "   Value: $($mongoUri.Line)" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ .env file NOT found" -ForegroundColor Red
}

# Check Node and npm
Write-Host "`n[STEP 4] Node.js & npm Installation..." -ForegroundColor Yellow
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green

Write-Host "`n[STEP 5] Starting Backend Server..." -ForegroundColor Yellow
cd "D:\Work Place\Web_Project\balanced-bites-complete\backend"
Write-Host "Current Directory: $(Get-Location)" -ForegroundColor Cyan
Write-Host "Starting MongoDB connection test..." -ForegroundColor Cyan
node test-mongo.js

Write-Host "`n[STEP 6] Backend Server Status..." -ForegroundColor Yellow
Write-Host "Starting backend on port 5000..." -ForegroundColor Cyan
node src/server.js &
$backendPid = $PID
Start-Sleep -Seconds 3

# Check if backend started
$backendCheck = netstat -ano 2>$null | Select-String ":5000" | Select-String "LISTEN"
if ($backendCheck) {
    Write-Host "✅ Backend is LISTENING on port 5000" -ForegroundColor Green
} else {
    Write-Host "❌ Backend FAILED to start on port 5000" -ForegroundColor Red
}

Write-Host "`nDebugging Report Complete!" -ForegroundColor Green
