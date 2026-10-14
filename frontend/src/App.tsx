import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OnboardingWizard } from './pages/onboarding/OnboardingWizard';

// App Feature Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { WorkoutsPage } from './pages/workouts/WorkoutsPage';
import { NutritionPage } from './pages/nutrition/NutritionPage';
import { SchedulePage } from './pages/schedule/SchedulePage';
import { ProgressPage } from './pages/progress/ProgressPage';
import { ProfileSettingsPage } from './pages/profile/ProfileSettingsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminExercisesPage } from './pages/admin/AdminExercisesPage';
import { AdminFoodsPage } from './pages/admin/AdminFoodsPage';

// Static / Legal Pages
import { DisclaimerPage } from './pages/legal/DisclaimerPage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Landing & Legal */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/disclaimer" element={<DisclaimerPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />

                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* Onboarding Wizard */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute allowIncompleteOnboarding>
                      <OnboardingWizard />
                    </ProtectedRoute>
                  }
                />

                {/* Authenticated Workspace Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/workouts" element={<WorkoutsPage />} />
                  <Route path="/nutrition" element={<NutritionPage />} />
                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/settings" element={<ProfileSettingsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />

                  {/* Admin Console */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboardPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute>
                        <AdminUsersPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/exercises"
                    element={
                      <AdminRoute>
                        <AdminExercisesPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/foods"
                    element={
                      <AdminRoute>
                        <AdminFoodsPage />
                      </AdminRoute>
                    }
                  />
                </Route>

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
