package com.fitcorp.profile.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class UpdateProfileRequest {

    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;

    @Min(value = 50, message = "Height must be at least 50 cm")
    @Max(value = 260, message = "Height must be at most 260 cm")
    private Double heightCm;

    @Min(value = 30, message = "Weight must be at least 30 kg")
    @Max(value = 300, message = "Weight must be at most 300 kg")
    private Double weightKg;

    private String fitnessLevel;
    private String occupation;
    private String workingDays;
    private LocalTime workStartTime;
    private LocalTime workEndTime;
    private String sleepSchedule;
    private String preferredWorkoutDays;
    private String preferredWorkoutTime;

    @Min(value = 10, message = "Workout duration must be at least 10 minutes")
    @Max(value = 180, message = "Workout duration must not exceed 180 minutes")
    private Integer availableWorkoutMinutes;

    private String equipmentAccess;
    private String dietaryPreference;
    private String foodAllergies;
    private String foodDislikes;
    private String mealPreference;
    private String primaryFitnessGoal;
    private String secondaryGoal;
    private String activityLevel;
    private String timezone;
}
