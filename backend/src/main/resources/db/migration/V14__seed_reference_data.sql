-- V14: Seed Reference Data (Roles, Fitness Goals, Exercises, Foods, Templates, Demo Accounts)

-- 1. Roles
INSERT INTO roles (id, name, description) VALUES
('r-001', 'ROLE_USER', 'Standard corporate employee user'),
('r-002', 'ROLE_ADMIN', 'System administrator with catalog and user management privileges');

-- 2. Fitness Goals
INSERT INTO fitness_goals (id, code, title, description, icon_name, recommended_focus, expected_metrics, is_active) VALUES
('g-001', 'WEIGHT_MANAGEMENT', 'Weight Management', 'Balanced calorie deficit, metabolic conditioning, and sustainable daily movement.', 'Flame', 'Moderate calorie control, daily step count, full-body circuits', 'Weight trend, weekly consistency', true),
('g-002', 'MUSCLE_BUILDING', 'Muscle Building', 'Hypertrophy-focused resistance training with progressive overload and adequate protein.', 'Dumbbell', 'Progressive resistance training, caloric surplus/maintenance, 1.6-2.2g/kg protein', 'Strength records, lean mass, protein adherence', true),
('g-003', 'GENERAL_FITNESS', 'General Fitness', 'Holistic health combining cardiovascular endurance, functional strength, and mobility.', 'HeartPulse', 'Balanced 3-4 days hybrid split, mobility breaks during workday', 'Workout completion rate, active minutes', true),
('g-004', 'STRENGTH', 'Pure Strength', 'Foundational compound movements aimed at maximizing neurological adaptation and peak force.', 'Zap', 'Lower rep ranges (3-6 reps), longer rest periods, compound lifts', 'Estimated 1RM, volume load, consistency', true),
('g-005', 'ENDURANCE', 'Cardio & Stamina', 'Elevated VO2 max and aerobic efficiency to combat corporate fatigue and sustain energy.', 'Activity', 'Zone 2 cardio, tempo intervals, high-rep muscular stamina circuits', 'Session duration, resting heart rate, consistency', true),
('g-006', 'FLEXIBILITY', 'Mobility & Posture', 'Counteracting prolonged seated posture, tight hip flexors, rounded shoulders, and neck tension.', 'Sparkles', 'Daily desk mobility flows, thoracic extension, hamstring & hip openers', 'Flexibility rating, mobility streak, pain relief', true);

