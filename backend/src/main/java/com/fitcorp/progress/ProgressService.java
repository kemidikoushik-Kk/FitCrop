package com.fitcorp.progress;

import com.fitcorp.exception.ResourceNotFoundException;
import com.fitcorp.nutrition.MealPlan;
import com.fitcorp.nutrition.MealPlanRepository;
import com.fitcorp.nutrition.NutritionLog;
import com.fitcorp.nutrition.NutritionLogRepository;
import com.fitcorp.profile.UserProfile;
import com.fitcorp.profile.UserProfileRepository;
import com.fitcorp.progress.dto.*;
import com.fitcorp.user.User;
import com.fitcorp.user.UserRepository;
import com.fitcorp.workout.WorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressEntryRepository progressEntryRepository;
    private final BodyMeasurementRepository bodyMeasurementRepository;
    private final WorkoutLogRepository workoutLogRepository;
    private final NutritionLogRepository nutritionLogRepository;
    private final MealPlanRepository mealPlanRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    @Transactional(readOnly = true)
    public ProgressSummaryResponse getSummary(String userId) {
        List<ProgressEntry> entries = progressEntryRepository.findByUserIdOrderByDateDesc(userId);
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);

        // 1. Calculate Real Streak
        int currentStreak = calculateCurrentStreak(entries);
        int longestStreak = calculateLongestStreak(entries);

        // 2. Count Completed Workouts
        long totalWorkouts = workoutLogRepository.countByUserIdAndStatus(userId, "COMPLETED");
        long totalMeals = nutritionLogRepository.countByUserId(userId);

        // 3. Weekly Consistency
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);
        List<ProgressEntry> weekEntries = progressEntryRepository.findByUserIdAndDateBetweenOrderByDateAsc(userId, weekStart, today);

        int workoutsThisWeek = weekEntries.stream()
                .mapToInt(e -> e.getWorkoutsCompleted() != null && e.getWorkoutsCompleted() > 0 ? 1 : 0)
                .sum();

        int targetWorkoutsThisWeek = 4; // Standard 4 workouts per week corporate target
        int consistencyPct = (int) Math.min(100.0, Math.round(((double) workoutsThisWeek / targetWorkoutsThisWeek) * 100.0));

        // 4. Weight Tracking
        Double currentWeight = profile != null ? profile.getWeightKg() : null;
        Double startWeight = currentWeight;

        if (!entries.isEmpty()) {
            ProgressEntry latest = entries.stream().filter(e -> e.getWeightKg() != null).findFirst().orElse(null);
            if (latest != null && latest.getWeightKg() != null) {
                currentWeight = latest.getWeightKg();
            }

            // Earliest recorded weight
            ProgressEntry earliest = entries.stream()
                    .filter(e -> e.getWeightKg() != null)
                    .reduce((first, second) -> second)
                    .orElse(null);
            if (earliest != null && earliest.getWeightKg() != null) {
                startWeight = earliest.getWeightKg();
            }
        }

        Double weightChange = (currentWeight != null && startWeight != null)
                ? Math.round((currentWeight - startWeight) * 10.0) / 10.0
                : 0.0;

        return ProgressSummaryResponse.builder()
                .currentStreak(currentStreak)
                .longestStreak(longestStreak)
                .totalWorkoutsCompleted(totalWorkouts)
                .workoutsCompletedThisWeek(workoutsThisWeek)
                .targetWorkoutsThisWeek(targetWorkoutsThisWeek)
                .consistencyPercentage(consistencyPct)
                .currentWeight(currentWeight)
                .startingWeight(startWeight)
                .weightChange(weightChange)
                .totalMealsLogged(totalMeals)
                .build();
    }

    @Transactional(readOnly = true)
    public ProgressChartsResponse getCharts(String userId) {
        LocalDate today = LocalDate.now();
        LocalDate past14Days = today.minusDays(13);

        // 1. Weight Trend (last 14 days)
        List<ProgressEntry> entries = progressEntryRepository.findByUserIdAndDateBetweenOrderByDateAsc(userId, past14Days, today);
        Map<LocalDate, Double> weightMap = entries.stream()
                .filter(e -> e.getWeightKg() != null)
                .collect(Collectors.toMap(ProgressEntry::getDate, ProgressEntry::getWeightKg, (a, b) -> b));

        List<ProgressChartsResponse.WeightPoint> weightPoints = new ArrayList<>();
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        double baselineWeight = profile != null && profile.getWeightKg() != null ? profile.getWeightKg() : 75.0;

        for (int i = 13; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            Double w = weightMap.getOrDefault(d, baselineWeight);
            weightPoints.add(ProgressChartsResponse.WeightPoint.builder()
                    .date(d)
                    .weight(w)
                    .build());
        }

        // 2. Workout Consistency (Last 7 days bar chart)
        Map<LocalDate, Integer> workoutMap = entries.stream()
                .collect(Collectors.toMap(ProgressEntry::getDate,
                        e -> e.getWorkoutsCompleted() != null ? e.getWorkoutsCompleted() : 0, (a, b) -> b));

        List<ProgressChartsResponse.ConsistencyBar> consistencyBars = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            int completed = workoutMap.getOrDefault(d, 0) > 0 ? 1 : 0;
            consistencyBars.add(ProgressChartsResponse.ConsistencyBar.builder()
                    .dayOfWeek(d.getDayOfWeek().name().substring(0, 3))
                    .date(d)
                    .completed(completed)
                    .target(1)
                    .build());
        }

        // 3. Nutrition Consistency (Last 7 days protein & calorie target vs consumed)
        MealPlan plan = mealPlanRepository.findByUserIdAndStatus(userId, "ACTIVE").orElse(null);
        double targetCal = plan != null && plan.getTargetCalories() != null ? plan.getTargetCalories() : 2000.0;
        double targetProt = plan != null && plan.getTargetProtein() != null ? plan.getTargetProtein() : 120.0;

        List<NutritionLog> nutritionLogs = nutritionLogRepository.findByUserIdAndDateBetweenOrderByDateAsc(
                userId, today.minusDays(6), today);
        Map<LocalDate, NutritionLog> nutMap = nutritionLogs.stream()
                .collect(Collectors.toMap(NutritionLog::getDate, nl -> nl, (a, b) -> b));

        List<ProgressChartsResponse.NutritionPoint> nutritionPoints = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            NutritionLog nl = nutMap.get(d);
            double consProt = nl != null && nl.getProtein() != null ? nl.getProtein() : 0.0;
            double consCal = nl != null && nl.getCalories() != null ? nl.getCalories() : 0.0;

            nutritionPoints.add(ProgressChartsResponse.NutritionPoint.builder()
                    .date(d)
                    .consumedProtein(consProt)
                    .targetProtein(targetProt)
                    .consumedCalories(consCal)
                    .targetCalories(targetCal)
                    .build());
        }

        return ProgressChartsResponse.builder()
                .weightTrend(weightPoints)
                .workoutConsistency(consistencyBars)
                .nutritionConsistency(nutritionPoints)
                .build();
    }

    @Transactional
    public ProgressEntryDto recordProgress(String userId, ProgressEntryDto dto) {
        User user = userRepository.findById(userId).orElseThrow();
        LocalDate date = dto.getDate() != null ? dto.getDate() : LocalDate.now();

        ProgressEntry entry = progressEntryRepository.findByUserIdAndDate(userId, date)
                .orElseGet(() -> ProgressEntry.builder()
                        .id(UUID.randomUUID().toString())
                        .user(user)
                        .date(date)
                        .workoutsCompleted(0)
                        .mealsLogged(0)
                        .waterMl(0)
                        .build());

        if (dto.getWeightKg() != null) {
            entry.setWeightKg(dto.getWeightKg());
            // Also update current weight on profile
            userProfileRepository.findByUserId(userId).ifPresent(p -> {
                p.setWeightKg(dto.getWeightKg());
                userProfileRepository.save(p);
            });
        }
        if (dto.getWorkoutsCompleted() != null) entry.setWorkoutsCompleted(dto.getWorkoutsCompleted());
        if (dto.getMealsLogged() != null) entry.setMealsLogged(dto.getMealsLogged());
        if (dto.getWaterMl() != null) entry.setWaterMl(dto.getWaterMl());
        if (dto.getNotes() != null) entry.setNotes(dto.getNotes());

        ProgressEntry saved = progressEntryRepository.save(entry);
        return toDto(saved);
    }

    @Transactional
    public BodyMeasurementDto recordMeasurement(String userId, BodyMeasurementDto dto) {
        User user = userRepository.findById(userId).orElseThrow();
        LocalDate date = dto.getDate() != null ? dto.getDate() : LocalDate.now();

        BodyMeasurement bm = bodyMeasurementRepository.findByUserIdAndDate(userId, date)
                .orElseGet(() -> BodyMeasurement.builder()
                        .id(UUID.randomUUID().toString())
                        .user(user)
                        .date(date)
                        .build());

        if (dto.getWeightKg() != null) bm.setWeightKg(dto.getWeightKg());
        if (dto.getBodyFatPercentage() != null) bm.setBodyFatPercentage(dto.getBodyFatPercentage());
        if (dto.getChestCm() != null) bm.setChestCm(dto.getChestCm());
        if (dto.getWaistCm() != null) bm.setWaistCm(dto.getWaistCm());
        if (dto.getHipsCm() != null) bm.setHipsCm(dto.getHipsCm());
        if (dto.getArmsCm() != null) bm.setArmsCm(dto.getArmsCm());
        if (dto.getThighsCm() != null) bm.setThighsCm(dto.getThighsCm());
        if (dto.getNotes() != null) bm.setNotes(dto.getNotes());

        BodyMeasurement saved = bodyMeasurementRepository.save(bm);
        return toMeasurementDto(saved);
    }

    private int calculateCurrentStreak(List<ProgressEntry> entries) {
        if (entries == null || entries.isEmpty()) return 0;

        Map<LocalDate, Boolean> activeDays = entries.stream()
                .filter(e -> (e.getWorkoutsCompleted() != null && e.getWorkoutsCompleted() > 0)
                        || (e.getMealsLogged() != null && e.getMealsLogged() > 0))
                .collect(Collectors.toMap(ProgressEntry::getDate, e -> true, (a, b) -> true));

        LocalDate cursor = LocalDate.now();
        // If not logged today, check if yesterday was logged before resetting streak
        if (!activeDays.containsKey(cursor)) {
            cursor = cursor.minusDays(1);
        }

        int streak = 0;
        while (activeDays.containsKey(cursor)) {
            streak++;
            cursor = cursor.minusDays(1);
        }

        return streak;
    }

    private int calculateLongestStreak(List<ProgressEntry> entries) {
        if (entries == null || entries.isEmpty()) return 0;

        List<LocalDate> dates = entries.stream()
                .filter(e -> (e.getWorkoutsCompleted() != null && e.getWorkoutsCompleted() > 0)
                        || (e.getMealsLogged() != null && e.getMealsLogged() > 0))
                .map(ProgressEntry::getDate)
                .distinct()
                .sorted()
                .toList();

        if (dates.isEmpty()) return 0;

        int maxStreak = 1;
        int currentStreak = 1;

        for (int i = 1; i < dates.size(); i++) {
            if (dates.get(i).equals(dates.get(i - 1).plusDays(1))) {
                currentStreak++;
                if (currentStreak > maxStreak) {
                    maxStreak = currentStreak;
                }
            } else {
                currentStreak = 1;
            }
        }

        return maxStreak;
    }

    private ProgressEntryDto toDto(ProgressEntry e) {
        return ProgressEntryDto.builder()
                .id(e.getId())
                .date(e.getDate())
                .weightKg(e.getWeightKg())
                .workoutsCompleted(e.getWorkoutsCompleted())
                .mealsLogged(e.getMealsLogged())
                .waterMl(e.getWaterMl())
                .notes(e.getNotes())
                .build();
    }

    private BodyMeasurementDto toMeasurementDto(BodyMeasurement bm) {
        return BodyMeasurementDto.builder()
                .id(bm.getId())
                .date(bm.getDate())
                .weightKg(bm.getWeightKg())
                .bodyFatPercentage(bm.getBodyFatPercentage())
                .chestCm(bm.getChestCm())
                .waistCm(bm.getWaistCm())
                .hipsCm(bm.getHipsCm())
                .armsCm(bm.getArmsCm())
                .thighsCm(bm.getThighsCm())
                .notes(bm.getNotes())
                .build();
    }
}
