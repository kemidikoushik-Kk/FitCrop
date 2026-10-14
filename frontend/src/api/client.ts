import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fitcorp_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh & Friendly Error Normalization
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response.data, // Unwraps backend ApiResponse
  async (error: AxiosError<{ message?: string; error?: { message?: string; details?: string[] } }>) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    // If 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(extractErrorMessage(error));
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('fitcorp_refresh_token');
      if (!refreshToken) {
        localStorage.removeItem('fitcorp_access_token');
        localStorage.removeItem('fitcorp_refresh_token');
        localStorage.removeItem('fitcorp_user');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;

        localStorage.setItem('fitcorp_access_token', newAccessToken);
        localStorage.setItem('fitcorp_refresh_token', newRefreshToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshErr) {
        processQueue(new Error('Failed to refresh token'), null);
        localStorage.removeItem('fitcorp_access_token');
        localStorage.removeItem('fitcorp_refresh_token');
        localStorage.removeItem('fitcorp_user');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please log in again.'));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(extractErrorMessage(error));
  }
);

function extractErrorMessage(error: AxiosError<{ message?: string; error?: { message?: string; details?: string[] } }>): Error {
  const data = error.response?.data;
  if (data?.error?.details && data.error.details.length > 0) {
    return new Error(data.error.details.join(', '));
  }
  if (data?.error?.message) {
    return new Error(data.error.message);
  }
  if (data?.message) {
    return new Error(data.message);
  }
  if (error.response?.status === 403) {
    return new Error("You don't have permission to perform this action.");
  }
  if (error.response?.status === 404) {
    return new Error('Requested resource not found.');
  }
  if (error.response?.status === 409) {
    return new Error('Conflict: Record already exists.');
  }
  if (error.code === 'ERR_NETWORK') {
    return new Error('Unable to connect to FitCorp. Please check your internet connection.');
  }
  return new Error(error.message || 'Something went wrong. Please try again.');
}
