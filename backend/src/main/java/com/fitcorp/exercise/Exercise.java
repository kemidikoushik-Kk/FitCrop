package com.fitcorp.exercise;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category; // STRENGTH, CARDIO, MOBILITY, FLEXIBILITY, CORE, FULL_BODY, RECOVERY

    @Column(name = "muscle_group", nullable = false, length = 50)
    private String muscleGroup; // CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, LEGS, GLUTES, CORE, FULL_BODY

    @Column(nullable = false, length = 50)
    private String equipment; // NONE, DUMBBELLS, BARBELL, BENCH, RESISTANCE_BAND, CABLE_MACHINE, MACHINE, KETTLEBELL, TREADMILL, BIKE, OTHER

    @Column(nullable = false, length = 30)
    private String difficulty; // BEGINNER, INTERMEDIATE, ADVANCED

    @Builder.Default
    @Column(name = "estimated_calories_per_minute")
    private Double estimatedCaloriesPerMinute = 5.0;

    @Builder.Default
    @Column(name = "duration_default_seconds")
    private Integer durationDefaultSeconds = 60;

    @Builder.Default
    @Column(name = "sets_default")
    private Integer setsDefault = 3;

    @Builder.Default
    @Column(name = "reps_default")
    private Integer repsDefault = 10;

    @Builder.Default
    @Column(name = "rest_seconds_default")
    private Integer restSecondsDefault = 60;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "safety_notes", columnDefinition = "TEXT")
    private String safetyNotes;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
