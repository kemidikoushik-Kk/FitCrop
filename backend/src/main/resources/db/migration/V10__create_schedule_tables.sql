-- V10: Create Work Schedules and Schedule Events Tables
CREATE TABLE IF NOT EXISTS work_schedules (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    is_working_day BOOLEAN DEFAULT TRUE,
    work_start_time TIME DEFAULT '09:00:00',
    work_end_time TIME DEFAULT '18:00:00',
    morning_break_minutes INT DEFAULT 0,
    lunch_break_minutes INT DEFAULT 60,
    evening_break_minutes INT DEFAULT 0,
    preferred_workout_window VARCHAR(50) DEFAULT 'EVENING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_work_schedules_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS schedule_events (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_events_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
