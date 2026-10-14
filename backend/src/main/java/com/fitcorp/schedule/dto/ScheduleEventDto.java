package com.fitcorp.schedule.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleEventDto {
    private String id;
    private String title;
    private String eventType;
    private Instant startTime;
    private Instant endTime;
    private String description;
    private Boolean isCompleted;
    private Boolean hasConflict;
    private String conflictMessage;
}
