import React, { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export const Skeleton: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-slate-200 dark:bg-corporate-800', className)}
      {...props}
    />
  );
};
