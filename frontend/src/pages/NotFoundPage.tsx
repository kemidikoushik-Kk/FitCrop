import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Dumbbell, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-corporate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="h-16 w-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mb-4">
        <Dumbbell className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <p className="mt-2 text-base text-slate-600 dark:text-slate-400 max-w-sm">
        Oops! The page you were looking for doesn't exist or has moved.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
