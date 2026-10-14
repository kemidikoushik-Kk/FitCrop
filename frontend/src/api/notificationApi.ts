import { apiClient } from './client';
import { NotificationDto, NotificationPreferenceDto } from '../types/notification';

export const notificationApi = {
  getNotifications: (): Promise<{ success: boolean; data: NotificationDto[] }> =>
    apiClient.get('/notifications'),

  markAsRead: (id: string): Promise<{ success: boolean }> =>
    apiClient.patch(`/notifications/${id}/read`),

  markAllAsRead: (): Promise<{ success: boolean }> =>
    apiClient.patch('/notifications/read-all'),

  getPreferences: (): Promise<{ success: boolean; data: NotificationPreferenceDto }> =>
    apiClient.get('/notifications/preferences'),

  updatePreferences: (data: NotificationPreferenceDto): Promise<{ success: boolean; data: NotificationPreferenceDto }> =>
    apiClient.put('/notifications/preferences', data),
};
