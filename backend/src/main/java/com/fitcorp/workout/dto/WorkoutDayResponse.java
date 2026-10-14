package com.fitcorp.workout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutDayResponse {
    private String id;
    private LocalDate date;
    private String dayOfWeek;
    private String title;
    private String dayType;
    private Integer estimatedDurationMinutes;
    private String status;
    private List<WorkoutExerciseDto> exercises;
}
