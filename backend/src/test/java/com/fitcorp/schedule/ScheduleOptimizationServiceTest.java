package com.fitcorp.schedule;

import com.fitcorp.schedule.dto.ScheduleEventDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ScheduleOptimizationServiceTest {

    @Mock
    private WorkScheduleRepository workScheduleRepository;

    @InjectMocks
    private ScheduleOptimizationService scheduleOptimizationService;

    @Test
    @DisplayName("Workout scheduled inside standard work hours triggers conflict flag")
    void shouldDetectWorkHoursConflict() {
        WorkSchedule mondaySchedule = WorkSchedule.builder()
                .dayOfWeek("MONDAY")
                .isWorkingDay(true)
                .workStartTime(LocalTime.of(9, 0))
                .workEndTime(LocalTime.of(18, 0))
                .lunchBreakMinutes(60)
                .build();

        when(workScheduleRepository.findByUserIdAndDayOfWeek("user-1", "MONDAY"))
                .thenReturn(Optional.of(mondaySchedule));

        // 2026-10-12 is a Monday. 10:00 to 10:45 AM IST is 04:30 to 05:15 UTC
        Instant start = Instant.parse("2026-10-12T04:30:00Z");
        Instant end = Instant.parse("2026-10-12T05:15:00Z");

        ScheduleEventDto event = ScheduleEventDto.builder()
                .title("Mid-Morning Workout")
                .eventType("WORKOUT")
                .startTime(start)
                .endTime(end)
                .build();

        scheduleOptimizationService.evaluateConflict("user-1", event, "Asia/Kolkata");

        assertTrue(event.getHasConflict());
        assertNotNull(event.getConflictMessage());
    }

    @Test
    @DisplayName("Workout scheduled outside work hours does not trigger conflict")
    void shouldNotDetectConflictOutsideWorkHours() {
        WorkSchedule mondaySchedule = WorkSchedule.builder()
                .dayOfWeek("MONDAY")
                .isWorkingDay(true)
                .workStartTime(LocalTime.of(9, 0))
                .workEndTime(LocalTime.of(18, 0))
                .lunchBreakMinutes(60)
                .build();

        when(workScheduleRepository.findByUserIdAndDayOfWeek("user-1", "MONDAY"))
                .thenReturn(Optional.of(mondaySchedule));

        // 07:00 to 07:45 AM IST is 01:30 to 02:15 UTC
        Instant start = Instant.parse("2026-10-12T01:30:00Z");
        Instant end = Instant.parse("2026-10-12T02:15:00Z");

        ScheduleEventDto event = ScheduleEventDto.builder()
                .title("Early Morning Session")
                .eventType("WORKOUT")
                .startTime(start)
                .endTime(end)
                .build();

        scheduleOptimizationService.evaluateConflict("user-1", event, "Asia/Kolkata");

        assertFalse(event.getHasConflict());
    }
}
