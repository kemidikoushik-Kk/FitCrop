import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Dumbbell, ShieldCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center bg-slate-50 dark:bg-corporate-950 p-4 sm:p-6 transition-colors duration-200">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Fit<span className="text-brand-500">Corp</span>
          </span>
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-corporate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md my-16 z-10 animate-slide-up">
        <Outlet />
      </div>

      {/* Wellness & Security Footer */}
      <div className="mt-auto text-center text-xs text-slate-400 dark:text-slate-500 max-w-md space-y-2 pb-6">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-brand-500" />
          Enterprise-grade 256-bit SSL encrypted. HIPAA-aligned data privacy.
        </p>
        <p>&copy; {new Date().getFullYear()} FitCorp. All rights reserved.</p>
      </div>
    </div>
  );
};
