export interface NotificationDto {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface NotificationPreferenceDto {
  workoutReminders: boolean;
  mealReminders: boolean;
  waterReminders: boolean;
  weeklyProgressReminders: boolean;
  reminderLeadMinutes: number;
}
