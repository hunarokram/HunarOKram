import React from 'react';
import { cn } from '@/utils/cn';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', label, ...props }, ref) => {
    if (label && orientation === 'horizontal') {
      return (
        <div className={cn("relative", className)} ref={ref} {...props}>
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-warm-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-warm-500">{label}</span>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          'shrink-0 bg-warm-200',
          orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = 'Separator';
