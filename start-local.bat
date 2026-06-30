@echo off
cd /d "%~dp0"
echo.
echo === Duru ULV yerel sunucu (PHP) ===
echo Adres: http://127.0.0.1:8080/fiyat-teklifi/index.html
echo.
echo NOT: python -m http.server form maili CALISTIRMAZ (HTTP 501 hatasi).
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING"') do (
  echo Port 8080 kullanan islem sonlandiriliyor: PID %%a
  taskkill /PID %%a /F >nul 2>&1
)

timeout /t 1 /nobreak >nul
echo PHP baslatiliyor... Kapatmak icin Ctrl+C
echo.
php -S 127.0.0.1:8080