-- 3. Exercises Catalog
INSERT INTO exercises (id, name, description, category, muscle_group, equipment, difficulty, estimated_calories_per_minute, duration_default_seconds, sets_default, reps_default, rest_seconds_default, instructions, safety_notes, is_active) VALUES
('ex-001', 'Bodyweight Squats', 'Fundamental lower-body compound movement strengthening quadriceps and glutes.', 'STRENGTH', 'LEGS', 'NONE', 'BEGINNER', 6.0, 60, 3, 12, 60, 'Stand feet shoulder-width apart. Lower your hips back and down while keeping chest proud. Push through heels to return.', 'Keep knees tracking over toes. Do not let heels lift.', true),
('ex-002', 'Push-Ups', 'Classic upper body exercise for chest, anterior deltoids, and triceps.', 'STRENGTH', 'CHEST', 'NONE', 'BEGINNER', 7.0, 60, 3, 10, 60, 'Start in high plank with hands slightly wider than shoulders. Lower chest to floor, keeping core braced, then push back up.', 'Keep body in straight line. Modify on knees or elevated desk if needed.', true),
('ex-003', 'Standard Plank', 'Isometric core hold developing endurance in abdominal wall and spinal stabilizers.', 'CORE', 'CORE', 'NONE', 'BEGINNER', 4.5, 45, 3, 1, 45, 'Rest on forearms and toes. Keep neutral spine, squeeze glutes, and engage abdominals.', 'Avoid sagging hips or arching lower back. Breathe steadily.', true),
('ex-004', 'Walking Lunges', 'Unilateral leg exercise enhancing balance, knee stability, and glute activation.', 'STRENGTH', 'LEGS', 'NONE', 'BEGINNER', 6.5, 60, 3, 10, 60, 'Step forward and lower back knee toward ground until front thigh is parallel to floor. Step forward and alternate.', 'Do not let front knee collapse inward.', true),
('ex-005', 'Glute Bridge', 'Hip extension exercise targeting gluteus maximus and relieving lumbar tightness from sitting.', 'STRENGTH', 'GLUTES', 'NONE', 'BEGINNER', 5.0, 45, 3, 15, 45, 'Lie on back with knees bent and feet flat on floor. Drive hips toward ceiling squeezing glutes at top.', 'Avoid over-arching lower back; focus on glute squeeze.', true),
('ex-006', 'Mountain Climbers', 'Dynamic cardio and core movement elevating heart rate and burning calories.', 'CARDIO', 'CORE', 'NONE', 'INTERMEDIATE', 9.0, 45, 3, 20, 45, 'From a push-up plank position, alternate driving knees rapidly toward chest.', 'Maintain a stable torso and avoid piking hips into the air.', true),
('ex-007', 'Desk Mobility Flow (Cat-Cow & Thoracic)', 'Active mobility routine for spine decompression and seated postural relief.', 'MOBILITY', 'FULL_BODY', 'NONE', 'BEGINNER', 3.0, 180, 2, 8, 30, 'On hands and knees or seated, alternate arching back with inhalation and rounding spine with exhalation.', 'Move slowly through pain-free range of motion.', true),
('ex-008', 'Dumbbell Goblet Squats', 'Loaded squat pattern holding a dumbbell at chest level.', 'STRENGTH', 'LEGS', 'DUMBBELLS', 'INTERMEDIATE', 7.5, 60, 3, 10, 75, 'Hold dumbbell vertically against chest. Squat until thighs reach parallel, keeping elbows inside knees.', 'Maintain upright torso. Keep core tight.', true),
('ex-009', 'Dumbbell Bent-Over Row', 'Upper back builder targeting lats and rhomboids to counteract desk slouching.', 'STRENGTH', 'BACK', 'DUMBBELLS', 'INTERMEDIATE', 7.0, 60, 3, 10, 60, 'Hinge at hips with flat back. Pull dumbbells up toward hip crease, squeezing shoulder blades together.', 'Do not jerk weight or round lower back.', true),
('ex-010', 'Dumbbell Overhead Shoulder Press', 'Vertical pressing movement building shoulder strength and triceps.', 'STRENGTH', 'SHOULDERS', 'DUMBBELLS', 'INTERMEDIATE', 6.5, 60, 3, 10, 60, 'Sit or stand tall. Press dumbbells vertically until arms are fully extended overhead.', 'Do not arch lower back excessively; engage core.', true),
('ex-011', 'Dumbbell Romanian Deadlift', 'Posterior chain builder strengthening hamstrings, glutes, and lower back.', 'STRENGTH', 'LEGS', 'DUMBBELLS', 'INTERMEDIATE', 7.5, 60, 3, 10, 75, 'Hold dumbbells in front of thighs. Soften knees and push hips back while lowering weights along shins.', 'Keep spine neutral. Squeeze glutes at lockout.', true),
('ex-012', 'Brisk Workday Walk', 'Low-impact steady-state cardiovascular conditioning ideal for corporate breaks.', 'CARDIO', 'FULL_BODY', 'NONE', 'BEGINNER', 4.5, 900, 1, 1, 0, 'Walk at a purposeful, brisk pace outdoors or on treadmill.', 'Wear comfortable walking shoes. Maintain tall posture.', true),
('ex-013', 'High Knees', 'Cardiovascular agility exercise that strengthens hip flexors and increases pulse.', 'CARDIO', 'LEGS', 'NONE', 'INTERMEDIATE', 9.5, 45, 3, 20, 45, 'Run in place while driving knees up to hip height with quick rhythm.', 'Land softly on balls of feet.', true),
('ex-014', 'Bicycle Crunches', 'Rotational abdominal movement targeting rectus abdominis and obliques.', 'CORE', 'CORE', 'NONE', 'INTERMEDIATE', 6.0, 45, 3, 16, 45, 'Lie on back, hands behind head. Alternate touching opposite elbow to knee in pedaling motion.', 'Do not yank on neck; rotate through thoracic spine.', true),
('ex-015', 'Chair / Bench Tricep Dips', 'Bodyweight pressing exercise targeting triceps and anterior deltoids.', 'STRENGTH', 'TRICEPS', 'BENCH', 'BEGINNER', 5.5, 45, 3, 12, 60, 'Place hands on edge of sturdy chair/bench. Lower hips down by bending elbows to 90 degrees, then push up.', 'Keep shoulders down away from ears. Do not flare elbows wide.', true),
('ex-016', 'Dumbbell Bicep Curls', 'Isolation exercise targeting biceps brachii.', 'STRENGTH', 'BICEPS', 'DUMBBELLS', 'BEGINNER', 5.0, 45, 3, 12, 60, 'Stand tall holding dumbbells with palms forward. Curl weights toward shoulders while keeping elbows stationary.', 'Avoid swinging body for momentum.', true),
('ex-017', 'Lateral Dumbbell Raises', 'Shoulder cap isolation targeting lateral deltoids for posture aesthetics.', 'STRENGTH', 'SHOULDERS', 'DUMBBELLS', 'BEGINNER', 5.0, 45, 3, 12, 45, 'Hold dumbbells by sides. Raise arms out to sides until parallel to floor with slight elbow bend.', 'Lead with elbows, avoid shrugging traps.', true),
('ex-018', 'World''s Greatest Stretch', 'Comprehensive full-body dynamic stretch opening hips, thoracic spine, and ankles.', 'MOBILITY', 'FULL_BODY', 'NONE', 'BEGINNER', 3.5, 120, 2, 5, 30, 'Step into deep lunge, place hands inside front foot, rotate torso upward opening chest to sky.', 'Move with control and hold each rotation for 3 seconds.', true),
('ex-019', 'Child''s Pose & Thoracic Reach', 'Gentle restorative yoga pose stretching lower back, latissimus dorsi, and shoulders.', 'FLEXIBILITY', 'BACK', 'NONE', 'BEGINNER', 2.5, 90, 2, 1, 30, 'Kneel, push hips back onto heels, extend arms forward on floor, and breathe deeply.', 'Relax head to ground and focus on deep diaphragmatic breathing.', true),
('ex-020', 'Stationary Bike Intervals', 'Low impact high efficiency cardio saving knee joints while torching calories.', 'CARDIO', 'LEGS', 'BIKE', 'INTERMEDIATE', 8.5, 900, 1, 1, 0, 'Alternate 30 seconds of high resistance effort with 60 seconds of gentle pedaling.', 'Adjust seat height so knee has a slight bend at bottom of pedal stroke.', true);

