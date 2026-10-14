import { apiClient } from './client';
import { AuthResponse, LoginRequest, RegisterRequest, UserSummary } from '../types/auth';

export const authApi = {
  register: (data: RegisterRequest): Promise<{ success: boolean; data: AuthResponse; message?: string }> =>
    apiClient.post('/auth/register', data),

  login: (data: LoginRequest): Promise<{ success: boolean; data: AuthResponse; message?: string }> =>
    apiClient.post('/auth/login', data),

  refreshToken: (refreshToken: string): Promise<{ success: boolean; data: AuthResponse }> =>
    apiClient.post('/auth/refresh', { refreshToken }),

  logout: (refreshToken?: string): Promise<{ success: boolean; message?: string }> =>
    apiClient.post('/auth/logout', { refreshToken }),

  getMe: (): Promise<{ success: boolean; data: UserSummary }> =>
    apiClient.get('/auth/me'),
};
