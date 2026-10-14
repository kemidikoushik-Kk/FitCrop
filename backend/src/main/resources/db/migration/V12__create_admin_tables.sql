-- V12: Create Admin Workout/Meal Templates and Audit Logs Tables
CREATE TABLE IF NOT EXISTS workout_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    goal VARCHAR(50) NOT NULL,
    fitness_level VARCHAR(30) NOT NULL,
    duration_minutes INT DEFAULT 30,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workout_template_exercises (
    id VARCHAR(36) PRIMARY KEY,
    workout_template_id VARCHAR(36) NOT NULL,
    exercise_id VARCHAR(36) NOT NULL,
    sequence_order INT NOT NULL,
    sets INT DEFAULT 3,
    reps INT DEFAULT 10,
    duration_seconds INT DEFAULT 0,
    rest_seconds INT DEFAULT 60,
    CONSTRAINT fk_template_exercises_tpl FOREIGN KEY (workout_template_id) REFERENCES workout_templates(id) ON DELETE CASCADE,
    CONSTRAINT fk_template_exercises_ex FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE IF NOT EXISTS meal_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    dietary_type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meal_template_items (
    id VARCHAR(36) PRIMARY KEY,
    meal_template_id VARCHAR(36) NOT NULL,
    food_item_id VARCHAR(36) NOT NULL,
    quantity DOUBLE PRECISION DEFAULT 1.0,
    servings DOUBLE PRECISION DEFAULT 1.0,
    CONSTRAINT fk_meal_tpl_items_tpl FOREIGN KEY (meal_template_id) REFERENCES meal_templates(id) ON DELETE CASCADE,
    CONSTRAINT fk_meal_tpl_items_food FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    actor_user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36),
    metadata TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
