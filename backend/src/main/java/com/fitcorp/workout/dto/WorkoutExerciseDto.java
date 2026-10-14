package com.fitcorp.workout.dto;

import com.fitcorp.exercise.dto.ExerciseResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutExerciseDto {
    private String id;
    private ExerciseResponse exercise;
    private Integer sequenceOrder;
    private Integer sets;
    private Integer reps;
    private Integer durationSeconds;
    private Integer restSeconds;
    private String notes;
}
