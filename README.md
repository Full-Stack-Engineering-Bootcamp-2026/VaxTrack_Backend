<div align="center">

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />

<br /><br />

# VaxTrack Backend

**Backend API for the VaxTrack Vaccination Management System**  
Built with Node.js, Express, TypeScript, PostgreSQL, TypeORM, and JWT Authentication.

[Getting Started](#installation--setup) · [Features](#backend-features) · [Architecture](#backend-architecture) · [API Overview](#api-modules) · [Tech Stack](#tech-stack)

</div>

---

## Overview

VaxTrack Backend powers the complete server-side architecture of the VaxTrack vaccination management platform. It provides secure APIs, authentication, role-based authorization, vaccination management workflows, reporting capabilities, notification handling, and healthcare administration functionalities.

The backend is designed using scalable modular architecture with TypeScript, Express, TypeORM, dependency injection, middleware-based validation, and PostgreSQL.

### Core Responsibilities

- Authentication and authorization
- Guardian and dependent management
- Vaccination scheduling and record tracking
- Overdue vaccination workflows
- Vaccine catalog management
- Staff management
- Notification handling
- Dashboard analytics
- Reporting APIs
- Secure JWT session handling

---

## User Roles

| Role | Responsibility |
|------|----------------|
| `GUARDIAN` | Manages dependents and vaccination tracking |
| `STAFF` | Records vaccinations and manages overdue schedules |
| `ADMIN` | Manages staff, reports, vaccines, and system operations |

---

## Backend Features

- JWT authentication with role-based authorization
- Modular, scalable architecture
- Dependency Injection via TypeDI
- PostgreSQL integration with TypeORM
- Middleware-based request validation (Joi)
- Centralized error handling
- Pagination and dynamic filtering
- RESTful API design
- Overdue vaccination automation
- Vaccination reporting APIs
- Notification workflows

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | TypeORM |
| Authentication | JWT |
| Validation | Joi |
| Dependency Injection | TypeDI |
| Password Hashing | bcrypt |
| Environment Management | dotenv |
| API Testing | Postman |
| Development Tooling | Nodemon |

---

## Backend Architecture

```
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Database
```

| Layer | Responsibility |
|-------|----------------|
| Routes | Define API endpoints and attach middleware |
| Controllers | Handle HTTP requests and responses |
| Services | Contain core business logic |
| Repositories | Manage database queries via TypeORM |
| Middleware | Validation, authentication, error handling |

---

## Project Structure

```
src/
├── config/                 # Environment and database configuration
│
├── controllers/            # Route handler functions
│   ├── auth/
│   ├── guardian/
│   ├── dependent/
│   ├── vaccination/
│   ├── vaccine/
│   ├── staff/
│   ├── notification/
│   └── report/
│
├── services/               # Business logic layer
│   ├── auth/
│   ├── guardian/
│   ├── dependent/
│   ├── vaccination/
│   ├── vaccine/
│   ├── staff/
│   ├── notification/
│   └── report/
│
├── repositories/           # TypeORM database access layer
│
├── entities/               # TypeORM entity definitions
│
├── middleware/
│   ├── auth/               # JWT verification
│   ├── validation/         # Joi schema validators
│   └── error/              # Centralized error handler
│
├── routes/                 # Express route definitions
│
├── utils/                  # Shared utility functions
│
├── types/                  # TypeScript type definitions
│
├── app.ts
└── server.ts
```

---

## API Modules

| Module | Description |
|--------|-------------|
| Auth | Registration, login, JWT token management |
| Guardian | Guardian profile and account management |
| Dependent | Dependent creation and tracking |
| Vaccination | Scheduling, recording, and status tracking |
| Overdue | Overdue detection and workflow handling |
| Vaccine Catalog | Add, update, and manage vaccines |
| Staff | Staff creation and role assignment |
| Notifications | Guardian notification delivery |
| Reports | Analytics and vaccination reporting |
| Dashboard | Role-specific statistics and summaries |

---

## Authentication Flow

```
Client Request
  ↓
Auth Middleware (JWT Verification)
  ↓
Role Authorization Check
  ↓
Controller → Service → Repository
  ↓
Response
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=vaxtrack
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <backend-repository-url>
cd VaxTrack_Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Fill in your database and JWT credentials
```

### 4. Run Database Migrations

```bash
npm run migration:run
```

### 5. Start Development Server

```bash
npm run dev
```

The API runs at `http://localhost:3000`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Nodemon |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run migration:run` | Run pending database migrations |
| `npm run migration:revert` | Revert the last migration |

---

## Engineering Challenges Solved

- Designing a clean layered architecture with clear separation of concerns
- Implementing role-based access control across all API routes
- Building automated overdue vaccination detection workflows
- Structuring TypeORM repositories for complex relational queries
- Handling pagination and dynamic filtering efficiently
- Centralized error handling across the entire API surface
- Managing dependency injection with TypeDI across services

---

## Future Improvements

- [ ] WebSocket support for real-time notifications
- [ ] Scheduled background jobs for overdue detection (cron)
- [ ] Rate limiting and API throttling
- [ ] Swagger / OpenAPI documentation
- [ ] Unit and integration test coverage
- [ ] Docker containerization
- [ ] CI/CD pipeline setup

---

## Related Repository

> Frontend Repository: `<frontend-repository-url>`

---

## Author
 
Built by **Yash Kalange and Sanskar Rajput** — a healthcare-focused vaccination management backend system designed for guardians, healthcare staff, and administrators.