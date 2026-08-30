import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full border border-warm-200 bg-warm-100',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback: string;
  status?: 'online' | 'offline' | 'busy';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, status, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);

    return (
      <div className="relative inline-block">
        <div ref={ref} className={cn(avatarVariants({ size }), className)} {...props}>
          {src && !imgError ? (
            <img
              src={src}
              alt={alt || fallback}
              className="aspect-square h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-medium text-warm-700">
              {fallback}
            </span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full border-2 border-white',
              {
                'bg-green-500': status === 'online',
                'bg-gray-400': status === 'offline',
                'bg-red-500': status === 'busy',
              },
              {
                'h-2 w-2': size === 'xs',
                'h-2.5 w-2.5': size === 'sm',
                'h-3 w-3': size === 'md',
                'h-3.5 w-3.5': size === 'lg',
                'h-4 w-4': size === 'xl',
              }
            )}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';
