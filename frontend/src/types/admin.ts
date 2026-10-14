export interface AdminStatsResponse {
  totalUsers: number;
  activeUsers: number;
  totalWorkoutsCompleted: number;
  totalPlansGenerated: number;
  totalMealPlansGenerated: number;
  totalExercises: number;
  totalFoods: number;
}

export interface AdminUserDto {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  roles: string[];
  createdAt: string;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

export interface UpdateUserRoleRequest {
  roles: string[];
}
