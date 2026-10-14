export interface ExerciseResponse {
  id: string;
  name: string;
  description?: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  estimatedCaloriesPerMinute: number;
  durationDefaultSeconds: number;
  setsDefault: number;
  repsDefault: number;
  restSecondsDefault: number;
  instructions?: string;
  safetyNotes?: string;
  isActive: boolean;
}

export interface WorkoutExerciseDto {
  id: string;
  exercise: ExerciseResponse;
  sequenceOrder: number;
  sets: number;
  reps: number;
  durationSeconds: number;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutDayResponse {
  id: string;
  date: string;
  dayOfWeek: string;
  title: string;
  dayType: string;
  estimatedDurationMinutes: number;
  status: string; // SCHEDULED, IN_PROGRESS, COMPLETED, SKIPPED
  exercises: WorkoutExerciseDto[];
}

export interface WorkoutPlanResponse {
  id: string;
  name: string;
  version: number;
  goal: string;
  startDate: string;
  endDate: string;
  status: string;
  days: WorkoutDayResponse[];
}

export interface CompleteWorkoutRequest {
  workoutDayId?: string;
  durationSeconds?: number;
  notes?: string;
  exercises?: {
    exerciseId: string;
    setsCompleted?: number;
    repsCompleted?: number;
    weightKg?: number;
    isCompleted?: boolean;
    notes?: string;
  }[];
}

export interface WorkoutLogResponse {
  id: string;
  workoutDayId?: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  status: string;
  notes?: string;
  exercisesCompletedCount: number;
}
