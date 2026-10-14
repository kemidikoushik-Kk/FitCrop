import { apiClient } from './client';
import { OnboardingRequest, UpdateProfileRequest, UserProfileResponse } from '../types/profile';

export const profileApi = {
  getProfile: (): Promise<{ success: boolean; data: UserProfileResponse }> =>
    apiClient.get('/profile'),

  updateProfile: (data: UpdateProfileRequest): Promise<{ success: boolean; data: UserProfileResponse; message?: string }> =>
    apiClient.put('/profile', data),

  completeOnboarding: (data: OnboardingRequest): Promise<{ success: boolean; data: UserProfileResponse; message?: string }> =>
    apiClient.post('/profile/onboarding', data),
};
