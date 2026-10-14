# FitCorp REST API Specification

## 1. Overview & Base URL

- **Base URL**: `/api/v1`
- **Authentication**: Bearer JWT token passed in `Authorization` header (`Bearer <access_token>`).
- **Interactive Documentation**: Swagger UI is accessible at `http://localhost:8080/swagger-ui/index.html`.
- **OpenAPI JSON Spec**: `http://localhost:8080/v3/api-docs`.

---

## 2. Standard Response Envelope

All API endpoints return JSON conforming to the `ApiResponse<T>` envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully.",
  "timestamp": "2026-10-07T10:00:00Z"
}
```

In the event of an error:

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [
      "weightKg must be greater than or equal to 35"
    ]
  },
  "timestamp": "2026-10-07T10:00:00Z"
}
```

---

## 3. Endpoints Matrix

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register new corporate professional | Public |
| `POST` | `/auth/login` | Authenticate with work email and password | Public |
| `POST` | `/auth/refresh` | Refresh access token using rotating refresh token | Public |
| `POST` | `/auth/logout` | Revoke active refresh token | Authenticated |
| `GET` | `/auth/me` | Fetch active user summary | Authenticated |

### Profile & Onboarding (`/api/v1/profile`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/profile` | Retrieve user profile biometrics and schedule | `ROLE_USER` |
| `PUT` | `/profile` | Update user profile metrics and preferences | `ROLE_USER` |
| `POST` | `/profile/onboarding` | Submit 7-step onboarding data | `ROLE_USER` |

### Workouts & Exercises (`/api/v1/workouts`, `/api/v1/exercises`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/workouts` | Fetch currently active workout plan and split days | `ROLE_USER` |
| `GET` | `/workouts/today` | Fetch today's scheduled workout session | `ROLE_USER` |
| `POST` | `/workouts/generate` | Generate or regenerate customized workout split | `ROLE_USER` |
| `POST` | `/workouts/{id}/start` | Mark workout day session in progress | `ROLE_USER` |
| `POST` | `/workouts/{id}/complete` | Submit completed sets, reps, load, and duration | `ROLE_USER` |
| `POST` | `/workouts/{id}/skip` | Skip scheduled workout day | `ROLE_USER` |
| `GET` | `/exercises` | Query exercise library with category and muscle group filters | `ROLE_USER` |
| `GET` | `/exercises/{id}` | Fetch exercise execution guide and safety notes | `ROLE_USER` |

### Nutrition & Meals (`/api/v1/nutrition`, `/api/v1/foods`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/nutrition/plans` | Fetch active meal plan and macro distribution | `ROLE_USER` |
| `GET` | `/nutrition/today` | Fetch today's scheduled meals (Breakfast, Lunch, Dinner, Snack) | `ROLE_USER` |
| `GET` | `/nutrition/summary` | Fetch consumed vs target calories, protein, carbs, fats, water | `ROLE_USER` |
| `POST` | `/nutrition/generate` | Regenerate calorie budget and allergy-filtered meal plan | `ROLE_USER` |
| `POST` | `/nutrition/meals/{id}/consume` | Mark meal as eaten / toggle consumed status | `ROLE_USER` |
| `POST` | `/nutrition/meals/{id}/replace` | Swap out meal with an alternative healthy recipe | `ROLE_USER` |
| `POST` | `/nutrition/log` | Log ad-hoc nutrition or water intake | `ROLE_USER` |
| `GET` | `/foods` | Search verified whole food database | `ROLE_USER` |

### Schedule & Calendar (`/api/v1/schedule`, `/api/v1/calendar`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/schedule` | Get weekly corporate working hours | `ROLE_USER` |
| `PUT` | `/schedule` | Update working hours, start/end time, lunch duration | `ROLE_USER` |
| `GET` | `/calendar` | Fetch calendar events and conflict warnings | `ROLE_USER` |
| `POST` | `/calendar/events` | Create meeting or workout block | `ROLE_USER` |
| `DELETE` | `/calendar/events/{id}` | Delete calendar event | `ROLE_USER` |

### Progress & Dashboard (`/api/v1/progress`, `/api/v1/dashboard`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/dashboard` | Fetch aggregated home dashboard metrics | `ROLE_USER` |
| `GET` | `/progress/summary` | Fetch streaks, weight delta, completion percentages | `ROLE_USER` |
| `GET` | `/progress/charts` | Retrieve historical weight, consistency, and macro chart series | `ROLE_USER` |
| `POST` | `/progress/measurements` | Record anthropometric body measurements | `ROLE_USER` |

### Administration (`/api/v1/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/admin/dashboard` | Platform statistics, active user count, completed sessions | `ROLE_ADMIN` |
| `GET` | `/admin/users` | List registered corporate users | `ROLE_ADMIN` |
| `PATCH` | `/admin/users/{id}/status` | Activate or suspend user account | `ROLE_ADMIN` |
| `PATCH` | `/admin/users/{id}/role` | Assign or revoke `ROLE_ADMIN` permissions | `ROLE_ADMIN` |
| `POST` | `/admin/exercises` | Add verified movement to master catalog | `ROLE_ADMIN` |
| `DELETE` | `/admin/exercises/{id}` | Deactivate exercise from catalog | `ROLE_ADMIN` |
| `POST` | `/admin/foods` | Add whole food item to nutrition database | `ROLE_ADMIN` |
| `DELETE` | `/admin/foods/{id}` | Deactivate food item from database | `ROLE_ADMIN` |
