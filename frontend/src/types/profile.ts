export interface UserProfileResponse {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  bmiCategory?: string;
  fitnessLevel: string;
  occupation?: string;
  workingDays?: string;
  workStartTime?: string;
  workEndTime?: string;
  sleepSchedule?: string;
  preferredWorkoutDays?: string;
  preferredWorkoutTime?: string;
  availableWorkoutMinutes: number;
  equipmentAccess: string;
  dietaryPreference: string;
  foodAllergies?: string;
  foodDislikes?: string;
  mealPreference: string;
  primaryFitnessGoal: string;
  secondaryGoal?: string;
  activityLevel: string;
  timezone: string;
  completenessPercentage: number;
  onboardingCompleted: boolean;
}

export interface UpdateProfileRequest {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  fitnessLevel?: string;
  occupation?: string;
  workingDays?: string;
  workStartTime?: string;
  workEndTime?: string;
  sleepSchedule?: string;
  preferredWorkoutDays?: string;
  preferredWorkoutTime?: string;
  availableWorkoutMinutes?: number;
  equipmentAccess?: string;
  dietaryPreference?: string;
  foodAllergies?: string;
  foodDislikes?: string;
  mealPreference?: string;
  primaryFitnessGoal?: string;
  secondaryGoal?: string;
  activityLevel?: string;
  timezone?: string;
}

export interface OnboardingRequest {
  dateOfBirth?: string;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  occupation?: string;
  fitnessLevel: string;
  primaryFitnessGoal: string;
  secondaryGoal?: string;
  workingDays?: string;
  workStartTime?: string;
  workEndTime?: string;
  preferredWorkoutDays?: string;
  preferredWorkoutTime?: string;
  availableWorkoutMinutes: number;
  activityLevel?: string;
  equipmentAccess?: string;
  dietaryPreference?: string;
  mealPreference?: string;
  foodAllergies?: string;
  foodDislikes?: string;
}
