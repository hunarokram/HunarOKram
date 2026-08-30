import React from 'react';
import { cn } from '@/utils/cn';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md';
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, size = 'md', checked, disabled, ...props }, ref) => {
    return (
      <div className="flex items-center justify-between gap-4">
        {(label || description) && (
          <div className="flex flex-col space-y-1">
            {label && (
              <label
                className={cn(
                  'text-sm font-medium leading-none text-warm-900',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={cn('text-sm text-warm-500', disabled && 'opacity-50')}>{description}</p>
            )}
          </div>
        )}
        <label
          className={cn(
            'relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2',
            checked ? 'bg-brand-600' : 'bg-warm-300',
            disabled && 'cursor-not-allowed opacity-50',
            size === 'sm' ? 'h-5 w-9' : 'h-6 w-11',
            className
          )}
        >
          <input
            type="checkbox"
            className="sr-only"
            ref={ref}
            checked={checked}
            disabled={disabled}
            {...props}
          />
          <span
            className={cn(
              'pointer-events-none inline-block rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              checked ? (size === 'sm' ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0.5',
              size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
            )}
          />
        </label>
      </div>
    );
  }
);
Switch.displayName = 'Switch';
