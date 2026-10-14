import { apiClient } from './client';
import {
  AdminStatsResponse,
  AdminUserDto,
  UpdateUserRoleRequest,
  UpdateUserStatusRequest,
} from '../types/admin';
import { ExerciseResponse } from '../types/workout';
import { FoodItemResponse } from '../types/nutrition';

export const adminApi = {
  getStats: (): Promise<{ success: boolean; data: AdminStatsResponse }> =>
    apiClient.get('/admin/dashboard'),

  getUsers: (params?: { query?: string; page?: number; size?: number }): Promise<{
    success: boolean;
    data: { content: AdminUserDto[]; totalElements: number; totalPages: number };
  }> => apiClient.get('/admin/users', { params }),

  updateUserStatus: (
    id: string,
    data: UpdateUserStatusRequest
  ): Promise<{ success: boolean; data: AdminUserDto; message?: string }> =>
    apiClient.patch(`/admin/users/${id}/status`, data),

  updateUserRoles: (
    id: string,
    data: UpdateUserRoleRequest
  ): Promise<{ success: boolean; data: AdminUserDto; message?: string }> =>
    apiClient.patch(`/admin/users/${id}/role`, data),

  getExercises: (params?: { query?: string; page?: number; size?: number }): Promise<{
    success: boolean;
    data: { content: ExerciseResponse[]; totalElements: number; totalPages: number };
  }> => apiClient.get('/admin/exercises', { params }),

  createExercise: (data: Partial<ExerciseResponse>): Promise<{ success: boolean; data: ExerciseResponse }> =>
    apiClient.post('/admin/exercises', data),

  updateExercise: (id: string, data: Partial<ExerciseResponse>): Promise<{ success: boolean; data: ExerciseResponse }> =>
    apiClient.put(`/admin/exercises/${id}`, data),

  deactivateExercise: (id: string): Promise<{ success: boolean; message?: string }> =>
    apiClient.delete(`/admin/exercises/${id}`),

  getFoods: (params?: { query?: string; page?: number; size?: number }): Promise<{
    success: boolean;
    data: { content: FoodItemResponse[]; totalElements: number; totalPages: number };
  }> => apiClient.get('/admin/foods', { params }),

  createFood: (data: Partial<FoodItemResponse>): Promise<{ success: boolean; data: FoodItemResponse }> =>
    apiClient.post('/admin/foods', data),

  updateFood: (id: string, data: Partial<FoodItemResponse>): Promise<{ success: boolean; data: FoodItemResponse }> =>
    apiClient.put(`/admin/foods/${id}`, data),

  deactivateFood: (id: string): Promise<{ success: boolean; message?: string }> =>
    apiClient.delete(`/admin/foods/${id}`),
};
