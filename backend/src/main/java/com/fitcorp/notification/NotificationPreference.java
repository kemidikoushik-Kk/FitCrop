package com.fitcorp.notification;

import com.fitcorp.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notification_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreference {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    @Column(name = "workout_reminders")
    private Boolean workoutReminders = true;

    @Builder.Default
    @Column(name = "meal_reminders")
    private Boolean mealReminders = true;

    @Builder.Default
    @Column(name = "water_reminders")
    private Boolean waterReminders = true;

    @Builder.Default
    @Column(name = "weekly_progress_reminders")
    private Boolean weeklyProgressReminders = true;

    @Builder.Default
    @Column(name = "reminder_lead_minutes")
    private Integer reminderLeadMinutes = 15;
}
