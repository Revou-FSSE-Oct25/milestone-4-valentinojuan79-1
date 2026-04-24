# 🏦 Revobank API

Revobank is a robust backend system for a modern banking application. Built with **NestJS**, it provides secure authentication, account management, and reliable transaction processing with full data integrity.

---

## 🌟 Project Overview

Revobank is designed to handle core banking operations. It allows users to register and manage multiple bank accounts (Savings, Checking), perform secure fund transfers, and handle deposits or withdrawals. The system ensures that no transaction occurs without proper authorization and sufficient balance.

---

## 🚀 Features Implemented

- **Authentication & Security**
  - User Registration & Login with JWT (JSON Web Tokens)
  - Password hashing using Bcrypt
  - Protected routes via Auth Guards

- **Account Management (CRUD)**
  - Create and manage multiple bank accounts
  - View account details and real-time balances

- **Transaction Engine**
  - **Withdrawal:** Secure fund removal with balance validation
  - **Transfer:** Peer-to-peer fund transfers between accounts
  - **Deposit:** Instant fund top-up with automatic balance recalculation


---

## 🛠️ Technologies Used

| Category   | Technology                              |
|------------|-----------------------------------------|
| Framework  | [NestJS](https://nestjs.com/)           |
| ORM        | [Prisma](https://www.prisma.io/)        |
| Database   | PostgreSQL (Hosted on Supabase)         |
| Security   | Passport-JWT, Bcrypt                   |
| Testing    | Jest, Supertest                         |
| Deployment | [Railway](https://railway.app/)         |

---

## 🚦 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Revou-FSSE-Oct25/milestone-4-valentinojuan79-1
cd milestone-4-valentinojuan79-1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/revobank"
JWT_SECRET="your_super_secret_key"
```

### 4. Database Setup & Migration

Push the Prisma schema to your database:

```bash
# Generate Prisma Client and apply migrations to local DB
npx prisma migrate dev --name init_revobank

# To apply migrations in a production/staging environment:
npx prisma migrate deploy
```

### 5. Run the Project

```bash
# Development mode
npm run start:dev
```

### 6. Run Tests

To verify all business logic and endpoints:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

---

## 📖 Documentation & Demo

- **Live Demo (Railway):** https://milestone-4-valentinojuan79-1-production.up.railway.app/
- **Swagger Docs:** https://milestone-4-valentinojuan79-1-production.up.railway.app/docs
