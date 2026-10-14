package com.fitcorp.workout;

import com.fitcorp.exception.ResourceNotFoundException;
import com.fitcorp.exception.UnauthorizedException;
import com.fitcorp.exercise.Exercise;
import com.fitcorp.exercise.ExerciseRepository;
import com.fitcorp.exercise.dto.ExerciseResponse;
import com.fitcorp.profile.UserProfile;
import com.fitcorp.profile.UserProfileRepository;
import com.fitcorp.progress.ProgressEntry;
import com.fitcorp.progress.ProgressEntryRepository;
import com.fitcorp.recommendation.WorkoutRecommendationService;
import com.fitcorp.user.User;
import com.fitcorp.user.UserRepository;
import com.fitcorp.workout.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkoutService {

    private final WorkoutPlanRepository workoutPlanRepository;
    private final WorkoutDayRepository workoutDayRepository;
    private final WorkoutExerciseRepository workoutExerciseRepository;
    private final WorkoutLogRepository workoutLogRepository;
    private final ExerciseLogRepository exerciseLogRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final WorkoutRecommendationService recommendationService;
    private final ProgressEntryRepository progressEntryRepository;

    @Transactional
    public WorkoutPlanResponse getActivePlan(String userId) {
        WorkoutPlan plan = workoutPlanRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .orElseGet(() -> {
                    // Auto-generate if no active plan exists
                    UserProfile profile = userProfileRepository.findByUserId(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
                    return recommendationService.generatePlanForUser(profile);
                });

        return toPlanDto(plan);
    }

    @Transactional
    public WorkoutDayResponse getTodayWorkout(String userId) {
        WorkoutPlan plan = workoutPlanRepository.findByUserIdAndStatus(userId, "ACTIVE")
                .orElseGet(() -> {
                    UserProfile profile = userProfileRepository.findByUserId(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));
                    return recommendationService.generatePlanForUser(profile);
                });

        LocalDate today = LocalDate.now();
        WorkoutDay todayWorkout = workoutDayRepository.findByWorkoutPlanIdAndDate(plan.getId(), today)
                .orElseGet(() -> {
                    List<WorkoutDay> days = workoutDayRepository.findByWorkoutPlanId(plan.getId());
                    return days.isEmpty() ? null : days.get(0);
                });

        if (todayWorkout == null) {
            throw new ResourceNotFoundException("No workout scheduled for today");
        }

        return toDayDto(todayWorkout);
    }

    @Transactional
    public WorkoutPlanResponse generatePlan(String userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        WorkoutPlan plan = recommendationService.generatePlanForUser(profile);
        return toPlanDto(plan);
    }

    @Transactional
    public WorkoutDayResponse startWorkout(String userId, String workoutDayId) {
        WorkoutDay day = workoutDayRepository.findById(workoutDayId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout day not found: " + workoutDayId));

        if (!day.getWorkoutPlan().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to access this workout");
        }

        day.setStatus("IN_PROGRESS");
        workoutDayRepository.save(day);
        return toDayDto(day);
    }

    @Transactional
    public WorkoutLogResponse completeWorkout(String userId, CompleteWorkoutRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WorkoutDay day = null;
        if (request.getWorkoutDayId() != null) {
            day = workoutDayRepository.findById(request.getWorkoutDayId())
                    .orElse(null);
            if (day != null) {
                if (!day.getWorkoutPlan().getUser().getId().equals(userId)) {
                    throw new UnauthorizedException("You do not have permission to complete this workout");
                }
                day.setStatus("COMPLETED");
                workoutDayRepository.save(day);
            }
        }

        Instant now = Instant.now();
        int duration = request.getDurationSeconds() != null ? request.getDurationSeconds() : 1800;
        Instant started = now.minusSeconds(duration);

        WorkoutLog logEntry = WorkoutLog.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .workoutDayId(request.getWorkoutDayId())
                .startedAt(started)
                .completedAt(now)
                .durationSeconds(duration)
                .status("COMPLETED")
                .notes(request.getNotes())
                .build();

        WorkoutLog savedLog = workoutLogRepository.save(logEntry);

        List<ExerciseLog> exerciseLogs = new ArrayList<>();
        if (request.getExercises() != null) {
            for (CompleteWorkoutRequest.ExerciseLogEntryDto entry : request.getExercises()) {
                Exercise ex = exerciseRepository.findById(entry.getExerciseId()).orElse(null);
                if (ex != null) {
                    exerciseLogs.add(ExerciseLog.builder()
                            .id(UUID.randomUUID().toString())
                            .workoutLog(savedLog)
                            .exercise(ex)
                            .setsCompleted(entry.getSetsCompleted() != null ? entry.getSetsCompleted() : ex.getSetsDefault())
                            .repsCompleted(entry.getRepsCompleted() != null ? entry.getRepsCompleted() : ex.getRepsDefault())
                            .weightKg(entry.getWeightKg() != null ? entry.getWeightKg() : 0.0)
                            .isCompleted(entry.getIsCompleted() != null ? entry.getIsCompleted() : true)
                            .notes(entry.getNotes())
                            .build());
                }
            }
        }

        if (!exerciseLogs.isEmpty()) {
            exerciseLogRepository.saveAll(exerciseLogs);
            savedLog.setExerciseLogs(exerciseLogs);
        }

        // Record daily activity into ProgressEntry for streak calculation
        LocalDate today = LocalDate.now();
        ProgressEntry progress = progressEntryRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> ProgressEntry.builder()
                        .id(UUID.randomUUID().toString())
                        .user(user)
                        .date(today)
                        .workoutsCompleted(0)
                        .mealsLogged(0)
                        .waterMl(0)
                        .build());

        progress.setWorkoutsCompleted(progress.getWorkoutsCompleted() + 1);
        progressEntryRepository.save(progress);

        log.info("Workout marked completed for user: {} (dayId: {})", user.getEmail(), request.getWorkoutDayId());

        return toLogDto(savedLog);
    }

    @Transactional
    public WorkoutDayResponse skipWorkout(String userId, String workoutDayId) {
        WorkoutDay day = workoutDayRepository.findById(workoutDayId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout day not found: " + workoutDayId));

        if (!day.getWorkoutPlan().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this workout");
        }

        day.setStatus("SKIPPED");
        WorkoutDay saved = workoutDayRepository.save(day);
        return toDayDto(saved);
    }

    private WorkoutPlanResponse toPlanDto(WorkoutPlan plan) {
        List<WorkoutDay> days = workoutDayRepository.findByWorkoutPlanId(plan.getId());
        List<WorkoutDayResponse> dayDtos = days.stream().map(this::toDayDto).collect(Collectors.toList());

        return WorkoutPlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .version(plan.getVersion())
                .goal(plan.getGoal())
                .startDate(plan.getStartDate())
                .endDate(plan.getEndDate())
                .status(plan.getStatus())
                .days(dayDtos)
                .build();
    }

    private WorkoutDayResponse toDayDto(WorkoutDay day) {
        List<WorkoutExercise> exercises = workoutExerciseRepository.findByWorkoutDayIdOrderBySequenceOrderAsc(day.getId());
        List<WorkoutExerciseDto> exerciseDtos = exercises.stream().map(we -> WorkoutExerciseDto.builder()
                .id(we.getId())
                .exercise(ExerciseResponse.from(we.getExercise()))
                .sequenceOrder(we.getSequenceOrder())
                .sets(we.getSets())
                .reps(we.getReps())
                .durationSeconds(we.getDurationSeconds())
                .restSeconds(we.getRestSeconds())
                .notes(we.getNotes())
                .build()).collect(Collectors.toList());

        return WorkoutDayResponse.builder()
                .id(day.getId())
                .date(day.getDate())
                .dayOfWeek(day.getDayOfWeek())
                .title(day.getTitle())
                .dayType(day.getDayType())
                .estimatedDurationMinutes(day.getEstimatedDurationMinutes())
                .status(day.getStatus())
                .exercises(exerciseDtos)
                .build();
    }

    private WorkoutLogResponse toLogDto(WorkoutLog log) {
        List<WorkoutLogResponse.LoggedExerciseDto> exercises = log.getExerciseLogs().stream()
                .map(el -> WorkoutLogResponse.LoggedExerciseDto.builder()
                        .exerciseId(el.getExercise().getId())
                        .exerciseName(el.getExercise().getName())
                        .setsCompleted(el.getSetsCompleted())
                        .repsCompleted(el.getRepsCompleted())
                        .weightKg(el.getWeightKg())
                        .isCompleted(el.getIsCompleted())
                        .notes(el.getNotes())
                        .build()).collect(Collectors.toList());

        return WorkoutLogResponse.builder()
                .id(log.getId())
                .workoutDayId(log.getWorkoutDayId())
                .startedAt(log.getStartedAt())
                .completedAt(log.getCompletedAt())
                .durationSeconds(log.getDurationSeconds())
                .status(log.getStatus())
                .notes(log.getNotes())
                .exercisesCompletedCount(exercises.size())
                .exercises(exercises)
                .build();
    }
}
