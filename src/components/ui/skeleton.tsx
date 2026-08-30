import React from 'react';
import { cn } from '@/utils/cn';

function Skeleton({
  className,
  variant = 'rectangular',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: 'rectangular' | 'circular' }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-warm-200/50',
        variant === 'circular' ? 'rounded-full' : 'rounded-md',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
