-- V7: Create Food Items Table
CREATE TABLE IF NOT EXISTS food_items (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    serving_unit VARCHAR(50) NOT NULL,
    serving_size_grams DOUBLE DEFAULT 100.0,
    calories DOUBLE NOT NULL,
    protein DOUBLE NOT NULL,
    carbohydrates DOUBLE NOT NULL,
    fat DOUBLE NOT NULL,
    fiber DOUBLE DEFAULT 0.0,
    is_vegetarian BOOLEAN DEFAULT TRUE,
    is_vegan BOOLEAN DEFAULT FALSE,
    allergen_tags VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
