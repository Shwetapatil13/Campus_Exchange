# CampusExchange — Production Deployment Guide

This guide details three production deployment options for **CampusExchange**:
1. [Option 1: Docker & Docker Compose (Recommended)](#option-1-docker--docker-compose)
2. [Option 2: Standalone Executable Production JAR + Nginx / Static Host](#option-2-standalone-production-jar)
3. [Option 3: Cloud Platform Deployment (Render / Railway / AWS)](#option-3-cloud-platform-deployment)

---

## 🚀 Option 1: Docker & Docker Compose (Recommended)

Docker Compose provisions MySQL 8.0, Spring Boot 3.3 Backend, and Nginx Frontend as containerized services connected via an isolated internal network.

### Prerequisites:
- Docker Desktop or Docker Engine installed and running.

### 1-Click Launch Command:
```bash
# Windows
.\deploy.bat

# Linux / macOS
chmod +x deploy.sh && ./deploy.sh
```

Or manually:
```bash
docker-compose up -d --build
```

### Services Provisioned:
- **Frontend (Nginx Reverse Proxy)**: `http://localhost` (Port 80)
- **Backend API (Spring Boot)**: `http://localhost:8080` (Port 8080)
- **MySQL Database**: `localhost:3306` (Port 3306)

---

## 📦 Option 2: Standalone Production JAR

### Step 1: Package Backend Executable FAT JAR
```bash
cd backend
mvn package -DskipTests
```
The production JAR file will be generated at:
`backend/target/campus-exchange-backend-1.0.0.jar`

### Step 2: Build Frontend Bundle
```bash
cd frontend
npm run build
```
The static production assets will be generated in:
`frontend/dist/`

### Step 3: Run Backend executable
```bash
java -jar backend/target/campus-exchange-backend-1.0.0.jar
```
*Note: Ensure MySQL is running on `localhost:3306` with database `campusexchange`.*

---

## ☁️ Option 3: Cloud Platform Deployment

### Deploying to Render / Railway:
1. **Push Repository to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy CampusExchange production stack"
   git push origin main
   ```
2. **Database Service**: Create a managed MySQL database instance on Railway or Render. Set connection environment variables:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
3. **Backend Service**:
   - Environment: `Java 21`
   - Build Command: `cd backend && ./mvnw package -DskipTests`
   - Start Command: `java -jar backend/target/campus-exchange-backend-1.0.0.jar`
4. **Frontend Service**:
   - Environment: `Static Site / Node`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Set environment variable / proxy to backend URL.

---

## 🔒 Production Security Checklist

- [x] Change `JWT_SECRET` in `.env` to a secure 256-bit random key.
- [x] Disable `spring.jpa.show-sql` in production `application.yml`.
- [x] Restrict `spring.jpa.hibernate.ddl-auto` to `validate` or use Liquibase / Flyway migrations.
- [x] Ensure CORS allowed origins only permit your production domain.
