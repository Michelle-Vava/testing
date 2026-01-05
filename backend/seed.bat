@echo off
cd /d "%~dp0"
npx prisma db seed
pause
