import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  CalendarDays,
  LineChart,
  Settings,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Workouts', to: '/workouts', icon: Dumbbell },
    { label: 'Nutrition', to: '/nutrition', icon: UtensilsCrossed },
    { label: 'Schedule', to: '/schedule', icon: CalendarDays },
    { label: 'Progress & Habits', to: '/progress', icon: LineChart },
    { label: 'Settings', to: '/settings', icon: Settings },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin Console', to: '/admin', icon: ShieldAlert });
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
      isActive
        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 dark:bg-brand-600'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-corporate-800 hover:text-slate-900 dark:hover:text-slate-200'
    );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 dark:border-corporate-800 bg-white dark:bg-corporate-900 transition-transform duration-300 md:static md:translate-x-0 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            FitCorp Workspace
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={navLinkClass}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Corporate Wellness Tip Footer in Sidebar */}
        <div className="p-4 m-4 rounded-xl bg-slate-50 dark:bg-corporate-800/60 border border-slate-100 dark:border-corporate-800 text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Corporate Tip</p>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
            Short, focused 30-min workouts maintain 85% of hypertrophy gains while preventing meeting burnout.
          </p>
        </div>
      </aside>
    </>
  );
};
