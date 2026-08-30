import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Loader2, type LucideIcon } from 'lucide-react';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm',
        secondary: 'bg-warm-100 text-warm-900 hover:bg-warm-200 shadow-sm',
        outline: 'border border-warm-300 bg-transparent hover:bg-warm-50 text-warm-700',
        ghost: 'bg-transparent hover:bg-warm-100 text-warm-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        link: 'text-brand-600 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'h-10 rounded-lg px-4 py-2',
        lg: 'h-12 rounded-lg px-6 text-base',
        xl: 'h-14 rounded-xl px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon: LeftIcon, rightIcon: RightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && LeftIcon && <LeftIcon className="mr-2 h-4 w-4" />}
        {children}
        {!isLoading && RightIcon && <RightIcon className="ml-2 h-4 w-4" />}
      </button>
    );
  }
);
Button.displayName = 'Button';
