package com.fitcorp.workout;

import com.fitcorp.exercise.Exercise;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workout_exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExercise {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_day_id", nullable = false)
    private WorkoutDay workoutDay;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder;

    @Builder.Default
    private Integer sets = 3;

    @Builder.Default
    private Integer reps = 10;

    @Builder.Default
    @Column(name = "duration_seconds")
    private Integer durationSeconds = 0;

    @Builder.Default
    @Column(name = "rest_seconds")
    private Integer restSeconds = 60;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
