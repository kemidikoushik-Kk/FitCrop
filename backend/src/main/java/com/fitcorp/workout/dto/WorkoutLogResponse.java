package com.fitcorp.workout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutLogResponse {
    private String id;
    private String workoutDayId;
    private Instant startedAt;
    private Instant completedAt;
    private Integer durationSeconds;
    private String status;
    private String notes;
    private int exercisesCompletedCount;
    private List<LoggedExerciseDto> exercises;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoggedExerciseDto {
        private String exerciseId;
        private String exerciseName;
        private Integer setsCompleted;
        private Integer repsCompleted;
        private Double weightKg;
        private Boolean isCompleted;
        private String notes;
    }
}
