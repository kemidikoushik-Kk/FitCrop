package com.fitcorp.notification;

import com.fitcorp.common.ApiResponse;
import com.fitcorp.notification.dto.NotificationDto;
import com.fitcorp.notification.dto.NotificationPreferenceDto;
import com.fitcorp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "In-app notifications and user alert preferences")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get current authenticated user's notifications")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getNotifications(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.getUserNotifications(userPrincipal.getId())));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark single notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        notificationService.markAsRead(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.message("Notification marked as read"));
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        notificationService.markAllAsRead(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.message("All notifications marked as read"));
    }

    @GetMapping("/preferences")
    @Operation(summary = "Get user notification and reminder preferences")
    public ResponseEntity<ApiResponse<NotificationPreferenceDto>> getPreferences(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.getPreferences(userPrincipal.getId())));
    }

    @PutMapping("/preferences")
    @Operation(summary = "Update user notification and reminder preferences")
    public ResponseEntity<ApiResponse<NotificationPreferenceDto>> updatePreferences(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody NotificationPreferenceDto dto) {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.updatePreferences(userPrincipal.getId(), dto)));
    }
}
