package com.fitcorp.schedule;

import com.fitcorp.exception.ResourceNotFoundException;
import com.fitcorp.exception.UnauthorizedException;
import com.fitcorp.profile.UserProfile;
import com.fitcorp.profile.UserProfileRepository;
import com.fitcorp.schedule.dto.CreateEventRequest;
import com.fitcorp.schedule.dto.ScheduleEventDto;
import com.fitcorp.schedule.dto.WorkScheduleDto;
import com.fitcorp.user.User;
import com.fitcorp.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final WorkScheduleRepository workScheduleRepository;
    private final ScheduleEventRepository scheduleEventRepository;
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final ScheduleOptimizationService optimizationService;

    @Transactional(readOnly = true)
    public List<WorkScheduleDto> getUserSchedule(String userId) {
        List<WorkSchedule> list = workScheduleRepository.findByUserId(userId);
        if (list.isEmpty()) {
            return initializeDefaultSchedule(userId);
        }
        return list.stream().map(this::toScheduleDto).collect(Collectors.toList());
    }

    @Transactional
    public List<WorkScheduleDto> updateWorkSchedule(String userId, List<WorkScheduleDto> dtos) {
        User user = userRepository.findById(userId).orElseThrow();
        workScheduleRepository.deleteByUserId(userId);

        List<WorkSchedule> entities = new ArrayList<>();
        for (WorkScheduleDto dto : dtos) {
            entities.add(WorkSchedule.builder()
                    .id(UUID.randomUUID().toString())
                    .user(user)
                    .dayOfWeek(dto.getDayOfWeek().toUpperCase())
                    .isWorkingDay(dto.getIsWorkingDay() != null ? dto.getIsWorkingDay() : true)
                    .workStartTime(dto.getWorkStartTime() != null ? dto.getWorkStartTime() : LocalTime.of(9, 0))
                    .workEndTime(dto.getWorkEndTime() != null ? dto.getWorkEndTime() : LocalTime.of(18, 0))
                    .morningBreakMinutes(dto.getMorningBreakMinutes() != null ? dto.getMorningBreakMinutes() : 15)
                    .lunchBreakMinutes(dto.getLunchBreakMinutes() != null ? dto.getLunchBreakMinutes() : 60)
                    .eveningBreakMinutes(dto.getEveningBreakMinutes() != null ? dto.getEveningBreakMinutes() : 15)
                    .preferredWorkoutWindow(dto.getPreferredWorkoutWindow() != null ? dto.getPreferredWorkoutWindow() : "EVENING")
                    .build());
        }

        List<WorkSchedule> saved = workScheduleRepository.saveAll(entities);
        return saved.stream().map(this::toScheduleDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScheduleEventDto> getCalendarEvents(String userId, Instant start, Instant end) {
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        String tz = profile != null ? profile.getTimezone() : "Asia/Kolkata";

        List<ScheduleEvent> events;
        if (start != null && end != null) {
            events = scheduleEventRepository.findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(userId, start, end);
        } else {
            events = scheduleEventRepository.findByUserIdOrderByStartTimeAsc(userId);
        }

        return events.stream().map(e -> {
            ScheduleEventDto dto = toEventDto(e);
            optimizationService.evaluateConflict(userId, dto, tz);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public ScheduleEventDto createEvent(String userId, CreateEventRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        String tz = profile != null ? profile.getTimezone() : "Asia/Kolkata";

        ScheduleEvent event = ScheduleEvent.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .title(request.getTitle())
                .eventType(request.getEventType())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .description(request.getDescription())
                .isCompleted(false)
                .build();

        ScheduleEvent saved = scheduleEventRepository.save(event);
        ScheduleEventDto dto = toEventDto(saved);
        optimizationService.evaluateConflict(userId, dto, tz);
        return dto;
    }

    @Transactional
    public ScheduleEventDto updateEvent(String userId, String eventId, CreateEventRequest request) {
        ScheduleEvent event = scheduleEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to modify this event");
        }

        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        String tz = profile != null ? profile.getTimezone() : "Asia/Kolkata";

        event.setTitle(request.getTitle());
        event.setEventType(request.getEventType());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setDescription(request.getDescription());

        ScheduleEvent updated = scheduleEventRepository.save(event);
        ScheduleEventDto dto = toEventDto(updated);
        optimizationService.evaluateConflict(userId, dto, tz);
        return dto;
    }

    @Transactional
    public void deleteEvent(String userId, String eventId) {
        ScheduleEvent event = scheduleEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to delete this event");
        }

        scheduleEventRepository.delete(event);
    }

    private List<WorkScheduleDto> initializeDefaultSchedule(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<String> days = List.of("MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY");
        List<WorkSchedule> defaults = new ArrayList<>();

        for (String day : days) {
            boolean isWork = !day.equals("SATURDAY") && !day.equals("SUNDAY");
            defaults.add(WorkSchedule.builder()
                    .id(UUID.randomUUID().toString())
                    .user(user)
                    .dayOfWeek(day)
                    .isWorkingDay(isWork)
                    .workStartTime(isWork ? LocalTime.of(9, 0) : LocalTime.of(0, 0))
                    .workEndTime(isWork ? LocalTime.of(18, 0) : LocalTime.of(0, 0))
                    .morningBreakMinutes(isWork ? 15 : 0)
                    .lunchBreakMinutes(isWork ? 60 : 0)
                    .eveningBreakMinutes(isWork ? 15 : 0)
                    .preferredWorkoutWindow(isWork ? "EVENING" : "MORNING")
                    .build());
        }

        List<WorkSchedule> saved = workScheduleRepository.saveAll(defaults);
        return saved.stream().map(this::toScheduleDto).collect(Collectors.toList());
    }

    private WorkScheduleDto toScheduleDto(WorkSchedule ws) {
        return WorkScheduleDto.builder()
                .id(ws.getId())
                .dayOfWeek(ws.getDayOfWeek())
                .isWorkingDay(ws.getIsWorkingDay())
                .workStartTime(ws.getWorkStartTime())
                .workEndTime(ws.getWorkEndTime())
                .morningBreakMinutes(ws.getMorningBreakMinutes())
                .lunchBreakMinutes(ws.getLunchBreakMinutes())
                .eveningBreakMinutes(ws.getEveningBreakMinutes())
                .preferredWorkoutWindow(ws.getPreferredWorkoutWindow())
                .build();
    }

    private ScheduleEventDto toEventDto(ScheduleEvent e) {
        return ScheduleEventDto.builder()
                .id(e.getId())
                .title(e.getTitle())
                .eventType(e.getEventType())
                .startTime(e.getStartTime())
                .endTime(e.getEndTime())
                .description(e.getDescription())
                .isCompleted(e.getIsCompleted())
                .build();
    }
}
