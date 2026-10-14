# FitCorp Deployment & Operations Guide

## 1. Quick Start With Docker Compose

The simplest way to run FitCorp in an isolated, production-like environment is via Docker Compose:

```bash
# 1. Clone repository and navigate to root
cd d:/FitCrop

# 2. Copy and configure environment variables
cp .env.example .env

# 3. Launch PostgreSQL, Spring Boot backend, and Nginx frontend
docker-compose up --build -d
```

Once running:
- **Web Application**: Access `http://localhost` (proxied by Nginx on port 80).
- **Backend API Direct**: `http://localhost:8080/api/v1`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui/index.html`
- **Actuator Health Check**: `http://localhost:8080/actuator/health`

---

## 2. Docker Architecture

The `docker-compose.yml` orchestrates three isolated services:

1. **`postgres` Service**:
   - Image: `postgres:16-alpine`
   - Volume: `postgres_data:/var/lib/postgresql/data`
   - Automated initialization via `database/init-db.sql`.
   - Healthcheck: `pg_isready -U postgres -d fitcorp`

2. **`backend` Service**:
   - Multi-stage build (`backend/Dockerfile`):
     - Stage 1: Maven build packaging fat JAR.
     - Stage 2: Eclipse Temurin JRE 21 runtime running as non-root user.
   - Waits for PostgreSQL healthcheck before launching.
   - Executes Flyway migrations automatically upon startup.

3. **`frontend` Service**:
   - Multi-stage build (`frontend/Dockerfile`):
     - Stage 1: Node.js 20 build producing production static bundle (`dist/`).
     - Stage 2: Alpine Nginx serving static assets and reverse proxying `/api/` traffic to the backend.

---

## 3. Environment Variables Reference

| Variable | Default Value | Description |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` | Active Spring profile (`dev`, `prod`, `test`). |
| `DB_HOST` | `postgres` | Hostname of the PostgreSQL server. |
| `DB_PORT` | `5432` | Database port. |
| `DB_NAME` | `fitcorp` | PostgreSQL database name. |
| `DB_USER` | `postgres` | Database username. |
| `DB_PASSWORD` | `postgres` | Database password. |
| `JWT_SECRET` | `ChangeMeInProduction` | 256-bit secret key for HMAC-SHA signing JWT tokens. |
| `JWT_EXPIRATION_MS` | `900000` | Access token lifespan (15 minutes). |
| `JWT_REFRESH_EXPIRATION_MS` | `604800000` | Refresh token lifespan (7 days). |

---

## 4. Production Hardening Checklist

- [ ] Rotate `JWT_SECRET` with a cryptographically secure 512-bit random string.
- [ ] Ensure `spring.jpa.hibernate.ddl-auto` is set to `validate`.
- [ ] Configure HTTPS/TLS certificates (e.g., Let's Encrypt / Certbot) on Nginx.
- [ ] Enable rate-limiting and DDoS mitigation at the reverse proxy layer.
- [ ] Set up automated PostgreSQL database backups (`pg_dump`).
