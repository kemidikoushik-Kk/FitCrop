import React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  color?: 'brand' | 'blue' | 'amber' | 'rose' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  showPercentage = true,
  color = 'brand',
  size = 'md',
  className,
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const colors = {
    brand: 'bg-brand-500 dark:bg-brand-400',
    blue: 'bg-blue-500 dark:bg-blue-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
    rose: 'bg-rose-500 dark:bg-rose-400',
    purple: 'bg-purple-500 dark:bg-purple-400',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs">
          {label && (
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {label} {sublabel && <span className="text-slate-400 font-normal">({sublabel})</span>}
            </span>
          )}
          {showPercentage && (
            <span className="font-semibold text-slate-600 dark:text-slate-400 ml-auto">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 dark:bg-corporate-800 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full transition-all duration-500 rounded-full', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
