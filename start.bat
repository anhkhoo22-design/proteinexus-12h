@echo off
cd /d "%~dp0"
title Proteinexus - Lop 12H
where node >nul 2>nul
if errorlevel 1 (
  echo Hay cai Node.js 22.13 tro len de chay ung dung.
  pause
  exit /b 1
)
echo Proteinexus: http://localhost:3000
start "" http://localhost:3000
node server.js
pause
