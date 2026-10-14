import { apiClient } from './client';
import { MealResponse, NutritionSummaryResponse } from '../types/nutrition';
import { ProgressSummaryResponse } from '../types/progress';
import { ScheduleEventDto } from '../types/schedule';
import { WorkoutDayResponse } from '../types/workout';

export interface DashboardResponse {
  userName: string;
  greeting: string;
  motivationalQuote: string;
  todayWorkout?: WorkoutDayResponse;
  nutritionSummary?: NutritionSummaryResponse;
  todayMeals?: MealResponse[];
  todaySchedule?: ScheduleEventDto[];
  progressSummary?: ProgressSummaryResponse;
  onboardingCompleted: boolean;
  unreadNotificationsCount: number;
}

export const dashboardApi = {
  getDashboard: (): Promise<{ success: boolean; data: DashboardResponse }> =>
    apiClient.get('/dashboard'),
};
