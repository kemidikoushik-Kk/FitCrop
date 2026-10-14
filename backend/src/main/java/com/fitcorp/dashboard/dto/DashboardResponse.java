package com.fitcorp.dashboard.dto;

import com.fitcorp.nutrition.dto.MealResponse;
import com.fitcorp.nutrition.dto.NutritionSummaryResponse;
import com.fitcorp.progress.dto.ProgressSummaryResponse;
import com.fitcorp.schedule.dto.ScheduleEventDto;
import com.fitcorp.workout.dto.WorkoutDayResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private String userName;
    private String greeting;
    private String motivationalQuote;
    private WorkoutDayResponse todayWorkout;
    private NutritionSummaryResponse nutritionSummary;
    private List<MealResponse> todayMeals;
    private List<ScheduleEventDto> todaySchedule;
    private ProgressSummaryResponse progressSummary;
    private boolean onboardingCompleted;
    private int unreadNotificationsCount;
}
