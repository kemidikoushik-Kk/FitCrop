package com.fitcorp.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OnboardingRequest {

    // Step 1: Personal Info
    private LocalDate dateOfBirth;
    private String gender;
    private Double heightCm;
    private Double weightKg;
    private String occupation;

    // Step 2: Fitness Level
    @NotBlank(message = "Fitness level is required")
    private String fitnessLevel; // BEGINNER, INTERMEDIATE, ADVANCED

    // Step 3: Goal Selection
    @NotBlank(message = "Primary fitness goal is required")
    private String primaryFitnessGoal;
    private String secondaryGoal;

    // Step 4: Schedule & Availability
    private String workingDays;
    private LocalTime workStartTime;
    private LocalTime workEndTime;
    private String preferredWorkoutDays;
    private String preferredWorkoutTime;
    @NotNull(message = "Workout duration is required")
    private Integer availableWorkoutMinutes;
    private String activityLevel;

    // Step 5: Equipment
    private String equipmentAccess;

    // Step 6 & 7: Diet & Allergies
    private String dietaryPreference;
    private String mealPreference;
    private String foodAllergies;
    private String foodDislikes;
}
