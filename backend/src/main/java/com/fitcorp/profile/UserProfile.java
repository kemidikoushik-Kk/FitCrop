package com.fitcorp.profile;

import com.fitcorp.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 20)
    private String gender;

    @Column(name = "height_cm")
    private Double heightCm;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Builder.Default
    @Column(name = "fitness_level", nullable = false, length = 30)
    private String fitnessLevel = "BEGINNER"; // BEGINNER, INTERMEDIATE, ADVANCED

    @Column(length = 100)
    private String occupation;

    @Builder.Default
    @Column(name = "working_days", length = 100)
    private String workingDays = "MON,TUE,WED,THU,FRI";

    @Column(name = "work_start_time")
    private LocalTime workStartTime;

    @Column(name = "work_end_time")
    private LocalTime workEndTime;

    @Column(name = "sleep_schedule", length = 50)
    private String sleepSchedule;

    @Builder.Default
    @Column(name = "preferred_workout_days", length = 100)
    private String preferredWorkoutDays = "MON,WED,FRI";

    @Builder.Default
    @Column(name = "preferred_workout_time", length = 50)
    private String preferredWorkoutTime = "MORNING"; // MORNING, LUNCH, EVENING, WEEKEND

    @Builder.Default
    @Column(name = "available_workout_minutes")
    private Integer availableWorkoutMinutes = 30;

    @Builder.Default
    @Column(name = "equipment_access", length = 50)
    private String equipmentAccess = "NONE"; // NONE, DUMBBELLS, FULL_GYM, RESISTANCE_BAND

    @Builder.Default
    @Column(name = "dietary_preference", length = 50)
    private String dietaryPreference = "NO_PREFERENCE"; // NO_PREFERENCE, VEGETARIAN, VEGAN, EGGETARIAN, HIGH_PROTEIN

    @Column(name = "food_allergies", columnDefinition = "TEXT")
    private String foodAllergies;

    @Column(name = "food_dislikes", columnDefinition = "TEXT")
    private String foodDislikes;

    @Builder.Default
    @Column(name = "meal_preference", length = 50)
    private String mealPreference = "THREE_MEALS"; // THREE_MEALS, FOUR_MEALS, FIVE_MEALS

    @Builder.Default
    @Column(name = "primary_fitness_goal", length = 50)
    private String primaryFitnessGoal = "GENERAL_FITNESS";

    @Column(name = "secondary_goal", length = 50)
    private String secondaryGoal;

    @Builder.Default
    @Column(name = "activity_level", length = 50)
    private String activityLevel = "SEDENTARY"; // SEDENTARY, LIGHTLY_ACTIVE, MODERATELY_ACTIVE, VERY_ACTIVE

    @Builder.Default
    @Column(length = 50)
    private String timezone = "Asia/Kolkata";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
