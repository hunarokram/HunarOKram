'use client';
import { useEffect } from 'react';

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Fire and forget
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    }).catch(console.error);
  }, [slug]);
  return null;
}
