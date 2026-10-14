package com.fitcorp.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceDto {
    private Boolean workoutReminders;
    private Boolean mealReminders;
    private Boolean waterReminders;
    private Boolean weeklyProgressReminders;
    private Integer reminderLeadMinutes;
}
