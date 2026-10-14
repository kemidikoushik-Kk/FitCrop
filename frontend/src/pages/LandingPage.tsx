import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import {
  Dumbbell,
  Calendar,
  Utensils,
  LineChart,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Users,
  Flame,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-corporate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-200/80 dark:border-corporate-800/80 bg-white/80 dark:bg-corporate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Fit<span className="text-brand-500">Corp</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-32">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-xs font-semibold text-brand-700 dark:text-brand-300 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            The Corporate Wellness & Fitness Operating System
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Peak Executive Performance,{' '}
            <span className="bg-gradient-to-r from-brand-500 to-emerald-400 bg-clip-text text-transparent">
              Synchronized With Your Workday
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Engineered specifically for busy professionals aged 22–45. We weave scientifically-backed 30–45 minute training splits, allergy-safe nutrition, and hydration reminders seamlessly around your calendar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Build Your Personalized Plan
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Value Pillars */}
      <section className="py-16 bg-white dark:bg-corporate-900 border-y border-slate-200/80 dark:border-corporate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Designed For Demanding Work Schedules
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              No generic influencer routines. Every feature is tuned for corporate reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:border-brand-500/40 transition-all shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-500 w-fit">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Schedule-Aware Workouts</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Automatic detection of meetings and high-stress blocks. FitCorp suggests optimal 30-min express sessions during lunch breaks or after-hours without schedule conflict.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-brand-500/40 transition-all shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 w-fit">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Targeted Corporate Fuel</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Conservative, sustainable caloric floors (&ge;1200 kcal female, &ge;1500 kcal male). Zero extreme crash dieting. Allergen-filtered meal plans designed for desk eating and meal prep.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:border-brand-500/40 transition-all shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 w-fit">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">Habit Streaks & Analytics</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Gamified streak counters, weight trajectories, and macro adherence analytics. Keep your health metrics as optimized as your quarterly KPIs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prominent Medical & Wellness Disclaimer Box */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start gap-4">
          <ShieldAlert className="w-8 h-8 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />
          <div className="text-xs space-y-2 leading-relaxed">
            <h4 className="text-sm font-bold">Prominent Wellness & Safety Notice</h4>
            <p>
              FitCorp is engineered for fitness planning, habit tracking, and motivation. We strictly follow safe dietary boundaries and enforce conservative calorie minimums. FitCorp is not a clinical healthcare service. Consult a physician before beginning any strenuous workout routine or dietary modification.
            </p>
            <Link to="/disclaimer" className="font-semibold underline block pt-1 hover:text-amber-700">
              Read our full Wellness Disclaimer &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Call to action footer */}
      <footer className="border-t border-slate-200 dark:border-corporate-800 py-12 text-center text-xs text-slate-500 space-y-4">
        <div className="flex justify-center gap-6">
          <Link to="/disclaimer" className="hover:text-brand-500">Wellness Disclaimer</Link>
          <Link to="/privacy" className="hover:text-brand-500">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-brand-500">Terms of Service</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} FitCorp Inc. Empowering corporate vitality worldwide.</p>
      </footer>
    </div>
  );
};
