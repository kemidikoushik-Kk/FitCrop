package com.fitcorp.progress;

import com.fitcorp.nutrition.MealPlanRepository;
import com.fitcorp.nutrition.NutritionLogRepository;
import com.fitcorp.profile.UserProfile;
import com.fitcorp.profile.UserProfileRepository;
import com.fitcorp.progress.dto.ProgressSummaryResponse;
import com.fitcorp.workout.WorkoutLogRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProgressServiceTest {

    @Mock
    private ProgressEntryRepository progressEntryRepository;

    @Mock
    private BodyMeasurementRepository bodyMeasurementRepository;

    @Mock
    private WorkoutLogRepository workoutLogRepository;

    @Mock
    private NutritionLogRepository nutritionLogRepository;

    @Mock
    private MealPlanRepository mealPlanRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private ProgressService progressService;

    @Test
    @DisplayName("Streak is calculated accurately based on real consecutive completed days")
    void shouldCalculateAccurateStreak() {
        LocalDate today = LocalDate.now();

        ProgressEntry day0 = ProgressEntry.builder().date(today).workoutsCompleted(1).build();
        ProgressEntry day1 = ProgressEntry.builder().date(today.minusDays(1)).workoutsCompleted(1).build();
        ProgressEntry day2 = ProgressEntry.builder().date(today.minusDays(2)).workoutsCompleted(1).build();
        // Day 3 was missed (0 workouts)
        ProgressEntry day3 = ProgressEntry.builder().date(today.minusDays(3)).workoutsCompleted(0).build();
        ProgressEntry day4 = ProgressEntry.builder().date(today.minusDays(4)).workoutsCompleted(1).build();

        when(progressEntryRepository.findByUserIdOrderByDateDesc("user-1"))
                .thenReturn(List.of(day0, day1, day2, day3, day4));

        UserProfile profile = UserProfile.builder().weightKg(75.0).build();
        when(userProfileRepository.findByUserId("user-1")).thenReturn(Optional.of(profile));
        when(workoutLogRepository.countByUserIdAndStatus("user-1", "COMPLETED")).thenReturn(4L);
        when(nutritionLogRepository.countByUserId("user-1")).thenReturn(10L);
        when(progressEntryRepository.findByUserIdAndDateBetweenOrderByDateAsc(eq("user-1"), any(), any()))
                .thenReturn(List.of(day0, day1, day2));

        ProgressSummaryResponse summary = progressService.getSummary("user-1");

        assertEquals(3, summary.getCurrentStreak(), "Current streak should stop at the missed day (3 days)");
        assertEquals(3, summary.getLongestStreak(), "Longest streak should be 3");
        assertEquals(4L, summary.getTotalWorkoutsCompleted());
    }
}
