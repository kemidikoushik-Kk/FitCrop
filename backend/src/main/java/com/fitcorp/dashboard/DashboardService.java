package com.fitcorp.dashboard;

import com.fitcorp.dashboard.dto.DashboardResponse;
import com.fitcorp.notification.NotificationRepository;
import com.fitcorp.nutrition.NutritionService;
import com.fitcorp.nutrition.dto.MealResponse;
import com.fitcorp.nutrition.dto.NutritionSummaryResponse;
import com.fitcorp.progress.ProgressService;
import com.fitcorp.progress.dto.ProgressSummaryResponse;
import com.fitcorp.schedule.ScheduleService;
import com.fitcorp.schedule.dto.ScheduleEventDto;
import com.fitcorp.user.User;
import com.fitcorp.user.UserRepository;
import com.fitcorp.workout.WorkoutService;
import com.fitcorp.workout.dto.WorkoutDayResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final WorkoutService workoutService;
    private final NutritionService nutritionService;
    private final ProgressService progressService;
    private final ScheduleService scheduleService;
    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboardData(String userId) {
        User user = userRepository.findById(userId).orElseThrow();

        // Greeting based on time of day
        LocalTime now = LocalTime.now();
        String timeGreeting = (now.getHour() < 12) ? "Good morning"
                : (now.getHour() < 17 ? "Good afternoon" : "Good evening");
        String greeting = String.format("%s, %s!", timeGreeting, user.getFullName());

        String[] quotes = {
                "Consistency beats perfection. Make today count.",
                "Your routine is built around your workday.",
                "Small, sustainable actions compound over time.",
                "Ready for today's session? Focus on feeling great.",
                "Energy flows where intention goes."
        };
        int quoteIndex = (int) (System.currentTimeMillis() % quotes.length);
        String motivationalQuote = quotes[quoteIndex];

        // 1. Today's Workout
        WorkoutDayResponse todayWorkout = null;
        try {
            todayWorkout = workoutService.getTodayWorkout(userId);
        } catch (Exception ex) {
            log.debug("No today workout scheduled yet for user: {}", user.getEmail());
        }

        // 2. Nutrition Summary & Meals
        LocalDate today = LocalDate.now();
        NutritionSummaryResponse nutritionSummary = nutritionService.getSummary(userId, today);
        List<MealResponse> todayMeals = nutritionService.getTodayMeals(userId);

        // 3. Schedule Events for Today
        Instant dayStart = Instant.now().truncatedTo(ChronoUnit.DAYS);
        Instant dayEnd = dayStart.plus(1, ChronoUnit.DAYS);
        List<ScheduleEventDto> todaySchedule = scheduleService.getCalendarEvents(userId, dayStart, dayEnd);

        // 4. Progress Summary
        ProgressSummaryResponse progressSummary = progressService.getSummary(userId);

        // 5. Notifications count
        int unreadCount = (int) notificationRepository.countByUserIdAndIsReadFalse(userId);

        return DashboardResponse.builder()
                .userName(user.getFullName())
                .greeting(greeting)
                .motivationalQuote(motivationalQuote)
                .todayWorkout(todayWorkout)
                .nutritionSummary(nutritionSummary)
                .todayMeals(todayMeals)
                .todaySchedule(todaySchedule)
                .progressSummary(progressSummary)
                .onboardingCompleted(user.getOnboardingCompleted())
                .unreadNotificationsCount(unreadCount)
                .build();
    }
}
