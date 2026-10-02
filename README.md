# CampusExchange — Secure Campus Marketplace

CampusExchange is a full-stack, production-ready campus marketplace web application built using **Java 21**, **Spring Boot 3.3**, **Spring Security (JWT)**, **Spring Data JPA**, **Hibernate**, **MySQL**, **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.

It enables university students to discover, buy, sell, wishlist, and manage second-hand products (laptops, books, cycles, calculators, hostel furniture, etc.) securely within their university campus.

---

## 📋 Table of Contents
1. [Project Overview & Problem Statement](#-project-overview--problem-statement)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Architecture & Design Principles](#-architecture--design-principles)
5. [Backend Package Structure](#-backend-package-structure)
6. [Database Schema & Entity Relationships](#-database-schema--entity-relationships)
7. [API Documentation](#-api-documentation)
8. [Setup & Installation Instructions](#-setup--installation-instructions)
9. [Development Credentials & Seeding](#-development-credentials--seeding)
10. [Postman Testing](#-postman-testing)
11. [Interview Preparation Guide (35 Technical Q&As)](#-interview-preparation-guide)

---

## 🎯 Project Overview & Problem Statement

### Problem:
College students frequently need to buy or sell second-hand textbooks, electronics, cycles, and hostel furniture. Generic online classifieds expose students to public strangers, safety concerns, high shipping costs, and fraudulent listings.

### Solution:
**CampusExchange** provides an exclusive, student-only trading platform restricted to university campuses. Students can post listings, discover items nearby, wishlist products, and contact sellers directly for instant in-person campus meetups.

---

## ✨ Key Features

- **Secure JWT Authentication**: Register and login with BCrypt password hashing and stateless JWT bearer tokens.
- **Product Management (CRUD)**: Create, view, update, and delete products with image upload support.
- **Ownership Authorization**: Backend verifies that only the original seller can modify or delete their product (403 Forbidden enforcement).
- **Search, Filter & Pagination**: Server-side keyword search across title/description/category, filtering by category, condition, price range, availability, and multi-field sorting (`price asc/desc`, `createdAt desc`).
- **Wishlist Management**: Add/remove products with duplicate entry prevention (Unique Constraint on `user_id` + `product_id`).
- **Notifications System**: Real-time activity notifications (e.g. when a student wishlists your item) with unread counters.
- **Seller Contact Modal**: Reveals verified seller email and phone number for direct campus communication.
- **Responsive Startup UI**: Sleek Light/Dark mode, glassmorphic header, mobile drawer navigation, live card preview, toast alerts, and skeleton loaders.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend Framework** | Java 21 / Spring Boot 3.3.4 |
| **Security** | Spring Security 6, JWT (JJWT 0.12.6), BCrypt Password Encoder |
| **Persistence** | Spring Data JPA, Hibernate ORM |
| **Database** | MySQL 8.0 |
| **Validation** | Jakarta Bean Validation (`@NotBlank`, `@Email`, `@Positive`, `@Size`) |
| **Frontend Framework**| React 18, TypeScript 5, Vite 5 |
| **Styling & UI** | Tailwind CSS 3, Lucide Icons, Framer Motion |
| **HTTP Client** | Axios with Request/Response Interceptors |
| **Testing** | JUnit 5, Mockito, H2 Database, Spring Security Test |

---

## 🏛️ Architecture & Design Principles

```
Client (React App)
       │
       ▼ (HTTP REST Requests + Authorization: Bearer <JWT>)
┌─────────────────────────────────────────────────────────┐
│                    Spring Boot 3.3                      │
│                                                         │
│   JwtAuthenticationFilter ──► SecurityFilterChain       │
│                                      │                  │
│                                      ▼                  │
│                             Controller Layer            │
│                                      │                  │
│                                      ▼                  │
│                              Service Layer              │
│                       (Business Logic & Ownership)      │
│                                      │                  │
│                                      ▼                  │
│                             Repository Layer            │
│                            (Spring Data JPA)            │
└─────────────────────────────────────────────────────────┘
                                       │
                                       ▼ (Hibernate SQL)
                                 MySQL Database
```

### Layered Separation of Concerns:
- **Controller Layer**: Handles HTTP requests/responses, path variables, request params, and delegates business logic to services. Never contains raw SQL or entity persistence logic.
- **Service Layer**: Houses core business logic, transaction management (`@Transactional`), ownership validation (checking JWT user ID against entity seller ID), and DTO mappings.
- **Repository Layer**: Extends `JpaRepository` and handles database access via JPQL query methods.
- **DTOs**: Data Transfer Objects isolate internal database entities from external REST responses, avoiding circular JSON serialization issues and hiding passwords.

---

## 📂 Backend Package Structure

```
com.campusexchange
├── CampusExchangeApplication.java
│
├── config
│   ├── DataInitializer.java (Seeder)
│   └── WebConfig.java (Resource Handlers & CORS)
│
├── controller
│   ├── AuthController.java
│   ├── ProductController.java
│   ├── WishlistController.java
│   ├── NotificationController.java
│   └── UserController.java
│
├── dto
│   ├── AuthResponse.java
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   ├── ProductRequest.java
│   ├── ProductResponse.java
│   ├── UserResponse.java
│   ├── WishlistResponse.java
│   ├── NotificationResponse.java
│   └── PagedResponse.java
│
├── entity
│   ├── User.java
│   ├── Product.java
│   ├── Wishlist.java
│   ├── Notification.java
│   ├── Role.java (Enum)
│   ├── Category.java (Enum)
│   ├── Condition.java (Enum)
│   └── NotificationType.java (Enum)
│
├── exception
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   ├── UnauthorizedAccessException.java
│   ├── DuplicateResourceException.java
│   ├── ErrorResponse.java
│   └── GlobalExceptionHandler.java
│
├── repository
│   ├── UserRepository.java
│   ├── ProductRepository.java
│   ├── WishlistRepository.java
│   └── NotificationRepository.java
│
├── security
│   ├── SecurityConfig.java
│   ├── JwtService.java
│   ├── JwtAuthenticationFilter.java
│   ├── CustomUserDetailsService.java
│   └── UserPrincipal.java
│
└── service
    ├── AuthService.java
    ├── UserService.java
    ├── ProductService.java
    ├── WishlistService.java
    ├── NotificationService.java
    └── FileStorageService.java
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

- **User 1 ---- * Product**: Defined via `@OneToMany(mappedBy = "seller")` on User and `@ManyToOne` on Product.
- **User 1 ---- * Wishlist**: Defined via `@ManyToOne` on Wishlist referencing User.
- **Product 1 ---- * Wishlist**: Defined via `@ManyToOne` on Wishlist referencing Product.
- **Unique Constraint (`uk_user_product`)**: Enforced on `wishlists(user_id, product_id)` to prevent duplicate wishlist items at the DB engine level.

---

## 📡 API Documentation

### Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new student account |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token |
| `GET` | `/api/products` | Paginated product search & filtering |
| `GET` | `/api/products/{id}` | Get product details by ID |
| `GET` | `/api/products/featured` | Get fresh campus items |
| `GET` | `/uploads/**` | Serve uploaded product image files |

### Authenticated Endpoints (Header `Authorization: Bearer <JWT>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/products` | Create a new product listing |
| `PUT` | `/api/products/{id}` | Update product details (Seller only) |
| `DELETE` | `/api/products/{id}` | Delete product listing (Seller only) |
| `PATCH` | `/api/products/{id}/toggle-availability` | Toggle Active / Sold status |
| `POST` | `/api/products/{id}/image` | Upload product image |
| `GET` | `/api/products/my-products` | Get current user's listed products |
| `POST` | `/api/wishlist/{productId}` | Add product to wishlist |
| `DELETE` | `/api/wishlist/{productId}` | Remove product from wishlist |
| `GET` | `/api/wishlist` | Get user's saved wishlist |
| `GET` | `/api/notifications` | Get user notifications |
| `PATCH` | `/api/notifications/{id}/read` | Mark notification as read |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications as read |
| `GET` | `/api/users/me` | Get user profile |
| `PUT` | `/api/users/me` | Update user profile info |
| `POST` | `/api/users/change-password` | Change password |

---

## ⚡ Setup & Installation Instructions

### Prerequisites:
- Java 17 or Java 21 LTS
- Node.js v18+ and npm
- MySQL Server 8.0 running on localhost:3306

### Step 1: Database Setup
Launch MySQL CLI or Workbench and create the database:
```sql
CREATE DATABASE campusexchange;
```

### Step 2: Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Verify `src/main/resources/application.yml` MySQL credentials (`root` / `root`):
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/campusexchange?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
       username: root
       password: root
   ```
3. Run backend unit tests:
   ```bash
   mvn test
   ```
4. Start Spring Boot Server:
   ```bash
   mvn spring-boot:run
   ```
   *The backend runs on `http://localhost:8080`.*

### Step 3: Frontend Setup
1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start Vite Dev Server:
   ```bash
   npm run dev
   ```
   *The frontend runs on `http://localhost:5173`.*

---

## 🔑 Development Credentials & Seeding

On startup, `DataInitializer.java` automatically seeds sample users, 12 realistic products across categories, wishlist items, and notifications.

| User Email | Password | Role | Campus / College |
| :--- | :--- | :--- | :--- |
| `alex@campus.edu` | `Password123!` | `USER` | Stanford University |
| `sarah@campus.edu` | `Password123!` | `USER` | MIT Tech Campus |
| `rahul@campus.edu` | `Password123!` | `USER` | IIT Bombay |
| `admin@campus.edu` | `AdminPassword123!` | `ADMIN` | Campus Administration |

*Tip: Click the 1-Click Demo Buttons on the Login Page to log in instantly!*

---

## 🧪 Postman Testing

A ready-to-use Postman collection is located at:
`docs/CampusExchange.postman_collection.json`

1. Open Postman -> Click **Import** -> Select `CampusExchange.postman_collection.json`.
2. Execute `Authentication -> 2. Login`. The collection script automatically captures the returned JWT token into `{{authToken}}`.
3. All authenticated product, wishlist, and user endpoints will automatically attach `Authorization: Bearer {{authToken}}`.

---

## 🎓 Interview Preparation Guide

### 1. What is Spring Boot and why did you choose it for CampusExchange?
Spring Boot is an extension of the Spring framework that eliminates boilerplate XML/Java configuration through auto-configuration and starter dependencies. I chose it for CampusExchange because it provides embedded Tomcat, production-grade metrics, seamless Data JPA integration, and robust Spring Security features out of the box.

### 2. Explain the layered architecture used in CampusExchange.
We followed a strict 3-tier architecture:
- **Controller**: Exposes REST API endpoints and handles HTTP request/response serialization.
- **Service**: Implements business rules, transaction boundaries (`@Transactional`), and authorization checks.
- **Repository**: Manages data persistence using Spring Data JPA.
This separation ensures low coupling, high testability, and prevents business logic leakage into controllers or queries into views.

### 3. How does Dependency Injection (DI) and Inversion of Control (IoC) work here?
Inversion of Control means object lifecycle creation and dependency wiring are delegated to the Spring IoC Container rather than being instantiated using `new`. We used **constructor-based dependency injection** with `@RequiredArgsConstructor` (Lombok), which ensures immutable dependencies, easier unit testing with Mockito mocks, and prevents NullPointerExceptions.

### 4. What is a Spring Bean?
A Spring Bean is an object managed, instantiated, wired, and scoped by the Spring IoC container. Annotations like `@Component`, `@Service`, `@Repository`, `@RestController`, and `@Bean` mark classes as Spring Beans.

### 5. Why do we use DTOs instead of returning Entities directly?
1. **Security**: Hides sensitive entity fields like password hashes or internal database IDs.
2. **Prevent Serialization Errors**: Prevents circular reference loops (e.g., User -> Product -> User) during Jackson JSON serialization.
3. **API Stability**: Decouples external API contracts from internal database schema refactoring.

### 6. How is user password stored safely in the database?
Passwords are never stored in plain text. We use Spring Security's `BCryptPasswordEncoder`, which applies a key derivation function with an adaptive work factor and random salting to protect against rainbow table and brute-force attacks.

### 7. How does JWT Authentication work in CampusExchange?
1. The user logs in via `POST /api/auth/login`.
2. Upon verification, `JwtService` creates a signed JWT containing claims (`id`, `email`, `role`) signed using HMAC SHA-256 (`jjwt`).
3. The client stores the JWT and sends it in the `Authorization: Bearer <token>` header for subsequent requests.
4. `JwtAuthenticationFilter` intercepts requests, validates the token signature/expiration, extracts `UserPrincipal`, and populates `SecurityContextHolder`.

### 8. How did you validate product ownership during update/delete operations?
We extract the current authenticated user's ID directly from the `SecurityContext` (`@AuthenticationPrincipal UserPrincipal currentUser`). In `ProductService`, we verify:
`if (!product.getSeller().getId().equals(currentUser.getId())) throw new UnauthorizedAccessException("Forbidden");`
We NEVER trust a user ID sent from the frontend request body or path parameter for ownership authorization.

### 9. How did you handle duplicate wishlist entries?
We implemented a multi-layered defense:
1. Database-level `UniqueConstraint` on `wishlists(user_id, product_id)`.
2. Service-level check via `wishlistRepository.existsByUserIdAndProductId(...)` throwing `DuplicateResourceException` (409 Conflict).

### 10. How does pagination and search filtering work in `ProductRepository`?
We use Spring Data JPA `Pageable` along with JPQL custom `@Query` using optional parameters:
```java
@Query("SELECT p FROM Product p WHERE " +
       "(:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
       "(:category IS NULL OR p.category = :category) AND " +
       "(:minPrice IS NULL OR p.price >= :minPrice)")
Page<Product> filterProducts(... Pageable pageable);
```
This performs SQL filtering directly in MySQL using database indexes (`idx_product_category`, `idx_product_price`) rather than loading records into JVM memory.

---

## 📜 License & Copyright
Developed for academic demo and software engineering interview preparation.
© 2026 CampusExchange Team.
