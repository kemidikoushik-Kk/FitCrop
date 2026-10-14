import React, { useState, useEffect } from 'react';
import { workoutApi } from '../../api/workoutApi';
import { WorkoutPlanResponse, WorkoutDayResponse, ExerciseResponse } from '../../types/workout';
import { useToast } from '../../contexts/ToastContext';
import { WorkoutSessionModal } from './WorkoutSessionModal';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Dumbbell,
  Play,
  RotateCcw,
  Clock,
  Sparkles,
  Info,
  Calendar,
  FastForward,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const WorkoutsPage: React.FC = () => {
  const { showToast } = useToast();

  const [plan, setPlan] = useState<WorkoutPlanResponse | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  // Active workout session modal
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Exercise info modal
  const [selectedExercise, setSelectedExercise] = useState<ExerciseResponse | null>(null);

  const fetchWorkoutPlan = async () => {
    try {
      setLoading(true);
      const res = await workoutApi.getActivePlan();
      if (res.data) {
        setPlan(res.data);
      }
    } catch {
      // If no plan exists, plan will remain null and show empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const res = await workoutApi.generatePlan();
      if (res.data) {
        setPlan(res.data);
        setSelectedDayIndex(0);
        showToast('success', 'Plan Regenerated', 'Your training split has been updated.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to regenerate workout plan.';
      showToast('error', 'Error', msg);
    } finally {
      setRegenerating(false);
    }
  };

  const handleSkipDay = async (dayId: string) => {
    try {
      await workoutApi.skipWorkout(dayId);
      showToast('info', 'Workout Skipped', 'Marked day as skipped for tracking.');
      fetchWorkoutPlan();
    } catch {
      showToast('error', 'Error', 'Failed to skip workout.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!plan || !plan.days || plan.days.length === 0) {
    return (
      <EmptyState
        icon={<Dumbbell className="w-10 h-10" />}
        title="No Active Workout Plan"
        description="You don't have an active training split yet. Generate a personalized plan tailored to your goals and equipment."
        actionLabel={regenerating ? 'Generating...' : 'Generate Workout Plan'}
        onAction={handleRegenerate}
      />
    );
  }

  const selectedDay: WorkoutDayResponse | undefined = plan.days[selectedDayIndex] || plan.days[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {plan.name || 'Personalized Workout Plan'}
            </h1>
            <Badge variant="brand">v{plan.version || 1}</Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="capitalize">Goal: {plan.goal?.toLowerCase()?.replace('_', ' ')}</span>
            <span>&bull;</span>
            <span>{plan.days.length} Days Split</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            isLoading={regenerating}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Regenerate Split
          </Button>

          {selectedDay && (
            <Button
              size="sm"
              onClick={() => setIsSessionActive(true)}
              leftIcon={<Play className="w-3.5 h-3.5" />}
            >
              Start Session
            </Button>
          )}
        </div>
      </div>

      {/* Week Day Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-corporate-800 scrollbar-none">
        {plan.days.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          const status = day.status;

          return (
            <button
              key={day.id || idx}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'bg-white dark:bg-corporate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-corporate-800 border border-slate-200 dark:border-corporate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{day.dayOfWeek || `Day ${idx + 1}`}</span>
              {status === 'COMPLETED' && (
                <span className="h-2 w-2 rounded-full bg-emerald-400" title="Completed" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day View */}
      {selectedDay && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-corporate-800">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl font-bold">{selectedDay.title}</CardTitle>
                  <Badge
                    variant={
                      selectedDay.status === 'COMPLETED'
                        ? 'success'
                        : selectedDay.status === 'SKIPPED'
                        ? 'neutral'
                        : 'brand'
                    }
                  >
                    {selectedDay.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedDay.estimatedDurationMinutes} minutes
                  </span>
                  <span>&bull;</span>
                  <span>{selectedDay.exercises?.length || 0} targeted exercises</span>
                  <span>&bull;</span>
                  <span className="capitalize">{selectedDay.dayType?.toLowerCase()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedDay.status !== 'COMPLETED' && selectedDay.status !== 'SKIPPED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSkipDay(selectedDay.id)}
                    leftIcon={<FastForward className="w-3.5 h-3.5" />}
                  >
                    Skip Day
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => setIsSessionActive(true)}
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                >
                  {selectedDay.status === 'COMPLETED' ? 'Re-run Session' : 'Start Session'}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="space-y-3">
                {selectedDay.exercises?.map((we, index) => {
                  const ex = we.exercise;
                  return (
                    <div
                      key={we.id || ex.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-corporate-800 hover:border-brand-500/40 bg-white dark:bg-corporate-900 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <span className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                              {ex.name}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-corporate-800 text-slate-500 font-medium">
                              {ex.difficulty}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {ex.muscleGroup}
                            </span>
                            <span>&bull;</span>
                            <span>{ex.equipment}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-corporate-800">
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {we.sets} sets &times; {we.reps} reps
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Rest: {we.restSeconds || 60}s
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedExercise(ex)}
                          aria-label="Exercise instructions"
                        >
                          <Info className="w-4 h-4 text-slate-400 hover:text-brand-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Live Interactive Session Modal */}
      {selectedDay && (
        <WorkoutSessionModal
          isOpen={isSessionActive}
          onClose={() => setIsSessionActive(false)}
          workoutDay={selectedDay}
          onWorkoutCompleted={fetchWorkoutPlan}
        />
      )}

      {/* Exercise Instructions & Safety Modal */}
      {selectedExercise && (
        <Modal
          isOpen={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          title={selectedExercise.name}
          description={`${selectedExercise.muscleGroup} &bull; Equipment: ${selectedExercise.equipment}`}
        >
          <div className="space-y-4 text-sm">
            {selectedExercise.description && (
              <div>
                <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-1">
                  Description
                </h5>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  {selectedExercise.description}
                </p>
              </div>
            )}

            {selectedExercise.instructions && (
              <div>
                <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-1">
                  Execution Guide
                </h5>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed bg-slate-50 dark:bg-corporate-800/50 p-3 rounded-lg border border-slate-100 dark:border-corporate-800 whitespace-pre-line">
                  {selectedExercise.instructions}
                </p>
              </div>
            )}

            {selectedExercise.safetyNotes && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold mb-0.5">Safety & Injury Prevention:</strong>
                  {selectedExercise.safetyNotes}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Button size="sm" onClick={() => setSelectedExercise(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
