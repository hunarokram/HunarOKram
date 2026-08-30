import React from 'react';
import { cn } from '@/utils/cn';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, indeterminate, checked, onChange, disabled, ...props }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = (ref || defaultRef) as React.MutableRefObject<HTMLInputElement>;

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate || false;
      }
    }, [resolvedRef, indeterminate]);

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex h-5 items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            ref={resolvedRef}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            {...props}
          />
          <div
            className={cn(
              'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-warm-300 bg-warm-50 text-white transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2',
              (checked || indeterminate) && 'border-brand-600 bg-brand-600',
              disabled && 'cursor-not-allowed opacity-50',
              error && 'border-red-500',
              className
            )}
            aria-hidden="true"
          >
            {indeterminate ? (
              <Minus className="h-3.5 w-3.5" />
            ) : checked ? (
              <Check className="h-3.5 w-3.5" />
            ) : null}
          </div>
        </div>
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
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
