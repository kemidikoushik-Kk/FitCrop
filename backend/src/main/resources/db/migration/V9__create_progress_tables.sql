-- V9: Create Progress Entries and Body Measurements Tables
CREATE TABLE IF NOT EXISTS progress_entries (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    weight_kg DOUBLE,
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
    weight_kg DOUBLE,
    body_fat_percentage DOUBLE,
    chest_cm DOUBLE,
    waist_cm DOUBLE,
    hips_cm DOUBLE,
    arms_cm DOUBLE,
    thighs_cm DOUBLE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_body_measurements_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
