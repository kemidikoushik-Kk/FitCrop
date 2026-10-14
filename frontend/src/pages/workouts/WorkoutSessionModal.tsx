import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { WorkoutDayResponse, CompleteWorkoutRequest } from '../../types/workout';
import { workoutApi } from '../../api/workoutApi';
import { useToast } from '../../contexts/ToastContext';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Dumbbell,
  AlertCircle,
  Timer,
} from 'lucide-react';

interface WorkoutSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  workoutDay: WorkoutDayResponse;
  onWorkoutCompleted: () => void;
}

export const WorkoutSessionModal: React.FC<WorkoutSessionModalProps> = ({
  isOpen,
  onClose,
  workoutDay,
  onWorkoutCompleted,
}) => {
  const { showToast } = useToast();

  // Stopwatch state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActiveTimer, setIsActiveTimer] = useState(true);

  // Rest countdown timer state
  const [restCountdown, setRestCountdown] = useState<number | null>(null);

  // Exercise tracking state: map of exerciseId -> { setsCompleted, repsCompleted, weightKg, isCompleted }
  const [tracking, setTracking] = useState<
    Record<
      string,
      {
        setsCompleted: number;
        repsCompleted: number;
        weightKg: number;
        isCompleted: boolean;
      }
    >
  >({});

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize tracking state from exercises
  useEffect(() => {
    if (workoutDay) {
      const initial: Record<
        string,
        {
          setsCompleted: number;
          repsCompleted: number;
          weightKg: number;
          isCompleted: boolean;
        }
      > = {};

      workoutDay.exercises?.forEach((ex) => {
        initial[ex.exercise.id] = {
          setsCompleted: ex.sets || 3,
          repsCompleted: ex.reps || 10,
          weightKg: 0,
          isCompleted: false,
        };
      });
      setTracking(initial);
      setElapsedSeconds(0);
      setIsActiveTimer(true);
      setRestCountdown(null);
    }
  }, [workoutDay]);

  // Main session timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOpen && isActiveTimer) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isActiveTimer]);

  // Rest countdown interval
  useEffect(() => {
    let restInterval: NodeJS.Timeout | null = null;
    if (restCountdown !== null && restCountdown > 0) {
      restInterval = setInterval(() => {
        setRestCountdown((prev) => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);
    }
    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [restCountdown]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const startRestTimer = (seconds: number) => {
    setRestCountdown(seconds || 60);
  };

  const handleToggleExerciseCompleted = (exerciseId: string, defaultRest = 60) => {
    setTracking((prev) => {
      const current = prev[exerciseId] || {
        setsCompleted: 3,
        repsCompleted: 10,
        weightKg: 0,
        isCompleted: false,
      };
      const nextCompleted = !current.isCompleted;

      if (nextCompleted) {
        startRestTimer(defaultRest);
      }

      return {
        ...prev,
        [exerciseId]: {
          ...current,
          isCompleted: nextCompleted,
        },
      };
    });
  };

  const handleUpdateExerciseValue = (
    exerciseId: string,
    field: 'setsCompleted' | 'repsCompleted' | 'weightKg',
    value: number
  ) => {
    setTracking((prev) => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {
          setsCompleted: 3,
          repsCompleted: 10,
          weightKg: 0,
          isCompleted: false,
        }),
        [field]: value,
      },
    }));
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const exercisesPayload = Object.entries(tracking).map(([exerciseId, data]) => ({
        exerciseId,
        setsCompleted: data.setsCompleted,
        repsCompleted: data.repsCompleted,
        weightKg: data.weightKg,
        isCompleted: data.isCompleted,
      }));

      const payload: CompleteWorkoutRequest = {
        workoutDayId: workoutDay.id,
        durationSeconds: elapsedSeconds,
        notes: notes || undefined,
        exercises: exercisesPayload,
      };

      await workoutApi.completeWorkout(workoutDay.id, payload);
      showToast('success', 'Workout Logged!', `Great job! Completed in ${formatTime(elapsedSeconds)}.`);
      onWorkoutCompleted();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete workout.';
      showToast('error', 'Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={`Live Session: ${workoutDay.title}`}
      description="Track completed sets, reps, load, and rest periods in real time"
    >
      <div className="space-y-6">
        {/* Stopwatch & Rest Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 text-white shadow-inner">
          <div className="flex items-center justify-between sm:justify-start sm:gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                Session Elapsed
              </span>
              <span className="text-3xl font-mono font-bold tracking-tight text-brand-400">
                {formatTime(elapsedSeconds)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsActiveTimer(!isActiveTimer)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                aria-label={isActiveTimer ? 'Pause timer' : 'Resume timer'}
              >
                {isActiveTimer ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setElapsedSeconds(0)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                aria-label="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Rest Countdown Timer */}
          <div className="flex items-center justify-between sm:justify-end sm:gap-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-3 sm:pt-0 sm:pl-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                <Timer className="w-3 h-3 text-amber-400" /> Rest Timer
              </span>
              <span
                className={`text-2xl font-mono font-bold ${
                  restCountdown !== null ? 'text-amber-400 animate-pulse' : 'text-slate-500'
                }`}
              >
                {restCountdown !== null ? `${restCountdown}s` : 'Idle'}
              </span>
            </div>
            {restCountdown !== null && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRestCountdown(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Skip Rest
              </Button>
            )}
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Exercises ({workoutDay.exercises?.length || 0})
          </h4>

          <div className="space-y-3">
            {workoutDay.exercises?.map((we, index) => {
              const ex = we.exercise;
              const current = tracking[ex.id] || {
                setsCompleted: we.sets || 3,
                repsCompleted: we.reps || 10,
                weightKg: 0,
                isCompleted: false,
              };

              return (
                <div
                  key={we.id || ex.id}
                  className={`p-4 rounded-xl border transition-all ${
                    current.isCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-corporate-900 border-slate-200 dark:border-corporate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-corporate-800 text-xs font-bold flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <h5 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {ex.name}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Target: {we.sets} sets &times; {we.reps} reps &bull; Rest: {we.restSeconds || 60}s
                        </p>
                        {ex.instructions && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                            Tip: {ex.instructions}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      variant={current.isCompleted ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleToggleExerciseCompleted(ex.id, we.restSeconds)}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      {current.isCompleted ? 'Done' : 'Mark Done'}
                    </Button>
                  </div>

                  {/* Inputs for actual metrics */}
                  <div className="mt-3 grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-corporate-800/80">
                    <Input
                      label="Sets Done"
                      type="number"
                      value={current.setsCompleted}
                      onChange={(e) =>
                        handleUpdateExerciseValue(ex.id, 'setsCompleted', Number(e.target.value))
                      }
                      min={0}
                      max={20}
                    />
                    <Input
                      label="Reps / Set"
                      type="number"
                      value={current.repsCompleted}
                      onChange={(e) =>
                        handleUpdateExerciseValue(ex.id, 'repsCompleted', Number(e.target.value))
                      }
                      min={0}
                      max={100}
                    />
                    <Input
                      label="Weight (kg)"
                      type="number"
                      value={current.weightKg}
                      onChange={(e) =>
                        handleUpdateExerciseValue(ex.id, 'weightKg', Number(e.target.value))
                      }
                      min={0}
                      max={500}
                      step="2.5"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workout Notes */}
        <div>
          <Input
            label="Workout Notes (Optional)"
            placeholder="e.g. Great energy today, felt good on incline press."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-corporate-800">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleFinish}
            isLoading={isSubmitting}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Finish & Log Workout
          </Button>
        </div>
      </div>
    </Modal>
  );
};
