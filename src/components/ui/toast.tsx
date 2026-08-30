import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const variantStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const progressStyles = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

export function Toast({ id, title, message, variant = 'info', duration = 5000, onClose }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const Icon = icons[variant];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    const closeTimer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, id, onClose]);

  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full max-w-md overflow-hidden rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out',
        variantStyles[variant]
      )}
      role="alert"
    >
      <div className="flex w-full items-start gap-3">
        <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', iconStyles[variant])} />
        <div className="flex-1 space-y-1">
          {title && <h3 className="font-medium text-sm leading-none tracking-tight">{title}</h3>}
          <p className="text-sm opacity-90">{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div
        className={cn('absolute bottom-0 left-0 h-1 transition-all duration-100', progressStyles[variant])}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

interface ToastContextType {
  toast: (options: Omit<ToastProps, 'id' | 'onClose'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

  const toast = useCallback((options: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...options, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-start gap-2 p-4 sm:p-6 sm:top-0 sm:right-0 sm:bottom-auto sm:left-auto">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
