-- V4: Create Fitness Goals and User Goals Tables
CREATE TABLE IF NOT EXISTS fitness_goals (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    recommended_focus TEXT,
    expected_metrics VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS user_goals (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    goal_id VARCHAR(36) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    target_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_goals_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_goals_goal FOREIGN KEY (goal_id) REFERENCES fitness_goals(id)
);
