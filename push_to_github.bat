@echo off
chcp 65001 >nul
title Dong bo Proteinexus len GitHub va Render
cd /d "%~dp0"
echo ====================================================================
echo    DONG BO PROTEINEXUS LEN GITHUB & RENDER ONLINE
echo ====================================================================
echo.
echo Thu muc ma nguon: %CD%
echo Dang ket noi toi https://github.com/anhkhoo22-design/proteinexus-12h ...
echo.
echo * Chu y: Neu trinh duyet bat cua so hoi dang nhap GitHub, ban chi can
echo   bam "Sign in with your browser" de xac nhan la xong!
echo.
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    git push -u origin main --force
) else if exist "C:\Users\84387\bin\git\cmd\git.exe" (
    "C:\Users\84387\bin\git\cmd\git.exe" push -u origin main --force
) else if exist "%ProgramFiles%\Git\cmd\git.exe" (
    "%ProgramFiles%\Git\cmd\git.exe" push -u origin main --force
) else (
    git push -u origin main --force
)
echo.
if %ERRORLEVEL% EQU 0 (
    echo ====================================================================
    echo   [THANH CONG RUC RO!] Code da day len GitHub thanh cong.
    echo   Render dang tu dong cap nhat web online trong 1 phut toi.
    echo   Link web: https://proteinexus-12h.onrender.com
    echo ====================================================================
) else (
    echo ====================================================================
    echo   [CHUA THANH CONG]
    echo   Neu trinh duyet co cua so dang nhap GitHub, ban nho bam dang nhap nhe!
    echo ====================================================================
)
echo.
pause
