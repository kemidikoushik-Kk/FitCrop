package com.fitcorp.schedule;

import com.fitcorp.common.ApiResponse;
import com.fitcorp.schedule.dto.CreateEventRequest;
import com.fitcorp.schedule.dto.ScheduleEventDto;
import com.fitcorp.schedule.dto.WorkScheduleDto;
import com.fitcorp.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Schedule", description = "Work schedule setup and interactive corporate calendar")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping("/schedule")
    @Operation(summary = "Get user weekly corporate work hours and breaks")
    public ResponseEntity<ApiResponse<List<WorkScheduleDto>>> getUserSchedule(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ApiResponse.ok(scheduleService.getUserSchedule(userPrincipal.getId())));
    }

    @PutMapping("/schedule")
    @Operation(summary = "Update user weekly corporate work hours and break windows")
    public ResponseEntity<ApiResponse<List<WorkScheduleDto>>> updateSchedule(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody List<WorkScheduleDto> schedules) {
        List<WorkScheduleDto> result = scheduleService.updateWorkSchedule(userPrincipal.getId(), schedules);
        return ResponseEntity.ok(ApiResponse.ok(result, "Work schedule updated successfully"));
    }

    @GetMapping("/calendar")
    @Operation(summary = "Get calendar events within a time range")
    public ResponseEntity<ApiResponse<List<ScheduleEventDto>>> getCalendarEvents(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant end) {
        return ResponseEntity.ok(ApiResponse.ok(scheduleService.getCalendarEvents(userPrincipal.getId(), start, end)));
    }

    @PostMapping("/calendar/events")
    @Operation(summary = "Create a new event in corporate fitness calendar")
    public ResponseEntity<ApiResponse<ScheduleEventDto>> createEvent(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateEventRequest request) {
        ScheduleEventDto created = scheduleService.createEvent(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(created, "Event created"));
    }

    @PutMapping("/calendar/events/{id}")
    @Operation(summary = "Update calendar event details or time")
    public ResponseEntity<ApiResponse<ScheduleEventDto>> updateEvent(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id,
            @Valid @RequestBody CreateEventRequest request) {
        ScheduleEventDto updated = scheduleService.updateEvent(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Event updated"));
    }

    @DeleteMapping("/calendar/events/{id}")
    @Operation(summary = "Delete an event from the calendar")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String id) {
        scheduleService.deleteEvent(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.message("Event deleted"));
    }
}
