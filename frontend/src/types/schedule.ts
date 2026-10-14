export interface WorkScheduleDto {
  id?: string;
  dayOfWeek: string;
  isWorkingDay: boolean;
  workStartTime?: string;
  workEndTime?: string;
  morningBreakMinutes?: number;
  lunchBreakMinutes?: number;
  eveningBreakMinutes?: number;
  preferredWorkoutWindow?: string;
}

export interface ScheduleEventDto {
  id: string;
  title: string;
  eventType: string; // WORKOUT, MEAL, REST_DAY, WORK, PERSONAL, REMINDER
  startTime: string;
  endTime: string;
  description?: string;
  isCompleted?: boolean;
  hasConflict?: boolean;
  conflictMessage?: string;
}

export interface CreateEventRequest {
  title: string;
  eventType: string;
  startTime: string;
  endTime: string;
  description?: string;
}
