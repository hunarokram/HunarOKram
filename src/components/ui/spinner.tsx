import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <div ref={ref} role="status" className={cn('inline-flex items-center justify-center', className)} {...props}>
        <Loader2
          className={cn(
            'animate-spin text-brand-600',
            size === 'sm' && 'h-4 w-4',
            size === 'md' && 'h-6 w-6',
            size === 'lg' && 'h-8 w-8'
          )}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
Spinner.displayName = 'Spinner';
