import { apiClient } from './client';
import {
  FoodItemResponse,
  LogNutritionRequest,
  MealPlanResponse,
  MealResponse,
  NutritionSummaryResponse,
} from '../types/nutrition';

export const nutritionApi = {
  getTodayMeals: (): Promise<{ success: boolean; data: MealResponse[] }> =>
    apiClient.get('/nutrition/today'),

  getActivePlan: (): Promise<{ success: boolean; data: MealPlanResponse }> =>
    apiClient.get('/nutrition/plans'),

  getSummary: (date?: string): Promise<{ success: boolean; data: NutritionSummaryResponse }> =>
    apiClient.get('/nutrition/summary', { params: { date } }),

  generatePlan: (): Promise<{ success: boolean; data: MealPlanResponse; message?: string }> =>
    apiClient.post('/nutrition/generate'),

  markMealConsumed: (id: string): Promise<{ success: boolean; data: MealResponse; message?: string }> =>
    apiClient.post(`/nutrition/meals/${id}/consume`),

  replaceMeal: (id: string): Promise<{ success: boolean; data: MealResponse; message?: string }> =>
    apiClient.post(`/nutrition/meals/${id}/replace`),

  logNutrition: (data: LogNutritionRequest): Promise<{ success: boolean; data: NutritionSummaryResponse }> =>
    apiClient.post('/nutrition/log', data),

  getFoods: (params?: {
    query?: string;
    category?: string;
    isVegetarian?: boolean;
    isVegan?: boolean;
    page?: number;
    size?: number;
  }): Promise<{ success: boolean; data: { content: FoodItemResponse[]; totalElements: number; totalPages: number } }> =>
    apiClient.get('/foods', { params }),

  getFoodById: (id: string): Promise<{ success: boolean; data: FoodItemResponse }> =>
    apiClient.get(`/foods/${id}`),
};
