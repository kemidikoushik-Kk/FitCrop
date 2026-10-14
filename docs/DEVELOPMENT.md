# FitCorp Local Development Guide

## 1. Prerequisites

To build and run FitCorp locally, ensure you have the following installed:
- **Java**: OpenJDK 21 LTS (`Temurin-21.0.12.1+1` or newer)
- **Maven**: 3.9.0 or newer
- **Node.js**: v20 LTS (v20.18.0+)
- **npm**: v10+
- **Docker & Docker Compose** (Optional, for running with local PostgreSQL 16)

---

## 2. Running Backend Locally

### Option A: Local Dev Profile (H2 In-Memory with Flyway)
If PostgreSQL is not running locally, the `dev` profile uses an embedded PostgreSQL-compatible H2 database that executes the exact same Flyway migrations (V1 to V14):

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
- Server starts at: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Option B: Local Production Profile (PostgreSQL 16)
If PostgreSQL is running on `localhost:5432`:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

---

## 3. Running Frontend Locally

From the `frontend` directory:

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start Vite hot-reloading development server
npm run dev
```

The frontend will run at `http://localhost:5173`. Requests to `/api/v1` are automatically proxied to `http://localhost:8080` via Vite's proxy configuration in `vite.config.ts`.

---

## 4. Running Backend Tests

To run the complete test suite:

```bash
cd backend
mvn test
```

This executes all service, recommendation engine, and security controller unit tests:
- `WorkoutRecommendationServiceTest`
- `NutritionRecommendationServiceTest`
- `ScheduleOptimizationServiceTest`
- `ProgressServiceTest`
- `AuthControllerTest`

---

## 5. Building for Production

### Frontend Production Bundle:
```bash
cd frontend
npm run build
```
Generates optimized static HTML, CSS, and JS bundles in `frontend/dist/`.

### Backend Production Fat JAR:
```bash
cd backend
mvn clean package -DskipTests
```
Generates executable JAR in `backend/target/fitcorp-backend-1.0.0.jar`.