-- 4. Food Items Catalog (Global & Indian corporate favorites with macros per serving)
INSERT INTO food_items (id, name, category, serving_unit, serving_size_grams, calories, protein, carbohydrates, fat, fiber, is_vegetarian, is_vegan, allergen_tags, is_active) VALUES
('food-001', 'Rolled Oatmeal with Cinnamon', 'Breakfast', '1 bowl (40g dry)', 150.0, 150.0, 5.0, 27.0, 2.5, 4.0, true, true, 'Gluten', true),
('food-002', 'Boiled Whole Eggs (2 eggs)', 'Breakfast', '2 large eggs', 100.0, 144.0, 12.6, 1.1, 9.5, 0.0, false, false, 'Eggs', true),
('food-003', 'Egg White Omelet (4 whites)', 'Breakfast', '4 egg whites', 130.0, 68.0, 14.4, 0.8, 0.2, 0.0, false, false, 'Eggs', true),
('food-004', 'Yellow Moong Dal Tadka', 'Lunch', '1 medium bowl', 150.0, 160.0, 9.0, 24.0, 3.5, 4.5, true, true, 'None', true),
('food-005', 'Whole Wheat Phulka / Roti', 'Grains', '2 medium rotis', 70.0, 160.0, 5.2, 32.0, 1.5, 3.8, true, true, 'Gluten', true),
('food-006', 'Steamed Brown Basmati Rice', 'Grains', '1 cooked cup', 150.0, 165.0, 3.8, 35.0, 1.2, 2.5, true, true, 'None', true),
('food-007', 'Grilled Chicken Breast', 'Protein', '1 breast fillet', 150.0, 240.0, 46.0, 0.0, 5.0, 0.0, false, false, 'None', true),
('food-008', 'Pan-Seared Paneer (Cottage Cheese)', 'Protein', '100g cubes', 100.0, 265.0, 18.0, 3.5, 20.0, 0.0, true, false, 'Milk', true),
('food-009', 'Tofu Stir-Fry with Veggies', 'Protein', '1 plate', 180.0, 180.0, 16.0, 8.0, 10.0, 3.5, true, true, 'Soy', true),
('food-010', 'Greek Yogurt / Probiotic Curd', 'Dairy', '1 cup', 150.0, 130.0, 15.0, 6.0, 4.0, 0.0, true, false, 'Milk', true),
('food-011', 'Chickpea Curry (Chole)', 'Lunch', '1 medium bowl', 180.0, 220.0, 11.0, 34.0, 5.0, 7.0, true, true, 'None', true),
('food-012', 'Whey Protein Isolate Shake', 'Snack', '1 scoop with water', 30.0, 120.0, 25.0, 2.0, 1.0, 0.5, true, false, 'Milk', true),
('food-013', 'Banana', 'Fruits', '1 medium banana', 118.0, 105.0, 1.3, 27.0, 0.3, 3.1, true, true, 'None', true),
('food-014', 'Crisp Red Apple', 'Fruits', '1 medium apple', 150.0, 80.0, 0.4, 21.0, 0.2, 4.0, true, true, 'None', true),
('food-015', 'Raw Almonds & Walnuts', 'Nuts', '1 small handful', 30.0, 185.0, 6.0, 5.0, 16.0, 3.0, true, true, 'Tree nuts', true),
('food-016', 'Sprouted Green Moong Salad', 'Snack', '1 bowl with lemon & onion', 120.0, 110.0, 8.5, 18.0, 0.8, 5.0, true, true, 'None', true),
('food-017', 'Grilled Salmon / White Fish', 'Protein', '1 fillet', 150.0, 220.0, 34.0, 0.0, 8.5, 0.0, false, false, 'Seafood', true),
('food-018', 'Steamed Broccoli & Bell Peppers', 'Vegetables', '1 cup', 100.0, 45.0, 3.0, 8.0, 0.5, 3.0, true, true, 'None', true),
('food-019', 'Mixed Green Palak Salad', 'Vegetables', '1 large bowl', 100.0, 35.0, 2.5, 5.0, 0.4, 2.8, true, true, 'None', true),
('food-020', 'Peanut Butter on Multigrain Toast', 'Snack', '1 slice with 1 tbsp pb', 60.0, 190.0, 7.5, 18.0, 10.0, 2.5, true, true, 'Peanuts,Gluten', true),
('food-021', 'Rajma (Red Kidney Bean Curry)', 'Dinner', '1 bowl', 180.0, 210.0, 12.0, 32.0, 4.0, 8.0, true, true, 'None', true),
('food-022', 'Vegetable Poha with Peanuts', 'Breakfast', '1 medium bowl', 150.0, 210.0, 4.5, 36.0, 6.0, 2.5, true, true, 'Peanuts', true),
('food-023', 'Steamed Idli with Sambar (3 idlis)', 'Breakfast', '3 idlis with sambar', 180.0, 230.0, 8.0, 44.0, 2.5, 4.0, true, true, 'None', true),
('food-024', 'Chia Seed Lemon Water', 'Beverages', '1 tall glass', 250.0, 40.0, 1.5, 3.0, 2.5, 3.0, true, true, 'None', true);

