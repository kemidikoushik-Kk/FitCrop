# FitCorp Database Schema & Migration Guide

## 1. Overview & Tooling

FitCorp utilizes **PostgreSQL 16** managed strictly through **Flyway versioned migrations** located in:
`backend/src/main/resources/db/migration/`

In production, Hibernate is configured with:
```yaml
spring.jpa.hibernate.ddl-auto: validate
```
This ensures database schema consistency, preventing automatic table alterations and ensuring all schema modifications pass through audited version-controlled SQL files.

---

## 2. Migration History (V1 to V14)

| Migration | File | Description |
|---|---|---|
| **V1** | `V1__create_roles.sql` | Enum-backed system roles (`ROLE_USER`, `ROLE_ADMIN`). |
| **V2** | `V2__create_users.sql` | `users`, `user_roles`, and `refresh_tokens` tables with UUID keys and BCrypt passwords. |
| **V3** | `V3__create_user_profiles.sql` | `user_profiles` storing biometrics (height, weight, BMI), corporate hours, equipment, and diet styles. |
| **V4** | `V4__create_fitness_goals.sql` | `fitness_goals` catalog and `user_goals` mappings. |
| **V5** | `V5__create_exercises.sql` | `exercises` movement library with muscle groups, equipment, difficulty, instructions, and safety notes. |
| **V6** | `V6__create_workout_tables.sql` | `workout_plans`, `workout_days`, `workout_exercises`, `workout_logs`, and `exercise_logs`. |
| **V7** | `V7__create_food_tables.sql` | `food_items` verified nutritional library with macro breakdowns and allergen tags. |
| **V8** | `V8__create_meal_tables.sql` | `meal_plans`, `meals`, `meal_items`, and daily `nutrition_logs`. |
| **V9** | `V9__create_progress_tables.sql` | Daily `progress_entries` and anthropometric `body_measurements` logs. |
| **V10** | `V10__create_schedule_tables.sql` | `work_schedules` (core working hours) and `schedule_events` (corporate meetings and workout blocks). |
| **V11** | `V11__create_notification_tables.sql` | `notifications` message store and user `notification_preferences`. |
| **V12** | `V12__create_admin_tables.sql` | `workout_templates`, `meal_templates`, and administrative `audit_logs`. |
| **V13** | `V13__create_indexes.sql` | Performance B-Tree indexes on user IDs, dates, foreign keys, and active statuses. |
| **V14** | `V14__seed_reference_data.sql` | Initial system seeding: 20+ exercises, 24+ whole foods, demo users (`admin@fitcorp.com`, `alex@fitcorp.com`). |

---

## 3. Entity Relationships Summary

```
[ users ] <1---1> [ user_profiles ]
    |
    +---<1---N> [ workout_plans ] <1---N> [ workout_days ] <1---N> [ workout_exercises ]
    |                                                                         |
    |                                                                 (fk to exercises)
    |
    +---<1---N> [ meal_plans ] <1---N> [ meals ] <1---N> [ meal_items ]
    |                                                            |
    |                                                    (fk to food_items)
    |
    +---<1---N> [ schedule_events ]
    +---<1---N> [ progress_entries ]
    +---<1---N> [ body_measurements ]
    +---<1---N> [ notifications ]
```

---

## 4. Performance Indexes

Migration `V13__create_indexes.sql` establishes indexes to guarantee sub-millisecond query execution:
- `idx_users_email`: Unique B-Tree lookup for fast login resolution.
- `idx_workout_plans_user_status`: Accelerated lookup for active training splits.
- `idx_workout_days_plan_date`: Fast retrieval for today's workout queries.
- `idx_meals_plan_date`: Instant lookup for today's meal schedule.
- `idx_progress_entries_user_date`: Quick historical charting for weight trends.
- `idx_schedule_events_user_time`: Rapid conflict detection between meetings and workouts.
