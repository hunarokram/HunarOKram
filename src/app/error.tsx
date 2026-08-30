'use client';

import * as React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-8 text-orange-500">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-display font-bold text-warm-900 mb-4 tracking-tight">
        Something went wrong
      </h1>
      <p className="text-warm-600 max-w-md mx-auto mb-10 text-lg">
        We've encountered an unexpected error. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} size="lg" className="rounded-full px-8">
          Try again
        </Button>
        <a href="/" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'rounded-full px-8 bg-transparent' })}>
          Go to Home
        </a>
      </div>
    </div>
  );
}
