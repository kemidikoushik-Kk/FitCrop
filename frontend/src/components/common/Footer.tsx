import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-corporate-800 bg-white dark:bg-corporate-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} FitCorp Inc. Engineered for busy corporate professionals.</span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-400">
            Built with precision <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" />
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Link to="/disclaimer" className="hover:text-brand-500 flex items-center gap-1 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" /> Wellness Disclaimer
          </Link>
          <Link to="/privacy" className="hover:text-brand-500 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-brand-500 transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};
