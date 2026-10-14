import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../api/notificationApi';
import { NotificationDto, NotificationPreferenceDto } from '../../types/notification';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Settings,
  Droplet,
  Dumbbell,
  Utensils,
  Sparkles,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferenceDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [savingPrefs, setSavingPrefs] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [notifsRes, prefsRes] = await Promise.all([
        notificationApi.getNotifications(),
        notificationApi.getPreferences(),
      ]);

      if (notifsRes.data) setNotifications(notifsRes.data);
      if (prefsRes.data) setPreferences(prefsRes.data);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      showToast('success', 'Marked', 'Notification marked as read.');
    } catch {
      showToast('error', 'Error', 'Failed to update notification.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      showToast('success', 'All Read', 'All notifications marked as read.');
    } catch {
      showToast('error', 'Error', 'Failed to update notifications.');
    }
  };

  const handleTogglePref = (key: keyof NotificationPreferenceDto) => {
    if (!preferences) return;
    setPreferences({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;
    try {
      setSavingPrefs(true);
      await notificationApi.updatePreferences(preferences);
      showToast('success', 'Preferences Saved', 'Reminder settings updated.');
    } catch {
      showToast('error', 'Error', 'Failed to save reminder preferences.');
    } finally {
      setSavingPrefs(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const displayedNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Notifications & Corporate Reminders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Stay on track with intelligent micro-reminders for desk workouts, water intake, and scheduled meals.
          </p>
        </div>

        {notifications.some((n) => !n.isRead) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            leftIcon={<CheckCheck className="w-4 h-4 text-brand-500" />}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Stream (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-corporate-800 pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'unread'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Unread ({notifications.filter((n) => !n.isRead).length})
            </button>
          </div>

          {displayedNotifications.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-dashed border-slate-200 dark:border-corporate-800 text-slate-400 text-xs">
              No notifications to display.
            </div>
          ) : (
            <div className="space-y-3">
              {displayedNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    !notif.isRead
                      ? 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-200 dark:border-brand-900'
                      : 'bg-white dark:bg-corporate-900 border-slate-200 dark:border-corporate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-corporate-800 text-slate-600 dark:text-slate-300 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                          <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!notif.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="text-xs text-brand-600 dark:text-brand-400"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reminder Preferences (1 col) */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Settings className="w-4 h-4 text-brand-500" />
                Reminder Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {preferences && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Workout Alerts
                      </p>
                      <p className="text-slate-500 text-[11px]">Notify before session</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.workoutReminders}
                      onChange={() => handleTogglePref('workoutReminders')}
                      className="rounded border-slate-300 text-brand-600 h-4 w-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Meal Timing Alerts
                      </p>
                      <p className="text-slate-500 text-[11px]">Lunch & dinner nudges</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.mealReminders}
                      onChange={() => handleTogglePref('mealReminders')}
                      className="rounded border-slate-300 text-brand-600 h-4 w-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Hydration Nudges
                      </p>
                      <p className="text-slate-500 text-[11px]">Hourly water reminders</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.waterReminders}
                      onChange={() => handleTogglePref('waterReminders')}
                      className="rounded border-slate-300 text-brand-600 h-4 w-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        Weekly Digest
                      </p>
                      <p className="text-slate-500 text-[11px]">Sunday consistency recap</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.weeklyProgressReminders}
                      onChange={() => handleTogglePref('weeklyProgressReminders')}
                      className="rounded border-slate-300 text-brand-600 h-4 w-4"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={handleSavePreferences}
                      isLoading={savingPrefs}
                    >
                      Save Preferences
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
