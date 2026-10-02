# 🎓 CampusExchange — Full-Stack Campus Marketplace

<p align="center">
  <a href="https://campus-exchange-gamma.vercel.app">
    <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-campus--exchange--gamma.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <img src="https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/Java-21_LTS-007396?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

---

> 🔗 **Live Application URL**: [https://campus-exchange-gamma.vercel.app](https://campus-exchange-gamma.vercel.app)
> 
> 📁 **GitHub Repository**: [https://github.com/Shwetapatil13/Campus_Exchange](https://github.com/Shwetapatil13/Campus_Exchange)

---

## 📌 Executive Summary

**CampusExchange** is a secure, campus-only full-stack marketplace web application built to enable university students to buy, sell, and wishlist pre-loved items (laptops, engineering textbooks, gear cycles, calculators, hostel furniture, etc.) directly within their campus community.

It features a layered **Spring Boot 3.3** backend paired with a modern **React 18 + TypeScript + Vite + Tailwind CSS** frontend. The system enforces strict ownership authorization, stateless **JWT authentication**, **BCrypt** password hashing, JPQL multi-field search and pagination, duplicate wishlist prevention, and real-time seller notifications.

---

## 🌟 Key Features & Capabilities

- 🔐 **JWT Authentication & Security**: Stateless JWT authentication with custom claims (`userId`, `email`, `role`) and BCrypt password encryption.
- 🛍️ **Product Management (CRUD)**: Complete product creation, updating, deletion, and availability status toggling (Active vs. Sold).
- 🛡️ **Backend Ownership Authorization**: Strict backend validation ensuring only the seller who listed a product can edit or delete it (`403 Forbidden` for unauthorized attempts).
- 🔍 **Dynamic Search, Filter & Pagination**: Keyword search matching title/description/category, multi-parameter filtering (category, condition, price range, availability), and database-level pagination metadata.
- 💖 **Wishlist & Duplicate Prevention**: One-click wishlist toggling backed by a SQL unique constraint (`user_id`, `product_id`) to prevent duplicate records.
- 🔔 **Activity Notifications**: Automated notifications generated for sellers when another student wishlists their item, complete with unread badge polling.
- 📱 **Startup-Grade UI & UX**: Light/Dark mode toggle, glassmorphic headers, mobile drawer navigation, live card preview, toast alerts, and skeleton loaders.

---

## 🏗️ Layered Architecture & Request Flow

The application follows a clean 3-tier architecture with strict separation of concerns:

```
[ Client: React + TypeScript ]
               │
               ▼ (HTTP REST API + Header: "Authorization: Bearer <JWT>")
┌─────────────────────────────────────────────────────────────┐
│                    Spring Boot 3.3                          │
│                                                             │
│   JwtAuthenticationFilter ──► SecurityFilterChain           │
│                                      │                      │
│                                      ▼                      │
│                             Controller Layer                │
│                         (HTTP Requests & DTOs)              │
│                                      │                      │
│                                      ▼                      │
│                              Service Layer                  │
│                     (Business Logic & Ownership)            │
│                                      │                      │
│                                      ▼                      │
│                             Repository Layer                │
│                        (Spring Data JPA / JPQL)             │
└─────────────────────────────────────────────────────────────┘
                                       │
                                       ▼ (Hibernate SQL)
                                 MySQL Database
```

---

## 🗄️ Database Schema & Entity Relationships

```
┌──────────────┐          ┌──────────────┐
│    USERS     │1       * │   PRODUCTS   │
├──────────────┼─────────►├──────────────┤
│ id (PK)      │          │ id (PK)      │
│ name         │          │ title        │
│ email (UQ)   │          │ price        │
│ password     │          │ category     │
│ phone        │          │ condition    │
│ college      │          │ location     │
│ role         │          │ available    │
└──────┬───────┘          │ seller_id(FK)│
       │                  └──────┬───────┘
       │1                        │1
       │                         │
       │*                        │*
┌──────┴───────┐          ┌──────┴───────┐
│  WISHLISTS   │          │ NOTIFICATIONS│
├──────────────┤          ├──────────────┤
│ id (PK)      │          │ id (PK)      │
│ user_id (FK) │          │ message      │
│ product_id(FK)          │ type         │
│ (UNIQUE UK)  │          │ is_read      │
└──────────────┘          │ user_id (FK) │
                          └──────────────┘
```

---

## 📡 REST API Endpoint Reference

### Public API Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new student account |
| `POST` | `/api/auth/login` | Authenticate and get JWT token |
| `GET` | `/api/products` | Paginated product search & filtering |
| `GET` | `/api/products/{id}` | Get product details by ID |
| `GET` | `/api/products/featured` | Get fresh campus listings |
| `GET` | `/uploads/**` | Serve uploaded product images |

### Authenticated API Endpoints (Header: `Authorization: Bearer <JWT>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/products` | Create a new product listing |
| `PUT` | `/api/products/{id}` | Update product details (Seller only) |
| `DELETE` | `/api/products/{id}` | Delete product listing (Seller only) |
| `PATCH` | `/api/products/{id}/toggle-availability` | Toggle Active / Sold status |
| `POST` | `/api/products/{id}/image` | Upload product image |
| `GET` | `/api/products/my-products` | Get user's listed products |
| `POST` | `/api/wishlist/{productId}` | Add product to wishlist |
| `DELETE` | `/api/wishlist/{productId}` | Remove product from wishlist |
| `GET` | `/api/wishlist` | Get user's saved wishlist |
| `GET` | `/api/notifications` | Get notifications |
| `PATCH` | `/api/notifications/{id}/read` | Mark notification as read |
| `GET` | `/api/users/me` | Get user profile |
| `PUT` | `/api/users/me` | Update user profile info |
| `POST` | `/api/users/change-password` | Change user password |

---

## 🔑 Development Test Credentials

On application startup, `DataInitializer` seeds 4 test accounts along with 12 sample campus products:

| Email | Password | Role | College |
| :--- | :--- | :--- | :--- |
| `alex@campus.edu` | `Password123!` | `USER` | Stanford University |
| `sarah@campus.edu` | `Password123!` | `USER` | MIT Tech Campus |
| `rahul@campus.edu` | `Password123!` | `USER` | IIT Bombay |
| `admin@campus.edu` | `AdminPassword123!` | `ADMIN` | Campus Administration |

---

## 🛠️ Local Installation & Setup

### 1. Database Setup
Ensure MySQL Server 8.0 is running on `localhost:3306`:
```sql
CREATE DATABASE campusexchange;
```

### 2. Backend Setup
```bash
cd backend
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080`.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🐳 Production Docker Deployment

Run the complete multi-container production stack (MySQL + Spring Boot + Nginx):
```bash
docker-compose up -d --build
```
- **Frontend Web App (Nginx)**: `http://localhost`
- **Backend API (Spring Boot)**: `http://localhost:8080`
© 2026 CampusExchange Team.
