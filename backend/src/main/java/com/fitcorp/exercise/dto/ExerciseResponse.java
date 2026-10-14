package com.fitcorp.exercise.dto;

import com.fitcorp.exercise.Exercise;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseResponse {

    private String id;
    private String name;
    private String description;
    private String category;
    private String muscleGroup;
    private String equipment;
    private String difficulty;
    private Double estimatedCaloriesPerMinute;
    private Integer durationDefaultSeconds;
    private Integer setsDefault;
    private Integer repsDefault;
    private Integer restSecondsDefault;
    private String instructions;
    private String safetyNotes;
    private Boolean isActive;

    public static ExerciseResponse from(Exercise exercise) {
        return ExerciseResponse.builder()
                .id(exercise.getId())
                .name(exercise.getName())
                .description(exercise.getDescription())
                .category(exercise.getCategory())
                .muscleGroup(exercise.getMuscleGroup())
                .equipment(exercise.getEquipment())
                .difficulty(exercise.getDifficulty())
                .estimatedCaloriesPerMinute(exercise.getEstimatedCaloriesPerMinute())
                .durationDefaultSeconds(exercise.getDurationDefaultSeconds())
                .setsDefault(exercise.getSetsDefault())
                .repsDefault(exercise.getRepsDefault())
                .restSecondsDefault(exercise.getRestSecondsDefault())
                .instructions(exercise.getInstructions())
                .safetyNotes(exercise.getSafetyNotes())
                .isActive(exercise.getIsActive())
                .build();
    }
}
