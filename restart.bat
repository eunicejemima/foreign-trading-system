@echo off
echo Stopping all Java processes...
taskkill /F /IM java.exe /T >nul 2>&1
timeout /t 3 /nobreak
echo Starting Spring Boot application...
cd /d d:\project\foreign-trading-system
java -jar target/foreign-trading-system-0.0.1-SNAPSHOT.jar
pause