-- 5. Seed Default Admin & Demo User Accounts
-- Password for admin: Admin@123 (BCrypt hash)
-- Password for demo user: User@123 (BCrypt hash)
INSERT INTO users (id, email, password_hash, full_name, is_active, is_email_verified, onboarding_completed, created_at) VALUES
('u-admin-01', 'admin@fitcorp.com', '$2a$10$vI8qV08V1rT6yK8jCg0t8e6S5N6O3B1D2F4H5J6K7L8M9N0O1P2Q3', 'FitCorp Administrator', true, true, true, CURRENT_TIMESTAMP),
('u-demo-01', 'alex@fitcorp.com', '$2a$10$vI8qV08V1rT6yK8jCg0t8e6S5N6O3B1D2F4H5J6K7L8M9N0O1P2Q3', 'Alex Morgan', true, true, true, CURRENT_TIMESTAMP);

-- Assign Admin & User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
('u-admin-01', 'r-002'),
('u-admin-01', 'r-001'),
('u-demo-01', 'r-001');

-- Demo User Profile
INSERT INTO user_profiles (id, user_id, date_of_birth, gender, height_cm, weight_kg, fitness_level, occupation, working_days, work_start_time, work_end_time, sleep_schedule, preferred_workout_days, preferred_workout_time, available_workout_minutes, equipment_access, dietary_preference, food_allergies, food_dislikes, meal_preference, primary_fitness_goal, secondary_goal, activity_level, timezone) VALUES
('p-demo-01', 'u-demo-01', '1995-06-15', 'MALE', 178.0, 76.5, 'INTERMEDIATE', 'Senior Software Engineer', 'MON,TUE,WED,THU,FRI', '09:00:00', '18:00:00', '23:30 - 07:00', 'MON,WED,FRI,SAT', 'EVENING', 35, 'DUMBBELLS', 'HIGH_PROTEIN', 'None', 'Bitter Gourd', 'FOUR_MEALS', 'GENERAL_FITNESS', 'MUSCLE_BUILDING', 'LIGHTLY_ACTIVE', 'Asia/Kolkata');

