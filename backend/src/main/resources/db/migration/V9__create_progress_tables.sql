-- V9: Create Progress Entries and Body Measurements Tables
CREATE TABLE IF NOT EXISTS progress_entries (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    weight_kg DOUBLE PRECISION,
    workouts_completed INT DEFAULT 0,
    meals_logged INT DEFAULT 0,
    water_ml INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_entries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS body_measurements (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    weight_kg DOUBLE PRECISION,
    body_fat_percentage DOUBLE PRECISION,
    chest_cm DOUBLE PRECISION,
    waist_cm DOUBLE PRECISION,
    hips_cm DOUBLE PRECISION,
    arms_cm DOUBLE PRECISION,
    thighs_cm DOUBLE PRECISION,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_body_measurements_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
