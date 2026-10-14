import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { AdminStatsResponse } from '../../types/admin';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import {
  Users,
  Dumbbell,
  Utensils,
  ShieldAlert,
  ArrowRight,
  Database,
  Activity,
  Layers,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              System Administration
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Admin Console
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Platform governance, user management, and reference exercise/food data maintenance.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={stats?.totalUsers ?? 1}
          subtitle={`${stats?.activeUsers ?? 1} currently active`}
          icon={<Users className="w-5 h-5 text-purple-500" />}
          iconBgColor="bg-purple-500/10"
        />

        <StatCard
          title="Workouts Completed"
          value={stats?.totalWorkoutsCompleted ?? 0}
          subtitle="All-time sessions logged"
          icon={<Dumbbell className="w-5 h-5 text-brand-500" />}
          iconBgColor="bg-brand-500/10"
        />

        <StatCard
          title="Exercise Library"
          value={stats?.totalExercises ?? 20}
          subtitle="Catalogued exercises"
          icon={<Layers className="w-5 h-5 text-blue-500" />}
          iconBgColor="bg-blue-500/10"
        />

        <StatCard
          title="Food Database"
          value={stats?.totalFoods ?? 24}
          subtitle="Verified whole foods"
          icon={<Utensils className="w-5 h-5 text-amber-500" />}
          iconBgColor="bg-amber-500/10"
        />
      </div>

      {/* Quick Access Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-purple-500/40 transition-all">
          <CardContent className="p-6 space-y-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 w-fit">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">User Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              View corporate user roster, toggle active statuses, grant administrative roles.
            </p>
            <Link to="/admin/users" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-brand-500/40 transition-all">
          <CardContent className="p-6 space-y-3">
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 w-fit">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Exercise Library</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Add new workouts, configure target muscle groups, instructions, and safety precautions.
            </p>
            <Link to="/admin/exercises" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Manage Exercises
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-amber-500/40 transition-all">
          <CardContent className="p-6 space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 w-fit">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Food Database</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Maintain macronutrient values, calorie counts, allergen flags, and vegetarian tags.
            </p>
            <Link to="/admin/foods" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Manage Food Database
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
