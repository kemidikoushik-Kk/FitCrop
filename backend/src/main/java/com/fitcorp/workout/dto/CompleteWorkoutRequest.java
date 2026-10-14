package com.fitcorp.workout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompleteWorkoutRequest {

    private String workoutDayId;
    private Integer durationSeconds;
    private String notes;
    private List<ExerciseLogEntryDto> exercises;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExerciseLogEntryDto {
        private String exerciseId;
        private Integer setsCompleted;
        private Integer repsCompleted;
        private Double weightKg;
        private Boolean isCompleted;
        private String notes;
    }
}
