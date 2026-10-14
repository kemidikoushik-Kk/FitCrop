package com.fitcorp.notification;

import com.fitcorp.exception.ResourceNotFoundException;
import com.fitcorp.exception.UnauthorizedException;
import com.fitcorp.notification.dto.NotificationDto;
import com.fitcorp.notification.dto.NotificationPreferenceDto;
import com.fitcorp.user.User;
import com.fitcorp.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(String userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (list.isEmpty()) {
            // Seed a welcoming notification for new user
            seedWelcomeNotification(userId);
            list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(String userId, String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to view this notification");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    @Transactional(readOnly = true)
    public NotificationPreferenceDto getPreferences(String userId) {
        NotificationPreference pref = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElseThrow();
                    return preferenceRepository.save(NotificationPreference.builder()
                            .id(UUID.randomUUID().toString())
                            .user(user)
                            .workoutReminders(true)
                            .mealReminders(true)
                            .waterReminders(true)
                            .weeklyProgressReminders(true)
                            .reminderLeadMinutes(15)
                            .build());
                });

        return NotificationPreferenceDto.builder()
                .workoutReminders(pref.getWorkoutReminders())
                .mealReminders(pref.getMealReminders())
                .waterReminders(pref.getWaterReminders())
                .weeklyProgressReminders(pref.getWeeklyProgressReminders())
                .reminderLeadMinutes(pref.getReminderLeadMinutes())
                .build();
    }

    @Transactional
    public NotificationPreferenceDto updatePreferences(String userId, NotificationPreferenceDto dto) {
        NotificationPreference pref = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElseThrow();
                    return NotificationPreference.builder()
                            .id(UUID.randomUUID().toString())
                            .user(user)
                            .build();
                });

        if (dto.getWorkoutReminders() != null) pref.setWorkoutReminders(dto.getWorkoutReminders());
        if (dto.getMealReminders() != null) pref.setMealReminders(dto.getMealReminders());
        if (dto.getWaterReminders() != null) pref.setWaterReminders(dto.getWaterReminders());
        if (dto.getWeeklyProgressReminders() != null) pref.setWeeklyProgressReminders(dto.getWeeklyProgressReminders());
        if (dto.getReminderLeadMinutes() != null) pref.setReminderLeadMinutes(dto.getReminderLeadMinutes());

        NotificationPreference saved = preferenceRepository.save(pref);

        return NotificationPreferenceDto.builder()
                .workoutReminders(saved.getWorkoutReminders())
                .mealReminders(saved.getMealReminders())
                .waterReminders(saved.getWaterReminders())
                .weeklyProgressReminders(saved.getWeeklyProgressReminders())
                .reminderLeadMinutes(saved.getReminderLeadMinutes())
                .build();
    }

    private void seedWelcomeNotification(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            notificationRepository.save(Notification.builder()
                    .id(UUID.randomUUID().toString())
                    .user(user)
                    .type("SYSTEM_NOTIFICATION")
                    .title("Welcome to FitCorp!")
                    .message("Your personalized corporate training and nutrition planner is ready. Fitness that fits your workday.")
                    .isRead(false)
                    .actionUrl("/dashboard")
                    .build());
        }
    }

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .isRead(n.getIsRead())
                .actionUrl(n.getActionUrl())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
