-- V6: Create Workout Plans, Days, Exercises, and Logs Tables
CREATE TABLE IF NOT EXISTS workout_plans (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    version INT DEFAULT 1,
    goal VARCHAR(50),
    start_date DATE,
    end_date DATE,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_workout_plans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workout_days (
    id VARCHAR(36) PRIMARY KEY,
    workout_plan_id VARCHAR(36) NOT NULL,
    date DATE,
    day_of_week VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    day_type VARCHAR(30) DEFAULT 'WORKOUT_DAY',
    estimated_duration_minutes INT DEFAULT 30,
    status VARCHAR(30) DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_workout_days_plan FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workout_exercises (
    id VARCHAR(36) PRIMARY KEY,
    workout_day_id VARCHAR(36) NOT NULL,
    exercise_id VARCHAR(36) NOT NULL,
    sequence_order INT NOT NULL,
    sets INT DEFAULT 3,
    reps INT DEFAULT 10,
    duration_seconds INT DEFAULT 0,
    rest_seconds INT DEFAULT 60,
    notes TEXT,
    CONSTRAINT fk_workout_exercises_day FOREIGN KEY (workout_day_id) REFERENCES workout_days(id) ON DELETE CASCADE,
    CONSTRAINT fk_workout_exercises_ex FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE IF NOT EXISTS workout_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    workout_day_id VARCHAR(36),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'COMPLETED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_workout_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exercise_logs (
    id VARCHAR(36) PRIMARY KEY,
    workout_log_id VARCHAR(36) NOT NULL,
    exercise_id VARCHAR(36) NOT NULL,
    sets_completed INT DEFAULT 0,
    reps_completed INT DEFAULT 0,
    weight_kg DOUBLE PRECISION DEFAULT 0.0,
    is_completed BOOLEAN DEFAULT TRUE,
    notes TEXT,
    CONSTRAINT fk_exercise_logs_log FOREIGN KEY (workout_log_id) REFERENCES workout_logs(id) ON DELETE CASCADE,
    CONSTRAINT fk_exercise_logs_ex FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);