-- Demo Notification Preferences
INSERT INTO notification_preferences (id, user_id, workout_reminders, meal_reminders, water_reminders, weekly_progress_reminders, reminder_lead_minutes) VALUES
('np-demo-01', 'u-demo-01', true, true, true, true, 15);

-- Demo Work Schedules (Monday to Sunday)
INSERT INTO work_schedules (id, user_id, day_of_week, is_working_day, work_start_time, work_end_time, morning_break_minutes, lunch_break_minutes, evening_break_minutes, preferred_workout_window) VALUES
('ws-01', 'u-demo-01', 'MONDAY', true, '09:00:00', '18:00:00', 15, 60, 15, 'EVENING'),
('ws-02', 'u-demo-01', 'TUESDAY', true, '09:00:00', '18:00:00', 15, 60, 15, 'EVENING'),
('ws-03', 'u-demo-01', 'WEDNESDAY', true, '09:00:00', '18:00:00', 15, 60, 15, 'EVENING'),
('ws-04', 'u-demo-01', 'THURSDAY', true, '09:00:00', '18:00:00', 15, 60, 15, 'EVENING'),
('ws-05', 'u-demo-01', 'FRIDAY', true, '09:00:00', '18:00:00', 15, 60, 15, 'EVENING'),
('ws-06', 'u-demo-01', 'SATURDAY', false, '00:00:00', '00:00:00', 0, 0, 0, 'MORNING'),
('ws-07', 'u-demo-01', 'SUNDAY', false, '00:00:00', '00:00:00', 0, 0, 0, 'REST');
