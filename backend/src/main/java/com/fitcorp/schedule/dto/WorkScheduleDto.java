package com.fitcorp.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkScheduleDto {
    private String id;
    private String dayOfWeek;
    private Boolean isWorkingDay;
    private LocalTime workStartTime;
    private LocalTime workEndTime;
    private Integer morningBreakMinutes;
    private Integer lunchBreakMinutes;
    private Integer eveningBreakMinutes;
    private String preferredWorkoutWindow;
}
