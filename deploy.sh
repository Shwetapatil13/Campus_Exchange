#!/bin/bash
set -e

echo "==================================================="
echo "  CampusExchange Production Deployment Script"
echo "==================================================="
echo ""

echo "Step 1: Building Backend Production Executable JAR..."
cd backend
./mvnw package -DskipTests || mvn package -DskipTests
cd ..

echo ""
echo "Step 2: Building Frontend Production Bundle..."
cd frontend
npm run build
cd ..

echo ""
echo "Step 3: Launching Docker Compose Stack..."
docker-compose up -d --build

echo ""
echo "==================================================="
echo "  Deployment Complete!"
echo "  Frontend (Nginx): http://localhost"
echo "  Backend (Spring Boot): http://localhost:8080"
echo "==================================================="
