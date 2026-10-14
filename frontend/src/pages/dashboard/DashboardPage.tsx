import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { dashboardApi, DashboardResponse } from '../../api/dashboardApi';
import { nutritionApi } from '../../api/nutritionApi';
import { workoutApi } from '../../api/workoutApi';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Flame,
  Dumbbell,
  Utensils,
  Droplet,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Plus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingWater, setLoggingWater] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getDashboard();
      if (res.data) {
        setData(res.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard.';
      showToast('error', 'Dashboard Error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleQuickWater = async (amountMl: number) => {
    if (!data?.nutritionSummary) return;
    try {
      setLoggingWater(true);
      const todayStr = new Date().toISOString().split('T')[0];
      const newTotal = (data.nutritionSummary.waterMl || 0) + amountMl;
      await nutritionApi.logNutrition({
        date: todayStr,
        waterMl: newTotal,
      });

      setData((prev) => {
        if (!prev || !prev.nutritionSummary) return prev;
        return {
          ...prev,
          nutritionSummary: {
            ...prev.nutritionSummary,
            waterMl: newTotal,
          },
        };
      });
      showToast('success', 'Hydration Logged', `+${amountMl}ml recorded.`);
    } catch {
      showToast('error', 'Error', 'Failed to log hydration.');
    } finally {
      setLoggingWater(false);
    }
  };

  const handleToggleMeal = async (mealId: string, currentStatus: boolean) => {
    if (currentStatus) return; // already consumed
    try {
      await nutritionApi.markMealConsumed(mealId);
      setData((prev) => {
        if (!prev || !prev.todayMeals) return prev;
        return {
          ...prev,
          todayMeals: prev.todayMeals.map((m) =>
            m.id === mealId ? { ...m, isConsumed: true } : m
          ),
        };
      });
      showToast('success', 'Meal Logged', 'Marked meal as consumed.');
    } catch {
      showToast('error', 'Error', 'Failed to update meal status.');
    }
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const streak = data?.progressSummary?.currentStreak ?? 0;
  const workoutsCompleted = data?.progressSummary?.workoutsCompletedThisWeek ?? 0;
  const targetWorkouts = data?.progressSummary?.targetWorkoutsThisWeek ?? 4;
  const consistency = data?.progressSummary?.consistencyPercentage ?? 0;

  const todayWorkout = data?.todayWorkout;
  const nutrition = data?.nutritionSummary;
  const meals = data?.todayMeals || [];
  const schedule = data?.todaySchedule || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {data?.greeting || 'Good day'}, {user?.fullName || 'Professional'} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
            <span className="italic">
              "{data?.motivationalQuote || 'Consistent micro-habits compound into peak executive performance.'}"
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboard}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Link to="/workouts">
            <Button size="sm" leftIcon={<Play className="w-3.5 h-3.5" />}>
              Start Workout
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Habit Streak"
          value={`${streak} Days`}
          subtitle="Keep daily momentum alive"
          icon={<Flame className="w-5 h-5 text-amber-500" />}
          iconBgColor="bg-amber-500/10"
        />

        <StatCard
          title="Weekly Workouts"
          value={`${workoutsCompleted} / ${targetWorkouts}`}
          subtitle={`${Math.round((workoutsCompleted / (targetWorkouts || 1)) * 100)}% of weekly goal`}
          icon={<Dumbbell className="w-5 h-5 text-brand-500" />}
          iconBgColor="bg-brand-500/10"
        />

        <StatCard
          title="Daily Calorie Budget"
          value={`${nutrition?.consumedCalories || 0} / ${nutrition?.targetCalories || 2200} kcal`}
          subtitle={`${nutrition?.calorieProgressPercentage || 0}% allocated`}
          icon={<Utensils className="w-5 h-5 text-blue-500" />}
          iconBgColor="bg-blue-500/10"
        />

        <StatCard
          title="Consistency Score"
          value={`${consistency}%`}
          subtitle="30-day corporate adherence"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          iconBgColor="bg-emerald-500/10"
        />
      </div>

      {/* Main Grid: Today's Workout + Today's Meals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Today's Workout & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Workout Session */}
          <Card className="hover:border-brand-500/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Dumbbell className="w-5 h-5 text-brand-500" />
                  Today's Training Session
                </CardTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Tailored to your corporate schedule and available equipment
                </p>
              </div>
              {todayWorkout && (
                <Badge
                  variant={
                    todayWorkout.status === 'COMPLETED'
                      ? 'success'
                      : todayWorkout.status === 'IN_PROGRESS'
                      ? 'warning'
                      : 'brand'
                  }
                >
                  {todayWorkout.status}
                </Badge>
              )}
            </CardHeader>

            <CardContent>
              {todayWorkout ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-corporate-800/60 border border-slate-100 dark:border-corporate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                        {todayWorkout.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {todayWorkout.estimatedDurationMinutes} mins
                        </span>
                        <span>&bull;</span>
                        <span>{todayWorkout.exercises?.length || 0} exercises</span>
                        <span>&bull;</span>
                        <span className="capitalize">{todayWorkout.dayType?.toLowerCase()}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => navigate('/workouts')}
                      leftIcon={<Play className="w-3.5 h-3.5" />}
                    >
                      {todayWorkout.status === 'COMPLETED' ? 'View Summary' : 'Launch Workout'}
                    </Button>
                  </div>

                  {/* Exercise Quick Preview */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Exercise Breakdown
                    </p>
                    <div className="divide-y divide-slate-100 dark:divide-corporate-800 border border-slate-100 dark:border-corporate-800 rounded-xl overflow-hidden">
                      {todayWorkout.exercises?.slice(0, 4).map((ex, idx) => (
                        <div
                          key={ex.id || idx}
                          className="p-3 bg-white dark:bg-corporate-900 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-corporate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-[10px]">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">
                                {ex.exercise?.name || 'Exercise'}
                              </p>
                              <p className="text-slate-400 text-[11px]">
                                {ex.exercise?.muscleGroup} &bull; {ex.exercise?.equipment}
                              </p>
                            </div>
                          </div>
                          <div className="text-slate-600 dark:text-slate-400 font-medium text-right">
                            {ex.sets} sets &times; {ex.reps} reps
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No workout scheduled for today. Enjoy your scheduled recovery day!
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/workouts')}
                  >
                    View Weekly Workout Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Corporate Schedule & Conflict Detection */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-blue-500" />
                Workday Schedule & Meeting Radar
              </CardTitle>
              <Link to="/schedule" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                Manage Calendar
              </Link>
            </CardHeader>
            <CardContent>
              {schedule.length > 0 ? (
                <div className="space-y-2">
                  {schedule.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg border border-slate-100 dark:border-corporate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            event.eventType === 'MEETING'
                              ? 'bg-rose-500'
                              : event.eventType === 'WORKOUT'
                              ? 'bg-brand-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{event.title}</span>
                      </div>
                      <span className="text-slate-500">
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-corporate-800/40 text-xs text-slate-500 flex items-center justify-between">
                  <span>Work hours: 09:00 - 18:00. Optimal workout window: 18:30 - 19:30.</span>
                  <Badge variant="brand">Free Window</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 col): Nutrition & Water Tracker */}
        <div className="space-y-6">
          {/* Nutrition Snapshot */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Utensils className="w-5 h-5 text-brand-500" />
                Nutrition & Macros
              </CardTitle>
              <Link to="/nutrition" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                Full Plan
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar
                label="Calories"
                sublabel={`${nutrition?.consumedCalories || 0} / ${nutrition?.targetCalories || 2000} kcal`}
                value={nutrition?.consumedCalories || 0}
                max={nutrition?.targetCalories || 2000}
                color="blue"
              />

              <ProgressBar
                label="Protein"
                sublabel={`${nutrition?.consumedProtein || 0} / ${nutrition?.targetProtein || 140}g`}
                value={nutrition?.consumedProtein || 0}
                max={nutrition?.targetProtein || 140}
                color="brand"
              />

              {/* Today's Meals Checklist */}
              <div className="pt-2 border-t border-slate-100 dark:border-corporate-800 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Today's Meals
                </p>

                {meals.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No meals logged for today.</p>
                ) : (
                  <div className="space-y-2">
                    {meals.map((meal) => (
                      <div
                        key={meal.id}
                        onClick={() => handleToggleMeal(meal.id, meal.isConsumed)}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          meal.isConsumed
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-500 line-through'
                            : 'border-slate-200 dark:border-corporate-800 hover:border-brand-500 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className={`w-4 h-4 ${
                              meal.isConsumed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                          <div>
                            <span className="font-semibold block">{meal.title}</span>
                            <span className="text-[10px] text-slate-400 no-underline inline-block">
                              {meal.calories} kcal &bull; {meal.protein}g P
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                          {meal.mealType}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Water / Hydration Widget */}
              <div className="pt-4 border-t border-slate-100 dark:border-corporate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                    <Droplet className="w-4 h-4 text-blue-500" />
                    Hydration Radar
                  </div>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {nutrition?.waterMl || 0} / {nutrition?.targetWaterMl || 2500} ml
                  </span>
                </div>

                <ProgressBar
                  value={nutrition?.waterMl || 0}
                  max={nutrition?.targetWaterMl || 2500}
                  showPercentage={false}
                  color="blue"
                />

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    disabled={loggingWater}
                    onClick={() => handleQuickWater(250)}
                    leftIcon={<Plus className="w-3 h-3 text-blue-500" />}
                  >
                    +250 ml
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    disabled={loggingWater}
                    onClick={() => handleQuickWater(500)}
                    leftIcon={<Plus className="w-3 h-3 text-blue-500" />}
                  >
                    +500 ml
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
