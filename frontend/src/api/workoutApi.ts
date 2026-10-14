import { apiClient } from './client';
import {
  CompleteWorkoutRequest,
  ExerciseResponse,
  WorkoutDayResponse,
  WorkoutLogResponse,
  WorkoutPlanResponse,
} from '../types/workout';

export const workoutApi = {
  getTodayWorkout: (): Promise<{ success: boolean; data: WorkoutDayResponse }> =>
    apiClient.get('/workouts/today'),

  getActivePlan: (): Promise<{ success: boolean; data: WorkoutPlanResponse }> =>
    apiClient.get('/workouts'),

  generatePlan: (): Promise<{ success: boolean; data: WorkoutPlanResponse; message?: string }> =>
    apiClient.post('/workouts/generate'),

  startWorkout: (id: string): Promise<{ success: boolean; data: WorkoutDayResponse }> =>
    apiClient.post(`/workouts/${id}/start`),

  completeWorkout: (
    id: string,
    data: CompleteWorkoutRequest
  ): Promise<{ success: boolean; data: WorkoutLogResponse; message?: string }> =>
    apiClient.post(`/workouts/${id}/complete`, data),

  skipWorkout: (id: string): Promise<{ success: boolean; data: WorkoutDayResponse }> =>
    apiClient.post(`/workouts/${id}/skip`),

  getExercises: (params?: {
    query?: string;
    category?: string;
    muscleGroup?: string;
    equipment?: string;
    difficulty?: string;
    page?: number;
    size?: number;
  }): Promise<{ success: boolean; data: { content: ExerciseResponse[]; totalElements: number; totalPages: number } }> =>
    apiClient.get('/exercises', { params }),

  getExerciseById: (id: string): Promise<{ success: boolean; data: ExerciseResponse }> =>
    apiClient.get(`/exercises/${id}`),
};
