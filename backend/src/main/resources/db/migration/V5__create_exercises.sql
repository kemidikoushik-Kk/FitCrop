-- V5: Create Exercises Table
CREATE TABLE IF NOT EXISTS exercises (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    muscle_group VARCHAR(50) NOT NULL,
    equipment VARCHAR(50) NOT NULL,
    difficulty VARCHAR(30) NOT NULL,
    estimated_calories_per_minute DOUBLE DEFAULT 5.0,
    duration_default_seconds INT DEFAULT 60,
    sets_default INT DEFAULT 3,
    reps_default INT DEFAULT 10,
    rest_seconds_default INT DEFAULT 60,
    instructions TEXT,
    safety_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
