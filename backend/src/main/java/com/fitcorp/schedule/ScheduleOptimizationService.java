package com.fitcorp.schedule;

import com.fitcorp.schedule.dto.ScheduleEventDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleOptimizationService {

    private final WorkScheduleRepository workScheduleRepository;

    public void evaluateConflict(String userId, ScheduleEventDto eventDto, String userTimezone) {
        ZoneId zone = ZoneId.of(userTimezone != null ? userTimezone : "Asia/Kolkata");
        ZonedDateTime start = eventDto.getStartTime().atZone(zone);
        ZonedDateTime end = eventDto.getEndTime().atZone(zone);

        DayOfWeek dow = start.getDayOfWeek();
        Optional<WorkSchedule> scheduleOpt = workScheduleRepository.findByUserIdAndDayOfWeek(userId, dow.name());

        if (scheduleOpt.isEmpty()) {
            eventDto.setHasConflict(false);
            return;
        }

        WorkSchedule ws = scheduleOpt.get();
        if (!ws.getIsWorkingDay() || ws.getWorkStartTime() == null || ws.getWorkEndTime() == null) {
            eventDto.setHasConflict(false);
            return;
        }

        LocalTime eventStartTime = start.toLocalTime();
        LocalTime eventEndTime = end.toLocalTime();
        LocalTime workStart = ws.getWorkStartTime();
        LocalTime workEnd = ws.getWorkEndTime();

        // Check if event falls during work hours
        boolean overlapsWork = !(eventEndTime.isBefore(workStart) || eventStartTime.isAfter(workEnd));

        if (overlapsWork && "WORKOUT".equalsIgnoreCase(eventDto.getEventType())) {
            // Check if lunch break permits workout
            LocalTime lunchStart = LocalTime.of(13, 0);
            LocalTime lunchEnd = lunchStart.plusMinutes(ws.getLunchBreakMinutes() != null ? ws.getLunchBreakMinutes() : 60);

            boolean withinLunch = !eventStartTime.isBefore(lunchStart) && !eventEndTime.isAfter(lunchEnd);
            if (withinLunch && ws.getLunchBreakMinutes() >= 45) {
                eventDto.setHasConflict(false);
                eventDto.setConflictMessage("Scheduled during official lunch break (" + ws.getLunchBreakMinutes() + " mins)");
            } else {
                eventDto.setHasConflict(true);
                eventDto.setConflictMessage("Conflict: Workout overlaps with working hours (" + workStart + " - " + workEnd + ")");
            }
        } else {
            eventDto.setHasConflict(false);
        }
    }
}
