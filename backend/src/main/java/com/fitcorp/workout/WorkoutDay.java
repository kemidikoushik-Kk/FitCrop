package com.fitcorp.workout;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_days")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutDay {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_plan_id", nullable = false)
    private WorkoutPlan workoutPlan;

    private LocalDate date;

    @Column(name = "day_of_week", nullable = false, length = 20)
    private String dayOfWeek;

    @Column(nullable = false, length = 100)
    private String title;

    @Builder.Default
    @Column(name = "day_type", length = 30)
    private String dayType = "WORKOUT_DAY"; // WORKOUT_DAY, REST_DAY, MOBILITY_DAY, OPTIONAL_ACTIVITY

    @Builder.Default
    @Column(name = "estimated_duration_minutes")
    private Integer estimatedDurationMinutes = 30;

    @Builder.Default
    @Column(length = 30)
    private String status = "SCHEDULED"; // SCHEDULED, IN_PROGRESS, COMPLETED, SKIPPED

    @Builder.Default
    @OneToMany(mappedBy = "workoutDay", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceOrder ASC")
    private List<WorkoutExercise> workoutExercises = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
