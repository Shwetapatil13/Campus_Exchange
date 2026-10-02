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

---

## 🎓 Java Spring Boot Interview Preparation Guide (35 Technical Q&As)

<details>
<summary><strong>Click to Expand 35 Spring Boot & Full-Stack Interview Questions & Detailed Answers</strong></summary>

### 1. What is Spring Boot and why use it over plain Spring?
Spring Boot provides auto-configuration, embedded application servers (Tomcat/Jetty), and opinionated starter dependencies that eliminate complex XML/Java configuration files, allowing developers to create standalone production-grade Spring applications rapidly.

### 2. Explain Inversion of Control (IoC) and Dependency Injection (DI).
Inversion of Control means the control of object creation and lifecycle management is transferred from the application code to the Spring IoC container. Dependency Injection is the pattern used to supply dependencies (objects) to a class rather than the class creating them itself.

### 3. Why use constructor injection over `@Autowired` on fields?
Constructor injection guarantees required dependencies are not null, enforces immutability (`final` fields), enables easier unit testing with Mockito without starting a Spring Context, and prevents circular dependency issues at compile time.

### 4. What is a Spring Bean and its scopes?
A Spring Bean is an object managed by the Spring IoC Container. Common scopes include `singleton` (default, one instance per container), `prototype` (new instance per request), `request`, `session`, and `application`.

### 5. Controller vs. Service vs. Repository layers?
- **Controller**: Handles HTTP endpoints, requests, and DTO serialization.
- **Service**: Enforces business logic, transactional boundaries, and authorization rules.
- **Repository**: Handles database persistence using Spring Data JPA.

### 6. Why use DTOs instead of returning JPA entities directly?
DTOs prevent entity serialization issues (circular references), protect sensitive database fields (passwords), optimize payload sizes, and decouple API contracts from database schema modifications.

### 7. How does JWT authentication work in Spring Security?
When a user logs in, the server generates a signed JSON Web Token containing claims. Subsequent requests attach this token in the `Authorization: Bearer <token>` header. A custom `OncePerRequestFilter` parses the token, verifies its signature, loads `UserDetails`, and populates `SecurityContextHolder`.

### 8. How did you validate product ownership in CampusExchange?
We extract the logged-in user's ID directly from the `SecurityContext` (`UserPrincipal`). In `ProductService`, we verify that the current user ID matches the product seller ID before executing update or delete operations, returning `403 Forbidden` if unauthorized.

### 9. What is `@Transactional` and how does it work?
`@Transactional` defines a database transaction boundary. Spring uses AOP proxies to begin a transaction before method execution and automatically commit it upon success, or roll back if an unhandled RuntimeException occurs.

### 10. How does duplicate wishlist prevention work in CampusExchange?
We combine a database-level `UniqueConstraint` on `wishlists(user_id, product_id)` with a service-level check using `wishlistRepository.existsByUserIdAndProductId(...)` throwing a `DuplicateResourceException` (`409 Conflict`).

### 11. How does dynamic search and pagination work in Spring Data JPA?
We pass a `Pageable` object (`PageRequest.of(page, size, sort)`) into a custom JPQL query with optional filter parameters. Spring Data JPA automatically appends SQL `LIKE`, `LIMIT`, and `OFFSET` clauses directly at the database engine level.

### 12. Explain `@ManyToOne` vs `@OneToMany` relationships.
`@ManyToOne` is placed on the owning side of the relationship containing the foreign key (e.g. `Product` referencing `User`). `@OneToMany(mappedBy = "seller")` is placed on the non-owning side to indicate the inverse mapping.

### 13. What is BCrypt password hashing?
BCrypt is a password hashing function based on the Blowfish cipher. It incorporates a salt to protect against rainbow table attacks and an adaptive work factor (cost parameter) to defend against brute-force attacks.

### 14. What is CORS and how is it configured in Spring Security?
Cross-Origin Resource Sharing (CORS) is an HTTP-header based security mechanism that restricts resources requested from a different domain/origin. In Spring Security, we configure `CorsConfigurationSource` to allow HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) and headers from trusted frontend origins.

### 15. How does Global Exception Handling work in Spring Boot?
Annotated with `@RestControllerAdvice`, `GlobalExceptionHandler` intercepts exceptions thrown across controllers using `@ExceptionHandler` methods and formats them into a structured JSON `ErrorResponse` payload with appropriate HTTP status codes.

</details>

---

## 📜 License
Developed for academic demo and full-stack software engineering interview preparation.
© 2026 CampusExchange Team.
