export interface FoodItemResponse {
  id: string;
  name: string;
  category: string;
  servingUnit: string;
  servingSizeGrams: number;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  isVegetarian: boolean;
  isVegan: boolean;
  allergenTags?: string;
  isActive: boolean;
}

export interface MealItemDto {
  id: string;
  foodItem: FoodItemResponse;
  quantity: number;
  servings: number;
}

export interface MealResponse {
  id: string;
  date: string;
  mealType: string;
  mealTime?: string;
  title: string;
  notes?: string;
  isConsumed: boolean;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  items: MealItemDto[];
}

export interface MealPlanResponse {
  id: string;
  version: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  status: string;
  meals: MealResponse[];
}

export interface NutritionSummaryResponse {
  date: string;
  targetCalories: number;
  consumedCalories: number;
  targetProtein: number;
  consumedProtein: number;
  remainingProtein: number;
  targetCarbs: number;
  consumedCarbs: number;
  targetFat: number;
  consumedFat: number;
  proteinProgressPercentage: number;
  calorieProgressPercentage: number;
  waterMl: number;
  targetWaterMl: number;
}

export interface LogNutritionRequest {
  date: string;
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  waterMl?: number;
  notes?: string;
}
