import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand-100 text-brand-800 hover:bg-brand-200',
        success: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
        warning: 'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200',
        error: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
        info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
        outline: 'text-warm-700 border-warm-300',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  onRemove?: () => void;
}

export function Badge({ className, variant, size, dot, onRemove, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'mr-1.5 h-1.5 w-1.5 rounded-full',
            variant === 'default' && 'bg-brand-500',
            variant === 'success' && 'bg-green-500',
            variant === 'warning' && 'bg-amber-500',
            variant === 'error' && 'bg-red-500',
            variant === 'info' && 'bg-blue-500',
            variant === 'outline' && 'bg-warm-400'
          )}
          aria-hidden="true"
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1.5 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-black/10 focus:bg-black/10 focus:outline-none"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove</span>
        </button>
      )}
    </div>
  );
}
