package com.fitcorp.nutrition;

import com.fitcorp.exception.ResourceNotFoundException;
import com.fitcorp.exception.UnauthorizedException;
import com.fitcorp.food.FoodItem;
import com.fitcorp.food.FoodItemRepository;
import com.fitcorp.food.dto.FoodItemResponse;
import com.fitcorp.nutrition.dto.*;
import com.fitcorp.profile.UserProfile;
import com.fitcorp.profile.UserProfileRepository;
import com.fitcorp.progress.ProgressEntry;
import com.fitcorp.progress.ProgressEntryRepository;
import com.fitcorp.recommendation.NutritionRecommendationService;
import com.fitcorp.user.User;
import com.fitcorp.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NutritionService {

    private final MealPlanRepository mealPlanRepository;
    private final MealRepository mealRepository;
    private final MealItemRepository mealItemRepository;
    private final NutritionLogRepository nutritionLogRepository;
    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final NutritionRecommendationService recommendationService;
    private final ProgressEntryRepository progressEntryRepository;

    @Transactional
    public MealPlanResponse getActivePlan(String userId) {
        MealPlan plan = mealPlanRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .orElseGet(() -> {
                    UserProfile profile = userProfileRepository.findByUserId(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
                    return recommendationService.generatePlanForUser(profile);
                });

        return toPlanDto(plan);
    }

    @Transactional
    public MealPlanResponse generatePlan(String userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        MealPlan plan = recommendationService.generatePlanForUser(profile);
        return toPlanDto(plan);
    }

    @Transactional
    public List<MealResponse> getTodayMeals(String userId) {
        MealPlan plan = mealPlanRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .orElseGet(() -> {
                    UserProfile profile = userProfileRepository.findByUserId(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
                    return recommendationService.generatePlanForUser(profile);
                });

        List<Meal> meals = mealRepository.findByMealPlanId(plan.getId());
        return meals.stream().map(this::toMealDto).collect(Collectors.toList());
    }

    @Transactional
    public MealResponse markMealConsumed(String userId, String mealId) {
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found: " + mealId));

        if (!meal.getMealPlan().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this meal");
        }

        meal.setIsConsumed(true);
        meal.setConsumedAt(Instant.now());
        Meal saved = mealRepository.save(meal);

        // Calculate meal macros and add to today's NutritionLog
        LocalDate today = LocalDate.now();
        double mealCalories = 0.0;
        double mealProtein = 0.0;
        double mealCarbs = 0.0;
        double mealFat = 0.0;
        double mealFiber = 0.0;

        List<MealItem> items = mealItemRepository.findByMealId(meal.getId());
        for (MealItem item : items) {
            FoodItem fi = item.getFoodItem();
            double servings = item.getServings() != null ? item.getServings() : 1.0;
            mealCalories += fi.getCalories() * servings;
            mealProtein += fi.getProtein() * servings;
            mealCarbs += fi.getCarbohydrates() * servings;
            mealFat += fi.getFat() * servings;
            mealFiber += (fi.getFiber() != null ? fi.getFiber() : 0.0) * servings;
        }

        User user = userRepository.findById(userId).orElseThrow();
        NutritionLog logEntry = nutritionLogRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> NutritionLog.builder()
                        .id(UUID.randomUUID().toString())
                        .user(user)
                        .date(today)
                        .calories(0.0)
                        .protein(0.0)
                        .carbohydrates(0.0)
                        .fat(0.0)
                        .fiber(0.0)
                        .waterMl(0)
                        .build());

        logEntry.setCalories(Math.round((logEntry.getCalories() + mealCalories) * 10.0) / 10.0);
        logEntry.setProtein(Math.round((logEntry.getProtein() + mealProtein) * 10.0) / 10.0);
        logEntry.setCarbohydrates(Math.round((logEntry.getCarbohydrates() + mealCarbs) * 10.0) / 10.0);
        logEntry.setFat(Math.round((logEntry.getFat() + mealFat) * 10.0) / 10.0);
        logEntry.setFiber(Math.round((logEntry.getFiber() + mealFiber) * 10.0) / 10.0);
        nutritionLogRepository.save(logEntry);

        // Increment mealsLogged in ProgressEntry for streak tracking
        ProgressEntry progress = progressEntryRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> ProgressEntry.builder()
                        .id(UUID.randomUUID().toString())
                        .user(user)
                        .date(today)
                        .workoutsCompleted(0)
                        .mealsLogged(0)
                        .waterMl(0)
                        .build());

        progress.setMealsLogged(progress.getMealsLogged() + 1);
        progressEntryRepository.save(progress);

        return toMealDto(saved);
    }

    @Transactional
    public MealResponse replaceMeal(String userId, String mealId) {
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new ResourceNotFoundException("Meal not found: " + mealId));

        if (!meal.getMealPlan().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this meal");
        }

        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        String dietaryPref = profile != null ? profile.getDietaryPreference() : "NO_PREFERENCE";
        List<FoodItem> compatibleFoods = foodItemRepository.findDietaryCompatibleFoods(dietaryPref);

        // Exclude allergens
        if (profile != null && profile.getFoodAllergies() != null && !profile.getFoodAllergies().isBlank()) {
            List<String> allergies = Arrays.stream(profile.getFoodAllergies().split(","))
                    .map(String::trim).map(String::toLowerCase).toList();
            compatibleFoods = compatibleFoods.stream().filter(f -> {
                if (f.getAllergenTags() == null) return true;
                String tags = f.getAllergenTags().toLowerCase();
                for (String a : allergies) {
                    if (tags.contains(a)) return false;
                }
                return true;
            }).toList();
        }

        if (!compatibleFoods.isEmpty()) {
            Collections.shuffle(compatibleFoods);
            FoodItem replacementFood = compatibleFoods.get(0);

            mealItemRepository.deleteAll(meal.getMealItems());
            meal.getMealItems().clear();

            MealItem newItem = MealItem.builder()
                    .id(UUID.randomUUID().toString())
                    .meal(meal)
                    .foodItem(replacementFood)
                    .quantity(1.0)
                    .servings(1.0)
                    .build();

            mealItemRepository.save(newItem);
            meal.getMealItems().add(newItem);
            meal.setTitle("Alternative: " + replacementFood.getName());
            mealRepository.save(meal);
        }

        return toMealDto(meal);
    }

    @Transactional
    public NutritionSummaryResponse logNutrition(String userId, LogNutritionRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        LocalDate date = request.getDate() != null ? request.getDate() : LocalDate.now();

        NutritionLog logEntry = nutritionLogRepository.findByUserIdAndDate(userId, date)
                .orElseGet(() -> NutritionLog.builder()
                        .id(UUID.randomUUID().toString())
                        .user(user)
                        .date(date)
                        .calories(0.0)
                        .protein(0.0)
                        .carbohydrates(0.0)
                        .fat(0.0)
                        .fiber(0.0)
                        .waterMl(0)
                        .build());

        if (request.getCalories() != null) logEntry.setCalories(request.getCalories());
        if (request.getProtein() != null) logEntry.setProtein(request.getProtein());
        if (request.getCarbohydrates() != null) logEntry.setCarbohydrates(request.getCarbohydrates());
        if (request.getFat() != null) logEntry.setFat(request.getFat());
        if (request.getFiber() != null) logEntry.setFiber(request.getFiber());
        if (request.getWaterMl() != null) {
            logEntry.setWaterMl(logEntry.getWaterMl() + request.getWaterMl());
        }
        if (request.getNotes() != null) logEntry.setNotes(request.getNotes());

        nutritionLogRepository.save(logEntry);

        // Update progress entry water
        if (request.getWaterMl() != null) {
            ProgressEntry progress = progressEntryRepository.findByUserIdAndDate(userId, date)
                    .orElseGet(() -> ProgressEntry.builder()
                            .id(UUID.randomUUID().toString())
                            .user(user)
                            .date(date)
                            .workoutsCompleted(0)
                            .mealsLogged(0)
                            .waterMl(0)
                            .build());
            progress.setWaterMl(progress.getWaterMl() + request.getWaterMl());
            progressEntryRepository.save(progress);
        }

        return getSummary(userId, date);
    }

    @Transactional(readOnly = true)
    public NutritionSummaryResponse getSummary(String userId, LocalDate date) {
        if (date == null) date = LocalDate.now();

        MealPlan plan = mealPlanRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .orElse(null);

        double targetCal = plan != null && plan.getTargetCalories() != null ? plan.getTargetCalories() : 2000.0;
        double targetProt = plan != null && plan.getTargetProtein() != null ? plan.getTargetProtein() : 120.0;
        double targetCarb = plan != null && plan.getTargetCarbs() != null ? plan.getTargetCarbs() : 220.0;
        double targetFat = plan != null && plan.getTargetFat() != null ? plan.getTargetFat() : 60.0;

        NutritionLog logEntry = nutritionLogRepository.findByUserIdAndDate(userId, date).orElse(null);

        double consumedCal = logEntry != null ? logEntry.getCalories() : 0.0;
        double consumedProt = logEntry != null ? logEntry.getProtein() : 0.0;
        double consumedCarb = logEntry != null ? logEntry.getCarbohydrates() : 0.0;
        double consumedFat = logEntry != null ? logEntry.getFat() : 0.0;
        int water = logEntry != null ? logEntry.getWaterMl() : 0;

        double remainingProt = Math.max(0.0, targetProt - consumedProt);
        int proteinPct = (int) Math.min(100.0, Math.round((consumedProt / targetProt) * 100.0));
        int calPct = (int) Math.min(100.0, Math.round((consumedCal / targetCal) * 100.0));

        return NutritionSummaryResponse.builder()
                .date(date)
                .targetCalories(targetCal)
                .consumedCalories(consumedCal)
                .targetProtein(targetProt)
                .consumedProtein(consumedProt)
                .remainingProtein(remainingProt)
                .targetCarbs(targetCarb)
                .consumedCarbs(consumedCarb)
                .targetFat(targetFat)
                .consumedFat(consumedFat)
                .proteinProgressPercentage(proteinPct)
                .calorieProgressPercentage(calPct)
                .waterMl(water)
                .targetWaterMl(2500)
                .build();
    }

    private MealPlanResponse toPlanDto(MealPlan plan) {
        List<Meal> meals = mealRepository.findByMealPlanId(plan.getId());
        List<MealResponse> mealDtos = meals.stream().map(this::toMealDto).collect(Collectors.toList());

        return MealPlanResponse.builder()
                .id(plan.getId())
                .version(plan.getVersion())
                .targetCalories(plan.getTargetCalories())
                .targetProtein(plan.getTargetProtein())
                .targetCarbs(plan.getTargetCarbs())
                .targetFat(plan.getTargetFat())
                .status(plan.getStatus())
                .meals(mealDtos)
                .build();
    }

    private MealResponse toMealDto(Meal meal) {
        List<MealItem> items = mealItemRepository.findByMealId(meal.getId());
        double cal = 0.0;
        double prot = 0.0;
        double carbs = 0.0;
        double fat = 0.0;

        List<MealItemDto> itemDtos = new ArrayList<>();
        for (MealItem item : items) {
            FoodItem fi = item.getFoodItem();
            double s = item.getServings() != null ? item.getServings() : 1.0;
            cal += fi.getCalories() * s;
            prot += fi.getProtein() * s;
            carbs += fi.getCarbohydrates() * s;
            fat += fi.getFat() * s;

            itemDtos.add(MealItemDto.builder()
                    .id(item.getId())
                    .foodItem(FoodItemResponse.from(fi))
                    .quantity(item.getQuantity())
                    .servings(item.getServings())
                    .build());
        }

        return MealResponse.builder()
                .id(meal.getId())
                .date(meal.getDate())
                .mealType(meal.getMealType())
                .mealTime(meal.getMealTime())
                .title(meal.getTitle())
                .notes(meal.getNotes())
                .isConsumed(meal.getIsConsumed())
                .calories(Math.round(cal * 10.0) / 10.0)
                .protein(Math.round(prot * 10.0) / 10.0)
                .carbohydrates(Math.round(carbs * 10.0) / 10.0)
                .fat(Math.round(fat * 10.0) / 10.0)
                .items(itemDtos)
                .build();
    }
}
