import React, { useState, useEffect } from 'react';
import { scheduleApi } from '../../api/scheduleApi';
import { WorkScheduleDto, ScheduleEventDto, CreateEventRequest } from '../../types/schedule';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  CalendarDays,
  Plus,
  Clock,
  Briefcase,
  Dumbbell,
  AlertTriangle,
  Trash2,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const { showToast } = useToast();

  const [schedules, setSchedules] = useState<WorkScheduleDto[]>([]);
  const [events, setEvents] = useState<ScheduleEventDto[]>([]);
  const [loading, setLoading] = useState(true);

  // New event modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('WORK');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedRes, eventsRes] = await Promise.all([
        scheduleApi.getSchedule(),
        scheduleApi.getCalendarEvents(),
      ]);

      if (schedRes.data) setSchedules(schedRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !startTime || !endTime) {
      showToast('warning', 'Notice', 'Please provide event title and times.');
      return;
    }

    try {
      setCreating(true);
      const payload: CreateEventRequest = {
        title: eventTitle,
        eventType,
        startTime,
        endTime,
        description: description || undefined,
      };

      const res = await scheduleApi.createEvent(payload);
      if (res.data) {
        setEvents((prev) => [...prev, res.data]);
        showToast('success', 'Event Created', 'Calendar event synced.');
        setIsModalOpen(false);
        setEventTitle('');
        setDescription('');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create event.';
      showToast('error', 'Error', msg);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await scheduleApi.deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      showToast('success', 'Removed', 'Event removed from calendar.');
    } catch {
      showToast('error', 'Error', 'Failed to delete event.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const conflictingEvents = events.filter((e) => e.hasConflict);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Corporate Schedule & Calendar
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Intelligent work-hour integration to synchronize workouts and eliminate meeting conflicts.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Calendar Event
        </Button>
      </div>

      {/* Conflict Alert Banner if any conflicts detected */}
      {conflictingEvents.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="block font-semibold">
              Workday Conflict Detected ({conflictingEvents.length})
            </strong>
            <p>
              Your corporate meeting schedule overlaps with your scheduled workout window. FitCorp recommends shifting your workout to the evening or lunch window.
            </p>
          </div>
        </div>
      )}

      {/* Smart Recommendations Card */}
      <Card className="bg-gradient-to-r from-brand-500/10 via-transparent to-blue-500/10 border-brand-500/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-600 dark:text-brand-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                FitCorp Schedule Optimizer Recommendation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Based on your core hours (09:00 - 18:00), your prime cortisol and energy window for strength training is <strong>18:30 - 19:30</strong>. On high-meeting days, express 30-min lunch workouts maintain consistency without schedule burnout.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid: Events Timeline + Working Hours Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Timeline (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-brand-500" />
              Corporate Calendar & Workout Windows
            </h2>
            <span className="text-xs text-slate-500">{events.length} Events Logged</span>
          </div>

          {events.length === 0 ? (
            <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-corporate-800 text-xs text-slate-400">
              No meetings or events scheduled for today.
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => {
                const isWorkout = event.eventType === 'WORKOUT';
                const isWork = event.eventType === 'WORK';

                return (
                  <div
                    key={event.id}
                    className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                      event.hasConflict
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                        : isWorkout
                        ? 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-200 dark:border-brand-900'
                        : 'bg-white dark:bg-corporate-900 border-slate-200 dark:border-corporate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg mt-0.5 ${
                          isWorkout
                            ? 'bg-brand-500/20 text-brand-600'
                            : isWork
                            ? 'bg-blue-500/20 text-blue-600'
                            : 'bg-purple-500/20 text-purple-600'
                        }`}
                      >
                        {isWorkout ? (
                          <Dumbbell className="w-4 h-4" />
                        ) : (
                          <Briefcase className="w-4 h-4" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                            {event.title}
                          </h4>
                          <Badge
                            variant={isWorkout ? 'brand' : isWork ? 'info' : 'neutral'}
                            size="sm"
                          >
                            {event.eventType}
                          </Badge>
                          {event.hasConflict && (
                            <Badge variant="danger" size="sm">
                              Conflict
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>

                        {event.conflictMessage && (
                          <p className="text-xs text-rose-500 font-medium pt-1">
                            {event.conflictMessage}
                          </p>
                        )}
                        {event.description && (
                          <p className="text-xs text-slate-500 pt-0.5">{event.description}</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                      aria-label="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Working Hours Snapshot (1 col) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Work Week Pattern
          </h2>

          <Card>
            <CardContent className="p-4 space-y-3 text-xs">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                (day) => {
                  const isWeekend = day === 'Saturday' || day === 'Sunday';
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-corporate-800/40"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">{day}</span>
                      {isWeekend ? (
                        <span className="text-slate-400">Rest / Flex</span>
                      ) : (
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          09:00 - 18:00
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Calendar Event"
        description="Add corporate commitments, meetings, or protected workout blocks"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input
            label="Event Title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="e.g. Q3 Roadmap Review or Evening Push Session"
            required
          />

          <Select
            label="Event Category"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            options={[
              { value: 'WORK', label: 'Corporate Meeting / Work Focus' },
              { value: 'WORKOUT', label: 'Scheduled Workout Block' },
              { value: 'MEAL', label: 'Lunch / Nutrition Break' },
              { value: 'PERSONAL', label: 'Personal / Commute' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <Input
            label="Notes / Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details..."
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-corporate-800">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={creating}>
              Save Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
