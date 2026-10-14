import { apiClient } from './client';
import { CreateEventRequest, ScheduleEventDto, WorkScheduleDto } from '../types/schedule';

export const scheduleApi = {
  getSchedule: (): Promise<{ success: boolean; data: WorkScheduleDto[] }> =>
    apiClient.get('/schedule'),

  updateSchedule: (data: WorkScheduleDto[]): Promise<{ success: boolean; data: WorkScheduleDto[]; message?: string }> =>
    apiClient.put('/schedule', data),

  getCalendarEvents: (params?: { start?: string; end?: string }): Promise<{ success: boolean; data: ScheduleEventDto[] }> =>
    apiClient.get('/calendar', { params }),

  createEvent: (data: CreateEventRequest): Promise<{ success: boolean; data: ScheduleEventDto; message?: string }> =>
    apiClient.post('/calendar/events', data),

  updateEvent: (id: string, data: CreateEventRequest): Promise<{ success: boolean; data: ScheduleEventDto; message?: string }> =>
    apiClient.put(`/calendar/events/${id}`, data),

  deleteEvent: (id: string): Promise<{ success: boolean; message?: string }> =>
    apiClient.delete(`/calendar/events/${id}`),
};
