export interface ProgressSummaryResponse {
  currentStreak: number;
  longestStreak: number;
  totalWorkoutsCompleted: number;
  workoutsCompletedThisWeek: number;
  targetWorkoutsThisWeek: number;
  consistencyPercentage: number;
  currentWeight?: number;
  startingWeight?: number;
  weightChange?: number;
  totalMealsLogged: number;
}

export interface WeightPoint {
  date: string;
  weight: number;
}

export interface ConsistencyBar {
  dayOfWeek: string;
  date: string;
  completed: number;
  target: number;
}

export interface NutritionPoint {
  date: string;
  consumedProtein: number;
  targetProtein: number;
  consumedCalories: number;
  targetCalories: number;
}

export interface ProgressChartsResponse {
  weightTrend: WeightPoint[];
  workoutConsistency: ConsistencyBar[];
  nutritionConsistency: NutritionPoint[];
}

export interface ProgressEntryDto {
  id?: string;
  date: string;
  weightKg?: number;
  workoutsCompleted?: number;
  mealsLogged?: number;
  waterMl?: number;
  notes?: string;
}

export interface BodyMeasurementDto {
  id?: string;
  date: string;
  weightKg?: number;
  bodyFatPercentage?: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armsCm?: number;
  thighsCm?: number;
  notes?: string;
}
