-- V8: Create Meal Plans, Meals, Meal Items, and Nutrition Logs Tables
CREATE TABLE IF NOT EXISTS meal_plans (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    version INT DEFAULT 1,
    target_calories DOUBLE,
    target_protein DOUBLE,
    target_carbs DOUBLE,
    target_fat DOUBLE,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_meal_plans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meals (
    id VARCHAR(36) PRIMARY KEY,
    meal_plan_id VARCHAR(36) NOT NULL,
    date DATE,
    meal_type VARCHAR(50) NOT NULL,
    meal_time TIME,
    title VARCHAR(100) NOT NULL,
    notes TEXT,
    is_consumed BOOLEAN DEFAULT FALSE,
    consumed_at TIMESTAMP,
    CONSTRAINT fk_meals_plan FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meal_items (
    id VARCHAR(36) PRIMARY KEY,
    meal_id VARCHAR(36) NOT NULL,
    food_item_id VARCHAR(36) NOT NULL,
    quantity DOUBLE DEFAULT 1.0,
    servings DOUBLE DEFAULT 1.0,
    CONSTRAINT fk_meal_items_meal FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE,
    CONSTRAINT fk_meal_items_food FOREIGN KEY (food_item_id) REFERENCES food_items(id)
);

CREATE TABLE IF NOT EXISTS nutrition_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    date DATE NOT NULL,
    calories DOUBLE DEFAULT 0.0,
    protein DOUBLE DEFAULT 0.0,
    carbohydrates DOUBLE DEFAULT 0.0,
    fat DOUBLE DEFAULT 0.0,
    fiber DOUBLE DEFAULT 0.0,
    water_ml INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_nutrition_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
