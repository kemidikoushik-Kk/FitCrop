package com.fitcorp.profile.dto;

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
public class UserProfileResponse {

    private String id;
    private String userId;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private String gender;
    private Double heightCm;
    private Double weightKg;
    private Double bmi;
    private String bmiCategory;
    private String fitnessLevel;
    private String occupation;
    private String workingDays;
    private LocalTime workStartTime;
    private LocalTime workEndTime;
    private String sleepSchedule;
    private String preferredWorkoutDays;
    private String preferredWorkoutTime;
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
    private int completenessPercentage;
    private boolean onboardingCompleted;
}
