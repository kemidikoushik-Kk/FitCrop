# FitCorp Architecture & Technical Design

## 1. System Overview

**FitCorp** is an enterprise-grade full-stack health and fitness platform engineered specifically for corporate professionals aged 22–45. It combines personalized progressive exercise programming and conservative macronutrient meal planning with corporate calendar synchronization to eliminate burnout, meeting conflicts, and scheduling friction.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|  React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query + Lucide + Recharts |
+-----------------------------------------+-----------------------------------------+
                                          | HTTPS / REST JSON (JWT Bearer)
                                          v
+-----------------------------------------------------------------------------------+
|                                 REVERSE PROXY                                     |
|                       Nginx (Port 80/443 -> Port 8080)                            |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                           SPRING BOOT 3.3.5 BACKEND                               |
|                                                                                   |
|  [Security Filter Chain]  <--->  [JwtAuthenticationFilter]  <--->  [UserPrincipal]|
|                                                                                   |
|  [REST Controllers]                                                               |
|    AuthController, ProfileController, GoalController, ExerciseController,         |
|    WorkoutController, NutritionController, ScheduleController,                    |
|    ProgressController, NotificationController, AdminController, DashboardController|
|                                                                                   |
|  [Service & Recommendation Engines Layer]                                         |
|    - WorkoutRecommendationService (Equipment, Experience, Corporate Express 30m)   |
|    - NutritionRecommendationService (BMR/TDEE, Safe Macro Split, Allergy Exclusions)|
|    - ScheduleOptimizationService (Meeting conflict detection, Open workout slots) |
|    - ProgressService & AuditLogService                                            |
|                                                                                   |
|  [Spring Data JPA Repositories]                                                   |
+-----------------------------------------+-----------------------------------------+
                                          | JDBC / Hibernate Validator
                                          v
+-----------------------------------------------------------------------------------+
|                                DATABASE LAYER                                     |
|           PostgreSQL 16 (Production) / H2 in PG-Compatibility Mode (Local Dev)   |
|           Versioned Database Migrations: Flyway V1 -> V14                         |
+-----------------------------------------------------------------------------------+
```

---

## 2. Layered Architecture Principles

FitCorp strictly implements the standard **Controller-Service-Repository-Domain** pattern with explicit separation of concerns:

1. **Presentation Layer (`com.fitcorp.*.controller`)**:
   - Exposes RESTful endpoints versioned at `/api/v1/`.
   - Validates incoming request payloads via Jakarta Validation (`@Valid`, `@NotNull`, `@Min`, etc.).
   - Wraps standard JSON responses in `ApiResponse<T>` or `PageResponse<T>`.

2. **Security & Authentication Layer (`com.fitcorp.security`)**:
   - Stateless JWT authentication via `JwtAuthenticationFilter`.
   - Access tokens (15-minute lifespan) paired with UUID-based database refresh tokens (7-day lifespan).
   - Role-Based Access Control (`ROLE_USER`, `ROLE_ADMIN`) enforced via `@PreAuthorize`.

3. **Domain Business Logic & Recommendation Engines (`com.fitcorp.*.service`)**:
   - `WorkoutRecommendationService`: Evaluates biometrics, experience level (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`), preferred duration (`30`, `45`, `60` min), and equipment access (`FULL_GYM`, `DUMBBELLS_ONLY`, `BODYWEIGHT_ONLY`).
   - `NutritionRecommendationService`: Calculates Basal Metabolic Rate using Mifflin-St Jeor formula and applies Total Daily Energy Expenditure (TDEE) multipliers. Enforces conservative metabolic calorie floors (&ge;1200 kcal female / &ge;1500 kcal male). Strictly filters out configured food allergens.
   - `ScheduleOptimizationService`: Intersects corporate work hours and scheduled meetings with available workout windows.

4. **Persistence Layer (`com.fitcorp.*.repository` & JPA Entities)**:
   - Managed exclusively by **Flyway migrations** (`V1__` to `V14__`).
   - In production profile (`application-prod.yml`), Hibernate DDL auto-generation is set to `validate` to guarantee zero unmanaged schema drift.

---

## 3. Safe Wellness Boundaries

FitCorp is built on strict wellness and physical safety principles:
- **Calorie Floors**: Prevents crash dieting by clamping minimum calories to 1,200 kcal/day for females and 1,500 kcal/day for males regardless of aggressive deficits.
- **Progressive Overload**: Automatically assigns beginner exercises for users with under 6 months training experience, limiting high-risk Olympic/heavy compound movements until intermediate milestones are met.
- **Strict Allergen Exclusions**: Disallows any recipe or food item containing tagged allergens (e.g., Dairy, Gluten, Peanuts, Tree Nuts, Shellfish, Soy, Eggs) from appearing in generated meal plans.
- **Meeting Conflict Resolution**: Automatically warns users if corporate meetings collide with planned workout windows.
