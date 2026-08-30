import React from 'react';
import { cn } from '@/utils/cn';
import { type LucideIcon } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border border-dashed border-warm-300 bg-warm-50 p-8 text-center',
          className
        )}
        {...props}
      >
        {Icon && (
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 shadow-sm">
            <Icon className="h-8 w-8" />
          </div>
        )}
        <h3 className="mb-2 text-lg font-semibold text-warm-900">{title}</h3>
        {description && (
          <p className="mb-6 max-w-sm text-sm text-warm-500">{description}</p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';
