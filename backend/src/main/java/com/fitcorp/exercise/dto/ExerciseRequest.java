package com.fitcorp.exercise.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequest {

    @NotBlank(message = "Exercise name is required")
    private String name;

    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Muscle group is required")
    private String muscleGroup;

    @NotBlank(message = "Equipment is required")
    private String equipment;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    @NotNull(message = "Calories per minute is required")
    private Double estimatedCaloriesPerMinute;

    private Integer durationDefaultSeconds;
    private Integer setsDefault;
    private Integer repsDefault;
    private Integer restSecondsDefault;
    private String instructions;
    private String safetyNotes;
    private Boolean isActive;
}
