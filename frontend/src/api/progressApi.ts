import { apiClient } from './client';
import {
  BodyMeasurementDto,
  ProgressChartsResponse,
  ProgressEntryDto,
  ProgressSummaryResponse,
} from '../types/progress';

export const progressApi = {
  getSummary: (): Promise<{ success: boolean; data: ProgressSummaryResponse }> =>
    apiClient.get('/progress/summary'),

  getCharts: (): Promise<{ success: boolean; data: ProgressChartsResponse }> =>
    apiClient.get('/progress/charts'),

  recordProgress: (data: ProgressEntryDto): Promise<{ success: boolean; data: ProgressEntryDto; message?: string }> =>
    apiClient.post('/progress', data),

  recordMeasurement: (data: BodyMeasurementDto): Promise<{ success: boolean; data: BodyMeasurementDto; message?: string }> =>
    apiClient.post('/progress/measurements', data),
};
