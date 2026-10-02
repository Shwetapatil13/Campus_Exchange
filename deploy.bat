@echo off
echo ===================================================
echo   CampusExchange Production Deployment Script
echo ===================================================
echo.

echo Step 1: Building Backend Production Executable JAR...
cd backend
call ..\..\..\..\apache-maven\apache-maven-3.9.9\bin\mvn.cmd package -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] Backend build failed!
    exit /b %errorlevel%
)
cd ..

echo.
echo Step 2: Building Frontend Production Bundle...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    exit /b %errorlevel%
)
cd ..

echo.
echo Step 3: Launching Docker Compose Stack...
docker-compose up -d --build

echo.
echo ===================================================
echo   Deployment Complete!
echo   Frontend (Nginx): http://localhost
echo   Backend (Spring Boot): http://localhost:8080
echo ===================================================
