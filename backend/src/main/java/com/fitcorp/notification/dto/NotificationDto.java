package com.fitcorp.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private String id;
    private String type;
    private String title;
    private String message;
    private Boolean isRead;
    private String actionUrl;
    private Instant createdAt;
}
