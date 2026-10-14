package com.fitcorp.profile;

import com.fitcorp.exception.ResourceNotFoundException;
import com.fitcorp.profile.dto.OnboardingRequest;
import com.fitcorp.profile.dto.UpdateProfileRequest;
import com.fitcorp.profile.dto.UserProfileResponse;
import com.fitcorp.user.User;
import com.fitcorp.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(user));

        return toDto(user, profile);
    }

    @Transactional
    public UserProfileResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(user));

        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getHeightCm() != null) profile.setHeightCm(request.getHeightCm());
        if (request.getWeightKg() != null) profile.setWeightKg(request.getWeightKg());
        if (request.getFitnessLevel() != null) profile.setFitnessLevel(request.getFitnessLevel());
        if (request.getOccupation() != null) profile.setOccupation(request.getOccupation());
        if (request.getWorkingDays() != null) profile.setWorkingDays(request.getWorkingDays());
        if (request.getWorkStartTime() != null) profile.setWorkStartTime(request.getWorkStartTime());
        if (request.getWorkEndTime() != null) profile.setWorkEndTime(request.getWorkEndTime());
        if (request.getSleepSchedule() != null) profile.setSleepSchedule(request.getSleepSchedule());
        if (request.getPreferredWorkoutDays() != null) profile.setPreferredWorkoutDays(request.getPreferredWorkoutDays());
        if (request.getPreferredWorkoutTime() != null) profile.setPreferredWorkoutTime(request.getPreferredWorkoutTime());
        if (request.getAvailableWorkoutMinutes() != null) profile.setAvailableWorkoutMinutes(request.getAvailableWorkoutMinutes());
        if (request.getEquipmentAccess() != null) profile.setEquipmentAccess(request.getEquipmentAccess());
        if (request.getDietaryPreference() != null) profile.setDietaryPreference(request.getDietaryPreference());
        if (request.getFoodAllergies() != null) profile.setFoodAllergies(request.getFoodAllergies());
        if (request.getFoodDislikes() != null) profile.setFoodDislikes(request.getFoodDislikes());
        if (request.getMealPreference() != null) profile.setMealPreference(request.getMealPreference());
        if (request.getPrimaryFitnessGoal() != null) profile.setPrimaryFitnessGoal(request.getPrimaryFitnessGoal());
        if (request.getSecondaryGoal() != null) profile.setSecondaryGoal(request.getSecondaryGoal());
        if (request.getActivityLevel() != null) profile.setActivityLevel(request.getActivityLevel());
        if (request.getTimezone() != null) profile.setTimezone(request.getTimezone());

        UserProfile saved = userProfileRepository.save(profile);
        return toDto(user, saved);
    }

    @Transactional
    public UserProfileResponse completeOnboarding(String userId, OnboardingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultProfile(user));

        if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getHeightCm() != null) profile.setHeightCm(request.getHeightCm());
        if (request.getWeightKg() != null) profile.setWeightKg(request.getWeightKg());
        if (request.getOccupation() != null) profile.setOccupation(request.getOccupation());

        profile.setFitnessLevel(request.getFitnessLevel());
        profile.setPrimaryFitnessGoal(request.getPrimaryFitnessGoal());
        if (request.getSecondaryGoal() != null) profile.setSecondaryGoal(request.getSecondaryGoal());

        if (request.getWorkingDays() != null) profile.setWorkingDays(request.getWorkingDays());
        if (request.getWorkStartTime() != null) profile.setWorkStartTime(request.getWorkStartTime());
        if (request.getWorkEndTime() != null) profile.setWorkEndTime(request.getWorkEndTime());
        if (request.getPreferredWorkoutDays() != null) profile.setPreferredWorkoutDays(request.getPreferredWorkoutDays());
        if (request.getPreferredWorkoutTime() != null) profile.setPreferredWorkoutTime(request.getPreferredWorkoutTime());
        if (request.getAvailableWorkoutMinutes() != null) profile.setAvailableWorkoutMinutes(request.getAvailableWorkoutMinutes());
        if (request.getActivityLevel() != null) profile.setActivityLevel(request.getActivityLevel());

        if (request.getEquipmentAccess() != null) profile.setEquipmentAccess(request.getEquipmentAccess());
        if (request.getDietaryPreference() != null) profile.setDietaryPreference(request.getDietaryPreference());
        if (request.getMealPreference() != null) profile.setMealPreference(request.getMealPreference());
        if (request.getFoodAllergies() != null) profile.setFoodAllergies(request.getFoodAllergies());
        if (request.getFoodDislikes() != null) profile.setFoodDislikes(request.getFoodDislikes());

        user.setOnboardingCompleted(true);
        userRepository.save(user);

        UserProfile saved = userProfileRepository.save(profile);
        log.info("Onboarding completed successfully for user: {}", user.getEmail());

        return toDto(user, saved);
    }

    private UserProfile createDefaultProfile(User user) {
        UserProfile p = UserProfile.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .fitnessLevel("BEGINNER")
                .primaryFitnessGoal("GENERAL_FITNESS")
                .availableWorkoutMinutes(30)
                .equipmentAccess("NONE")
                .dietaryPreference("NO_PREFERENCE")
                .activityLevel("SEDENTARY")
                .timezone("Asia/Kolkata")
                .workingDays("MON,TUE,WED,THU,FRI")
                .build();
        return userProfileRepository.save(p);
    }

    private UserProfileResponse toDto(User user, UserProfile profile) {
        Double bmi = null;
        String bmiCategory = "Not calculated";
        if (profile.getHeightCm() != null && profile.getWeightKg() != null && profile.getHeightCm() > 0) {
            double heightM = profile.getHeightCm() / 100.0;
            bmi = Math.round((profile.getWeightKg() / (heightM * heightM)) * 10.0) / 10.0;
            if (bmi < 18.5) bmiCategory = "Underweight";
            else if (bmi < 24.9) bmiCategory = "Normal Weight";
            else if (bmi < 29.9) bmiCategory = "Overweight";
            else bmiCategory = "Obese";
        }

        int completeness = calculateCompleteness(profile);

        return UserProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .heightCm(profile.getHeightCm())
                .weightKg(profile.getWeightKg())
                .bmi(bmi)
                .bmiCategory(bmiCategory)
                .fitnessLevel(profile.getFitnessLevel())
                .occupation(profile.getOccupation())
                .workingDays(profile.getWorkingDays())
                .workStartTime(profile.getWorkStartTime())
                .workEndTime(profile.getWorkEndTime())
                .sleepSchedule(profile.getSleepSchedule())
                .preferredWorkoutDays(profile.getPreferredWorkoutDays())
                .preferredWorkoutTime(profile.getPreferredWorkoutTime())
                .availableWorkoutMinutes(profile.getAvailableWorkoutMinutes())
                .equipmentAccess(profile.getEquipmentAccess())
                .dietaryPreference(profile.getDietaryPreference())
                .foodAllergies(profile.getFoodAllergies())
                .foodDislikes(profile.getFoodDislikes())
                .mealPreference(profile.getMealPreference())
                .primaryFitnessGoal(profile.getPrimaryFitnessGoal())
                .secondaryGoal(profile.getSecondaryGoal())
                .activityLevel(profile.getActivityLevel())
                .timezone(profile.getTimezone())
                .completenessPercentage(completeness)
                .onboardingCompleted(user.getOnboardingCompleted())
                .build();
    }

    private int calculateCompleteness(UserProfile profile) {
        int fields = 10;
        int completed = 0;
        if (profile.getDateOfBirth() != null) completed++;
        if (profile.getGender() != null) completed++;
        if (profile.getHeightCm() != null) completed++;
        if (profile.getWeightKg() != null) completed++;
        if (profile.getFitnessLevel() != null) completed++;
        if (profile.getOccupation() != null) completed++;
        if (profile.getPrimaryFitnessGoal() != null) completed++;
        if (profile.getEquipmentAccess() != null) completed++;
        if (profile.getDietaryPreference() != null) completed++;
        if (profile.getAvailableWorkoutMinutes() != null) completed++;
        return (int) ((completed / (double) fields) * 100);
    }
}
