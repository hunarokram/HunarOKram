import * as React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-brand-100 rounded-full flex items-center justify-center mb-8 text-brand-500">
        <Compass className="w-12 h-12" />
      </div>
      <h1 className="text-5xl font-display font-bold text-warm-900 mb-4 tracking-tight">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-warm-800 mb-4">
        Page not found
      </h2>
      <p className="text-warm-600 max-w-md mx-auto mb-10 text-lg">
        We couldn't find the page you were looking for. It might have been moved, or it simply doesn't exist.
      </p>
      <Link href="/" className={buttonVariants({ size: 'lg', className: 'rounded-full px-8' })}>
        Back to Home
      </Link>
    </div>
  );
}
