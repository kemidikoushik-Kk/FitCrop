package com.fitcorp.workout;

import com.fitcorp.exercise.Exercise;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "exercise_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseLog {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_log_id", nullable = false)
    private WorkoutLog workoutLog;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Builder.Default
    @Column(name = "sets_completed")
    private Integer setsCompleted = 0;

    @Builder.Default
    @Column(name = "reps_completed")
    private Integer repsCompleted = 0;

    @Builder.Default
    @Column(name = "weight_kg")
    private Double weightKg = 0.0;

    @Builder.Default
    @Column(name = "is_completed")
    private Boolean isCompleted = true;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
