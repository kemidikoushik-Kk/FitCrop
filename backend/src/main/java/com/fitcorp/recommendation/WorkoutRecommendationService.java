package com.fitcorp.recommendation;

import com.fitcorp.exercise.Exercise;
import com.fitcorp.exercise.ExerciseRepository;
import com.fitcorp.profile.UserProfile;
import com.fitcorp.workout.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkoutRecommendationService {

    private final ExerciseRepository exerciseRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final WorkoutDayRepository workoutDayRepository;
    private final WorkoutExerciseRepository workoutExerciseRepository;

    @Transactional
    public WorkoutPlan generatePlanForUser(UserProfile profile) {
        String userId = profile.getUser().getId();

        // 1. Versioning: archive any existing active plans
        workoutPlanRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .ifPresent(existingPlan -> {
                    existingPlan.setStatus("ARCHIVED");
                    workoutPlanRepository.save(existingPlan);
                });

        int nextVersion = workoutPlanRepository.findTopByUserIdOrderByVersionDesc(userId)
                .map(p -> p.getVersion() + 1)
                .orElse(1);

        String planName = String.format("FitCorp Corporate %s Plan (v%d)",
                formatGoalName(profile.getPrimaryFitnessGoal()), nextVersion);

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusWeeks(4);

        WorkoutPlan plan = WorkoutPlan.builder()
                .id(UUID.randomUUID().toString())
                .user(profile.getUser())
                .name(planName)
                .version(nextVersion)
                .goal(profile.getPrimaryFitnessGoal())
                .startDate(startDate)
                .endDate(endDate)
                .status("ACTIVE")
                .build();

        WorkoutPlan savedPlan = workoutPlanRepository.save(plan);

        // 2. Select compatible exercises based on equipment and level
        List<String> allowedEquipment = resolveEquipmentList(profile.getEquipmentAccess());
        List<String> allowedDifficulties = resolveDifficultyList(profile.getFitnessLevel());

        List<Exercise> compatibleExercises = exerciseRepository.findCompatibleExercises(
                allowedDifficulties, allowedEquipment);

        if (compatibleExercises.isEmpty()) {
            compatibleExercises = exerciseRepository.findByIsActiveTrue();
        }

        Map<String, List<Exercise>> exercisesByCategory = compatibleExercises.stream()
                .collect(Collectors.groupingBy(Exercise::getCategory));

        // 3. Determine schedule pattern (e.g. 7-day rolling cycle)
        Set<String> preferredDays = parseDays(profile.getPreferredWorkoutDays());
        int workoutMinutes = profile.getAvailableWorkoutMinutes() != null ? profile.getAvailableWorkoutMinutes() : 30;

        List<WorkoutDay> plannedDays = new ArrayList<>();

        for (int i = 0; i < 7; i++) {
            LocalDate dayDate = startDate.plusDays(i);
            DayOfWeek dayOfWeek = dayDate.getDayOfWeek();
            String dayName = dayOfWeek.name();
            String shortDay = dayName.substring(0, 3);

            boolean isWorkoutDay = preferredDays.contains(shortDay) || preferredDays.contains(dayName);

            WorkoutDay workoutDay = WorkoutDay.builder()
                    .id(UUID.randomUUID().toString())
                    .workoutPlan(savedPlan)
                    .date(dayDate)
                    .dayOfWeek(dayName)
                    .status("SCHEDULED")
                    .build();

            if (isWorkoutDay) {
                assignWorkoutRoutine(workoutDay, i, profile.getPrimaryFitnessGoal(), workoutMinutes, exercisesByCategory);
            } else {
                assignRestOrMobility(workoutDay, i, workoutMinutes, exercisesByCategory);
            }

            plannedDays.add(workoutDay);
        }

        workoutDayRepository.saveAll(plannedDays);
        log.info("Generated WorkoutPlan v{} for user: {}", nextVersion, profile.getUser().getEmail());

        return savedPlan;
    }

    private void assignWorkoutRoutine(
            WorkoutDay workoutDay,
            int dayIndex,
            String goal,
            int availableMinutes,
            Map<String, List<Exercise>> byCategory) {

        int exerciseCount = availableMinutes <= 20 ? 3 : (availableMinutes <= 35 ? 5 : 6);
        int defaultSets = availableMinutes <= 20 ? 2 : 3;

        String title;
        List<Exercise> selectedExercises = new ArrayList<>();

        List<Exercise> strength = byCategory.getOrDefault("STRENGTH", Collections.emptyList());
        List<Exercise> cardio = byCategory.getOrDefault("CARDIO", Collections.emptyList());
        List<Exercise> core = byCategory.getOrDefault("CORE", Collections.emptyList());
        List<Exercise> mobility = byCategory.getOrDefault("MOBILITY", Collections.emptyList());

        if (dayIndex % 2 == 0) {
            title = "Full-Body Strength & Tone (" + availableMinutes + "m)";
            selectedExercises.addAll(pickSubList(strength, Math.min(3, exerciseCount)));
            selectedExercises.addAll(pickSubList(core, 1));
            if (selectedExercises.size() < exerciseCount) {
                selectedExercises.addAll(pickSubList(cardio, 1));
            }
        } else {
            if ("MUSCLE_BUILDING".equalsIgnoreCase(goal) || "STRENGTH".equalsIgnoreCase(goal)) {
                title = "Upper Body & Posture Focus (" + availableMinutes + "m)";
                selectedExercises.addAll(pickSubList(strength, Math.min(3, exerciseCount)));
                selectedExercises.addAll(pickSubList(core, 1));
            } else {
                title = "Metabolic Cardio & Core Circuit (" + availableMinutes + "m)";
                selectedExercises.addAll(pickSubList(cardio, 2));
                selectedExercises.addAll(pickSubList(core, 2));
                selectedExercises.addAll(pickSubList(strength, 1));
            }
        }

        workoutDay.setTitle(title);
        workoutDay.setDayType("WORKOUT_DAY");
        workoutDay.setEstimatedDurationMinutes(availableMinutes);

        List<WorkoutExercise> exercisesList = new ArrayList<>();
        int seq = 1;
        for (Exercise ex : selectedExercises) {
            exercisesList.add(WorkoutExercise.builder()
                    .id(UUID.randomUUID().toString())
                    .workoutDay(workoutDay)
                    .exercise(ex)
                    .sequenceOrder(seq++)
                    .sets(defaultSets)
                    .reps(ex.getRepsDefault())
                    .durationSeconds(ex.getDurationDefaultSeconds())
                    .restSeconds(ex.getRestSecondsDefault())
                    .notes("Focus on controlled breathing and clean form.")
                    .build());
        }

        workoutDay.setWorkoutExercises(exercisesList);
    }

    private void assignRestOrMobility(
            WorkoutDay workoutDay,
            int dayIndex,
            int availableMinutes,
            Map<String, List<Exercise>> byCategory) {

        if (dayIndex == 3 || dayIndex == 6) {
            workoutDay.setTitle("Active Recovery & Desk Mobility");
            workoutDay.setDayType("MOBILITY_DAY");
            workoutDay.setEstimatedDurationMinutes(15);

            List<Exercise> mobility = byCategory.getOrDefault("MOBILITY", Collections.emptyList());
            List<Exercise> flexibility = byCategory.getOrDefault("FLEXIBILITY", Collections.emptyList());
            List<Exercise> routine = new ArrayList<>();
            routine.addAll(pickSubList(mobility, 2));
            routine.addAll(pickSubList(flexibility, 1));

            List<WorkoutExercise> exercisesList = new ArrayList<>();
            int seq = 1;
            for (Exercise ex : routine) {
                exercisesList.add(WorkoutExercise.builder()
                        .id(UUID.randomUUID().toString())
                        .workoutDay(workoutDay)
                        .exercise(ex)
                        .sequenceOrder(seq++)
                        .sets(2)
                        .reps(8)
                        .durationSeconds(ex.getDurationDefaultSeconds())
                        .restSeconds(30)
                        .notes("Gentle mobility to relieve desk fatigue.")
                        .build());
            }
            workoutDay.setWorkoutExercises(exercisesList);
        } else {
            workoutDay.setTitle("Workday Recovery & Rest");
            workoutDay.setDayType("REST_DAY");
            workoutDay.setEstimatedDurationMinutes(0);
            workoutDay.setWorkoutExercises(new ArrayList<>());
        }
    }

    private List<String> resolveEquipmentList(String access) {
        if (access == null || access.equalsIgnoreCase("NONE")) {
            return List.of("NONE");
        } else if (access.equalsIgnoreCase("DUMBBELLS")) {
            return List.of("NONE", "DUMBBELLS", "BENCH");
        } else {
            return List.of("NONE", "DUMBBELLS", "BARBELL", "BENCH", "BIKE", "TREADMILL", "MACHINE");
        }
    }

    private List<String> resolveDifficultyList(String level) {
        if (level == null || level.equalsIgnoreCase("BEGINNER")) {
            return List.of("BEGINNER");
        } else if (level.equalsIgnoreCase("INTERMEDIATE")) {
            return List.of("BEGINNER", "INTERMEDIATE");
        } else {
            return List.of("BEGINNER", "INTERMEDIATE", "ADVANCED");
        }
    }

    private Set<String> parseDays(String daysStr) {
        if (daysStr == null || daysStr.isBlank()) {
            return Set.of("MON", "WED", "FRI");
        }
        return Arrays.stream(daysStr.split(","))
                .map(String::trim)
                .map(String::toUpperCase)
                .collect(Collectors.toSet());
    }

    private List<Exercise> pickSubList(List<Exercise> list, int count) {
        if (list == null || list.isEmpty() || count <= 0) return Collections.emptyList();
        List<Exercise> copy = new ArrayList<>(list);
        Collections.shuffle(copy);
        return copy.subList(0, Math.min(count, copy.size()));
    }

    private String formatGoalName(String goal) {
        if (goal == null) return "Wellness";
        return switch (goal) {
            case "WEIGHT_MANAGEMENT" -> "Weight Management";
            case "MUSCLE_BUILDING" -> "Muscle Building";
            case "STRENGTH" -> "Strength Foundation";
            case "ENDURANCE" -> "Cardio & Stamina";
            case "FLEXIBILITY" -> "Mobility & Posture";
            default -> "General Fitness";
        };
    }
}
