# FitCorp

> **Personalized Gym Training & Nutrition Planner for Corporate Professionals**

[![CI/CD Pipeline](https://github.com/fitcorp/fitcorp/actions/workflows/ci.yml/badge.svg)](https://github.com/fitcorp/fitcorp/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Java 21 LTS](https://img.shields.io/badge/Java-21%20LTS-blue.svg)](https://adoptium.net)
[![Spring Boot 3.3.5](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)](https://www.typescriptlang.org)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ed.svg)](https://www.docker.com)

---

## 🏢 Executive Overview

Corporate professionals aged 22–45 face unique challenges: high-stress work weeks, 8+ hours of sedentary desk time, unpredictable meeting schedules, and inconsistent nutrition. Generic fitness apps prescribe rigid 90-minute workouts and unsustainable crash diets that lead to burnout and abandonment.

**FitCorp** is an enterprise-grade full-stack platform engineered to fit fitness seamlessly into the modern corporate workday:
- **Express 30–45 Minute Workouts**: Evidence-based resistance training splits optimized for corporate gyms, home dumbbells, or hotel bodyweight.
- **Corporate Schedule Synchronization**: Automatically detects calendar meetings and identifies conflict-free workout slots (morning, lunch, or evening).
- **Conservative Nutrition Floors**: Strict metabolic safety guardrails ensuring daily calories never drop below &ge;1,200 kcal (female) / &ge;1,500 kcal (male).
- **Executive Habit Tracking**: Real streak analytics, weight trajectories, and desk hydration reminders.

---

## ⚡ Instant Demo Credentials

The platform comes pre-seeded with sample corporate profiles:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Corporate Professional** | `alex@fitcorp.com` | `User@123` | Full access to workouts, meals, calendar, progress, and settings. |
| **System Administrator** | `admin@fitcorp.com` | `Admin@123` | Admin console, user governance, exercise catalog, food database. |

---

## 🛠️ Technology Stack

### Backend
- **Language & Runtime**: Java 21 LTS (Eclipse Temurin)
- **Framework**: Spring Boot 3.3.5
- **Security**: Spring Security 6 with stateless JWT authentication (HMAC-SHA256, 15-min access token + rotating 7-day database refresh tokens)
- **Data Persistence**: Spring Data JPA & Hibernate with Jakarta Validation
- **Database**: PostgreSQL 16 (Production) / H2 in PostgreSQL compatibility mode (Local Dev)
- **Schema Management**: Flyway database migrations (V1 to V14)
- **API Documentation**: Springdoc OpenAPI 2.6.0 with Swagger UI (`/swagger-ui/index.html`)

### Frontend
- **Framework**: React 18 with TypeScript 5.6 & Vite
- **Styling**: Tailwind CSS with dark/light mode and custom corporate color system
- **State & Data Fetching**: TanStack Query (React Query) & Axios with auto-refresh interceptors
- **Visual Analytics**: Recharts (Weight trend line charts, consistency bar charts, macro distribution)
- **Icons & UI Primitives**: Lucide React, Radix-style custom accessible modals, glassmorphism panels

### Infrastructure & DevOps
- **Containerization**: Multi-stage Docker builds for backend (JRE 21) and frontend (Alpine Nginx)
- **Orchestration**: Docker Compose with PostgreSQL 16, Spring Boot backend, and Nginx reverse proxy
- **CI/CD**: GitHub Actions workflow validating Maven tests and Vite production builds

---

## 🚀 Quick Start Guide

### 1. Run via Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/fitcorp/fitcorp.git
cd fitcorp

# Copy environment variables
cp .env.example .env

# Launch full stack
docker-compose up --build -d
```

- **Web Application**: Open [http://localhost](http://localhost) in your browser.
- **Backend API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
- **Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Actuator Health**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

---

### 2. Run Locally Without Docker

#### Backend:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
*(Starts on `http://localhost:8080` using embedded PostgreSQL-compatible H2 database with Flyway migrations V1–V14)*

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```
*(Starts on `http://localhost:5173` with automated proxy to backend on port 8080)*

---

## 🩺 Safe Wellness Boundaries & Medical Disclaimer

FitCorp incorporates medical and wellness safety constraints:
1. **Prominent Health Disclaimers**: Displayed prominently across the landing page, registration screen, and workspace navigation banners.
2. **Conservative Caloric Floors**: The recommendation engine enforces a strict floor (&ge;1200 kcal/day for females, &ge;1500 kcal/day for males).
3. **Allergen Filtration**: Zero recipes with user-declared food allergens (Dairy, Gluten, Peanuts, Tree Nuts, Shellfish, Eggs, Soy) are suggested.
4. **Physician Consultation**: Users must acknowledge that FitCorp is for informational guidance and does not replace medical advice.

---

## 📖 In-Depth Documentation

- [Architecture & Recommendation Engines](docs/ARCHITECTURE.md)
- [Database Schema & Migrations](docs/DATABASE.md)
- [REST API Reference](docs/API.md)
- [Deployment & Operations](docs/DEPLOYMENT.md)
- [Security & Compliance](docs/SECURITY.md)
- [Local Development Guide](docs/DEVELOPMENT.md)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
