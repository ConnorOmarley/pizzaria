@echo off
title Pizzaria Taurus
cd /d "%~dp0"
echo ============================================
echo   PIZZARIA TAURUS - Sistema Local
echo ============================================
echo.

rem Verifica o PHP (Herd / instalado no sistema)
where php >nul 2>nul
if errorlevel 1 (
    echo [ERRO] PHP nao encontrado. Instale o PHP ou o Laravel Herd.
    pause
    exit /b 1
)

echo Iniciando o servidor em http://localhost:8081 ...
echo.
start /b "" php -S localhost:8081 -t "%~dp0"

timeout /t 2 /nobreak >nul

start http://localhost:8081
echo.
echo ============================================
echo   SISTEMA EM FUNCIONAMENTO
echo   Pressione qualquer tecla ou feche esta
echo   janela para encerrar.
echo ============================================
pause >nul