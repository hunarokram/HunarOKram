import React from 'react';
import { cn } from '@/utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, showCount, maxLength, value, defaultValue, onChange, ...props }, ref) => {
    const [count, setCount] = React.useState(
      value ? String(value).length : defaultValue ? String(defaultValue).length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      if (onChange) onChange(e);
    };

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <div className="flex justify-between">
            <label className="block text-sm font-medium text-warm-700">
              {label}
            </label>
            {showCount && maxLength && (
              <span className="text-xs text-warm-500">
                {count}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-warm-300 bg-warm-50 px-3 py-2 text-sm ring-offset-white placeholder:text-warm-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
