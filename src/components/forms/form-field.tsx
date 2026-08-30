'use client';

import {
  useFormContext,
  Controller,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import { cn } from '@/utils/cn';

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: (field: {
    value: unknown;
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<unknown>;
    error?: string;
    hasError: boolean;
  }) => React.ReactNode;
}

/**
 * Generic form field wrapper that integrates with React Hook Form context.
 * Handles label, error display, and description consistently.
 */
export function FormField<T extends FieldValues>({
  name,
  label,
  description,
  required,
  className,
  children,
}: FormFieldProps<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-warm-800"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-error" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          children({
            ...field,
            error: errorMessage,
            hasError: !!errorMessage,
          }) as React.ReactElement
        }
      />

      {description && !errorMessage && (
        <p className="text-xs text-warm-400">{description}</p>
      )}

      {errorMessage && (
        <p className="text-xs text-error" role="alert" id={`${name}-error`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
