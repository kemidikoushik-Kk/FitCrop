package com.fitcorp.recommendation;

import com.fitcorp.food.FoodItem;
import com.fitcorp.food.FoodItemRepository;
import com.fitcorp.nutrition.*;
import com.fitcorp.profile.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NutritionRecommendationService {

    private final FoodItemRepository foodItemRepository;
    private final MealPlanRepository mealPlanRepository;
    private final MealRepository mealRepository;
    private final MealItemRepository mealItemRepository;

    @Transactional
    public MealPlan generatePlanForUser(UserProfile profile) {
        String userId = profile.getUser().getId();

        // 1. Versioning: archive previous active meal plans
        mealPlanRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .ifPresent(existingPlan -> {
                    existingPlan.setStatus("ARCHIVED");
                    mealPlanRepository.save(existingPlan);
                });

        int nextVersion = mealPlanRepository.findTopByUserIdOrderByVersionDesc(userId)
                .map(p -> p.getVersion() + 1)
                .orElse(1);

        // 2. Calculate BMR and TDEE with safety guardrails
        double weight = profile.getWeightKg() != null ? profile.getWeightKg() : 70.0;
        double height = profile.getHeightCm() != null ? profile.getHeightCm() : 170.0;
        int age = 28;
        if (profile.getDateOfBirth() != null) {
            age = Period.between(profile.getDateOfBirth(), LocalDate.now()).getYears();
        }

        boolean isMale = "MALE".equalsIgnoreCase(profile.getGender());
        double bmr;
        if (isMale) {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        double activityMultiplier = switch (profile.getActivityLevel() != null ? profile.getActivityLevel() : "SEDENTARY") {
            case "LIGHTLY_ACTIVE" -> 1.375;
            case "MODERATELY_ACTIVE" -> 1.55;
            case "VERY_ACTIVE" -> 1.725;
            default -> 1.2; // SEDENTARY
        };

        double tdee = bmr * activityMultiplier;

        // 3. Adjust calories based on goal with conservative health boundaries
        String goal = profile.getPrimaryFitnessGoal() != null ? profile.getPrimaryFitnessGoal() : "GENERAL_FITNESS";
        double targetCalories;
        double minCalorieFloor = isMale ? 1500.0 : 1200.0;

        switch (goal) {
            case "WEIGHT_MANAGEMENT" -> targetCalories = Math.max(minCalorieFloor, tdee - 450.0);
            case "MUSCLE_BUILDING" -> targetCalories = tdee + 300.0;
            case "STRENGTH" -> targetCalories = tdee + 150.0;
            default -> targetCalories = tdee;
        }

        targetCalories = Math.round(targetCalories);

        // 4. Protein calculation based on goal and body mass (g/kg)
        double proteinMultiplier = switch (goal) {
            case "MUSCLE_BUILDING", "STRENGTH" -> 1.8;
            case "WEIGHT_MANAGEMENT" -> 1.6;
            default -> 1.3;
        };

        double targetProtein = Math.round(weight * proteinMultiplier);
        double targetFat = Math.round((targetCalories * 0.25) / 9.0); // 25% calories from healthy fats
        double proteinCalories = targetProtein * 4.0;
        double fatCalories = targetFat * 9.0;
        double targetCarbs = Math.round(Math.max(50.0, (targetCalories - proteinCalories - fatCalories) / 4.0));

        MealPlan mealPlan = MealPlan.builder()
                .id(UUID.randomUUID().toString())
                .user(profile.getUser())
                .version(nextVersion)
                .targetCalories(targetCalories)
                .targetProtein(targetProtein)
                .targetCarbs(targetCarbs)
                .targetFat(targetFat)
                .status("ACTIVE")
                .build();

        MealPlan savedPlan = mealPlanRepository.save(mealPlan);

        // 5. Select compatible foods matching dietary preferences & allergy exclusions
        String dietaryPref = profile.getDietaryPreference() != null ? profile.getDietaryPreference() : "NO_PREFERENCE";
        List<FoodItem> candidateFoods = foodItemRepository.findDietaryCompatibleFoods(dietaryPref);

        // Strict Allergy Filtering
        if (profile.getFoodAllergies() != null && !profile.getFoodAllergies().isBlank() && !profile.getFoodAllergies().equalsIgnoreCase("None")) {
            List<String> allergies = Arrays.stream(profile.getFoodAllergies().split(","))
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .toList();

            candidateFoods = candidateFoods.stream()
                    .filter(food -> {
                        if (food.getAllergenTags() == null || food.getAllergenTags().isBlank()) return true;
                        String tags = food.getAllergenTags().toLowerCase();
                        for (String allergy : allergies) {
                            if (tags.contains(allergy)) return false;
                        }
                        return true;
                    })
                    .toList();
        }

        if (candidateFoods.isEmpty()) {
            candidateFoods = foodItemRepository.findByIsActiveTrue();
        }

        // Map food items by meal category
        Map<String, List<FoodItem>> foodsByCategory = candidateFoods.stream()
                .collect(Collectors.groupingBy(FoodItem::getCategory));

        // 6. Plan meals (e.g. Breakfast, Lunch, Evening Snack, Dinner)
        LocalDate today = LocalDate.now();
        List<Meal> createdMeals = new ArrayList<>();

        createdMeals.add(buildMeal(savedPlan, today, "BREAKFAST", LocalTime.of(8, 30), "Energizing Corporate Breakfast",
                foodsByCategory.getOrDefault("Breakfast", candidateFoods),
                foodsByCategory.getOrDefault("Fruits", candidateFoods)));

        createdMeals.add(buildMeal(savedPlan, today, "LUNCH", LocalTime.of(13, 0), "Balanced Workday High-Protein Lunch",
                foodsByCategory.getOrDefault("Lunch", candidateFoods),
                foodsByCategory.getOrDefault("Grains", candidateFoods)));

        createdMeals.add(buildMeal(savedPlan, today, "EVENING_SNACK", LocalTime.of(17, 0), "Afternoon Focus & Energy Snack",
                foodsByCategory.getOrDefault("Snack", candidateFoods),
                foodsByCategory.getOrDefault("Nuts", candidateFoods)));

        createdMeals.add(buildMeal(savedPlan, today, "DINNER", LocalTime.of(20, 30), "Restorative Evening Dinner",
                foodsByCategory.getOrDefault("Dinner", candidateFoods),
                foodsByCategory.getOrDefault("Vegetables", candidateFoods)));

        mealRepository.saveAll(createdMeals);
        log.info("Generated MealPlan v{} for user: {} (Targets: {} kcal, {}g protein)",
                nextVersion, profile.getUser().getEmail(), targetCalories, targetProtein);

        return savedPlan;
    }

    private Meal buildMeal(
            MealPlan plan,
            LocalDate date,
            String mealType,
            LocalTime time,
            String title,
            List<FoodItem> primaryOptions,
            List<FoodItem> secondaryOptions) {

        Meal meal = Meal.builder()
                .id(UUID.randomUUID().toString())
                .mealPlan(plan)
                .date(date)
                .mealType(mealType)
                .mealTime(time)
                .title(title)
                .notes("Wholesome corporate nutrition with essential micronutrients.")
                .isConsumed(false)
                .build();

        List<MealItem> items = new ArrayList<>();

        FoodItem item1 = pickRandom(primaryOptions);
        if (item1 != null) {
            items.add(MealItem.builder()
                    .id(UUID.randomUUID().toString())
                    .meal(meal)
                    .foodItem(item1)
                    .quantity(1.0)
                    .servings(1.0)
                    .build());
        }

        FoodItem item2 = pickRandom(secondaryOptions);
        if (item2 != null && (item1 == null || !item2.getId().equals(item1.getId()))) {
            items.add(MealItem.builder()
                    .id(UUID.randomUUID().toString())
                    .meal(meal)
                    .foodItem(item2)
                    .quantity(1.0)
                    .servings(1.0)
                    .build());
        }

        meal.setMealItems(items);
        return meal;
    }

    private FoodItem pickRandom(List<FoodItem> list) {
        if (list == null || list.isEmpty()) return null;
        int idx = new Random().nextInt(list.size());
        return list.get(idx);
    }
}
