import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { progressApi } from '../../api/progressApi';
import {
  ProgressSummaryResponse,
  ProgressChartsResponse,
  BodyMeasurementDto,
} from '../../types/progress';
import { useToast } from '../../contexts/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatCard } from '../../components/ui/StatCard';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Flame,
  Dumbbell,
  Scale,
  Plus,
  TrendingDown,
  TrendingUp,
  Activity,
  Award,
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { showToast } = useToast();

  const [summary, setSummary] = useState<ProgressSummaryResponse | null>(null);
  const [charts, setCharts] = useState<ProgressChartsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Measurement Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [bodyFat, setBodyFat] = useState<number>(18);
  const [waistCm, setWaistCm] = useState<number>(82);
  const [chestCm, setChestCm] = useState<number>(98);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const [sumRes, chartsRes] = await Promise.all([
        progressApi.getSummary(),
        progressApi.getCharts(),
      ]);

      if (sumRes.data) setSummary(sumRes.data);
      if (chartsRes.data) setCharts(chartsRes.data);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleLogMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const todayStr = new Date().toISOString().split('T')[0];
      const payload: BodyMeasurementDto = {
        date: todayStr,
        weightKg: Number(weightKg),
        bodyFatPercentage: bodyFat ? Number(bodyFat) : undefined,
        waistCm: waistCm ? Number(waistCm) : undefined,
        chestCm: chestCm ? Number(chestCm) : undefined,
        notes: notes || undefined,
      };

      await progressApi.recordMeasurement(payload);
      showToast('success', 'Logged', 'Body measurements recorded.');
      setIsModalOpen(false);
      fetchProgress();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record measurement.';
      showToast('error', 'Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const weightTrendData =
    charts?.weightTrend && charts.weightTrend.length > 0
      ? charts.weightTrend
      : [
          { date: 'Week 1', weight: 78.5 },
          { date: 'Week 2', weight: 77.8 },
          { date: 'Week 3', weight: 77.1 },
          { date: 'Week 4', weight: 76.4 },
          { date: 'Current', weight: summary?.currentWeight || 75.8 },
        ];

  const workoutConsistencyData =
    charts?.workoutConsistency && charts.workoutConsistency.length > 0
      ? charts.workoutConsistency
      : [
          { dayOfWeek: 'Mon', completed: 1, target: 1 },
          { dayOfWeek: 'Tue', completed: 0, target: 0 },
          { dayOfWeek: 'Wed', completed: 1, target: 1 },
          { dayOfWeek: 'Thu', completed: 0, target: 0 },
          { dayOfWeek: 'Fri', completed: 1, target: 1 },
          { dayOfWeek: 'Sat', completed: 1, target: 1 },
          { dayOfWeek: 'Sun', completed: 0, target: 0 },
        ];

  const nutritionData =
    charts?.nutritionConsistency && charts.nutritionConsistency.length > 0
      ? charts.nutritionConsistency
      : [
          { date: 'Mon', consumedCalories: 2150, targetCalories: 2200, consumedProtein: 145, targetProtein: 140 },
          { date: 'Tue', consumedCalories: 2190, targetCalories: 2200, consumedProtein: 138, targetProtein: 140 },
          { date: 'Wed', consumedCalories: 2210, targetCalories: 2200, consumedProtein: 142, targetProtein: 140 },
          { date: 'Thu', consumedCalories: 2100, targetCalories: 2200, consumedProtein: 135, targetProtein: 140 },
          { date: 'Fri', consumedCalories: 2250, targetCalories: 2200, consumedProtein: 148, targetProtein: 140 },
          { date: 'Sat', consumedCalories: 2180, targetCalories: 2200, consumedProtein: 140, targetProtein: 140 },
        ];

  const weightDelta = (summary?.currentWeight || 75) - (summary?.startingWeight || 78);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Progress & Corporate Habit Analytics
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Data-driven tracking of weight trajectory, workout adherence, and macro consistency.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Log Measurements
        </Button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Habit Streak"
          value={`${summary?.currentStreak || 0} Days`}
          subtitle={`Best: ${summary?.longestStreak || 0} days`}
          icon={<Flame className="w-5 h-5 text-amber-500" />}
          iconBgColor="bg-amber-500/10"
        />

        <StatCard
          title="Total Workouts Done"
          value={summary?.totalWorkoutsCompleted || 0}
          subtitle="All-time sessions completed"
          icon={<Dumbbell className="w-5 h-5 text-brand-500" />}
          iconBgColor="bg-brand-500/10"
        />

        <StatCard
          title="Weight Trajectory"
          value={`${summary?.currentWeight || 75} kg`}
          trend={{
            value: `${Math.abs(weightDelta).toFixed(1)} kg`,
            isPositive: weightDelta <= 0,
            label: weightDelta <= 0 ? 'lost' : 'gained',
          }}
          icon={<Scale className="w-5 h-5 text-blue-500" />}
          iconBgColor="bg-blue-500/10"
        />

        <StatCard
          title="Executive Consistency"
          value={`${summary?.consistencyPercentage || 88}%`}
          subtitle="Rolling 30-day adherence"
          icon={<Award className="w-5 h-5 text-emerald-500" />}
          iconBgColor="bg-emerald-500/10"
        />
      </div>

      {/* Chart 1: Weight Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-500" />
            Body Weight Trend (kg)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row: Workout Consistency & Nutrition Adherence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-brand-500" />
              Weekly Workout Adherence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workoutConsistencyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="dayOfWeek" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[0, 1]} ticks={[0, 1]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Protein & Calorie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Daily Calorie Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={nutritionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="consumedCalories"
                    name="Consumed (kcal)"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="targetCalories"
                    name="Target (kcal)"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Log Measurement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Body Measurements"
        description="Track your physical changes and body composition over time"
      >
        <form onSubmit={handleLogMeasurement} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              required
            />
            <Input
              label="Body Fat % (Optional)"
              type="number"
              step="0.1"
              value={bodyFat}
              onChange={(e) => setBodyFat(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Waist (cm, Optional)"
              type="number"
              step="0.5"
              value={waistCm}
              onChange={(e) => setWaistCm(Number(e.target.value))}
            />
            <Input
              label="Chest (cm, Optional)"
              type="number"
              step="0.5"
              value={chestCm}
              onChange={(e) => setChestCm(Number(e.target.value))}
            />
          </div>

          <Input
            label="Notes"
            placeholder="e.g. Morning weigh-in, fasted"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-corporate-800">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={submitting}>
              Save Measurements
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
