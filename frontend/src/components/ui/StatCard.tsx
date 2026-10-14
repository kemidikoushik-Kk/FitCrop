import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    value: number | string;
    isPositive?: boolean;
    label?: string;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-brand-500/10 text-brand-500',
  trend,
  className,
}) => {
  return (
    <Card className={cn('hover:border-brand-500/30 transition-all shadow-sm', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          {icon && (
            <div className={cn('p-2.5 rounded-xl flex items-center justify-center', iconBgColor)}>
              {icon}
            </div>
          )}
        </div>
        <div className="mt-3">
          <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </h4>
          {(subtitle || trend) && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              {trend && (
                <span
                  className={cn(
                    'inline-flex items-center font-medium gap-0.5',
                    trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  )}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {trend.value}
                </span>
              )}
              {subtitle && (
                <span className="text-slate-500 dark:text-slate-400">
                  {subtitle}
                </span>
              )}
              {trend?.label && !subtitle && (
                <span className="text-slate-500 dark:text-slate-400">
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
