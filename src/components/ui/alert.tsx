import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 transition-all duration-200',
  {
    variants: {
      variant: {
        info: 'bg-blue-50 text-blue-900 border-l-4 border-l-blue-500 border-y-transparent border-r-transparent [&>svg]:text-blue-500',
        success: 'bg-green-50 text-green-900 border-l-4 border-l-green-500 border-y-transparent border-r-transparent [&>svg]:text-green-500',
        warning: 'bg-amber-50 text-amber-900 border-l-4 border-l-amber-500 border-y-transparent border-r-transparent [&>svg]:text-amber-500',
        error: 'bg-red-50 text-red-900 border-l-4 border-l-red-500 border-y-transparent border-r-transparent [&>svg]:text-red-500',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  onDismiss?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, children, onDismiss, ...props }, ref) => {
    const Icon = icons[variant || 'info'];

    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
        <Icon className="h-5 w-5" />
        <div className="flex flex-col gap-1">
          {title && <h5 className="font-medium leading-none tracking-tight">{title}</h5>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute right-4 top-4 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = 'Alert';
