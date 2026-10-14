# FitCorp Security Architecture & Compliance

## 1. Authentication & Session Security

FitCorp adheres to OWASP security best practices for token-based authentication:

### Short-Lived Access Tokens
- **Lifespan**: 15 minutes (`900,000` ms).
- **Algorithm**: HMAC-SHA256 with cryptographically robust secret key.
- **Payload**: Subject (`email`), User ID, and Granted Authorities (`ROLE_USER`, `ROLE_ADMIN`).
- **Storage**: Retained in secure client memory/storage and transmitted via the `Authorization: Bearer <token>` header.

### Rotating Database Refresh Tokens
- **Lifespan**: 7 days (`604,800,000` ms).
- **Format**: High-entropy UUID stored in the PostgreSQL `refresh_tokens` table.
- **Rotation**: Every time a refresh token is exchanged via `POST /api/v1/auth/refresh`, the previous token is invalidated and a fresh pair is minted.
- **Revocation**: Logging out via `POST /api/v1/auth/logout` immediately deletes the refresh token record from the database.

---

## 2. Password Hashing & Credentials Protection

- Passwords are encrypted before database insertion using the **BCrypt** adaptive hashing function with a work factor of 10.
- Raw passwords are never logged, stored in cache, or returned in API responses.
- Passwords must meet minimum complexity requirements (minimum 8 characters, uppercase, lowercase, numbers, and symbols).

---

## 3. Data Protection & Resource Ownership

Every resource query in FitCorp enforces strict tenant/user boundary isolation:
- Entity lookups (e.g., workout plans, daily meals, body measurements) verify that the requesting user's ID matches the owner of the record.
- Any attempt to access or modify records belonging to other corporate users triggers a `403 Forbidden` response.
- Administrative endpoints (`/api/v1/admin/**`) are safeguarded by Spring Security `@PreAuthorize("hasRole('ADMIN')")`.

---

## 4. Safe Wellness Guardrails

To prevent health risks:
- **Calorie Minimums**: The nutrition engine rejects deficits lower than 1,200 kcal/day (female) and 1,500 kcal/day (male).
- **Allergen Filtration**: Hard constraint filtering ensures zero allergens are present in suggested meals.
- **Medical Disclaimers**: Displayed prominently across the landing page, registration screen, and main navigation banner.
