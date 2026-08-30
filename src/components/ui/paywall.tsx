'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import { useCurrentOrganizer } from '@/hooks/use-organizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

interface PaywallProps {
  children: React.ReactNode;
  featureName: string;
  description?: string;
}

export function Paywall({ children, featureName, description }: PaywallProps) {
  const { data: organizer, isLoading } = useCurrentOrganizer();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-dashed border-warm-200 bg-warm-50/50">
        <Spinner size="lg" className="text-brand-600" />
      </div>
    );
  }

  // If subscription is active and not expired, grant access
  let isSubscribed = false;
  if (organizer?.subscriptionStatus === 'active') {
    if (!organizer.subscriptionExpiresAt || new Date(organizer.subscriptionExpiresAt) > new Date()) {
      isSubscribed = true;
    }
  }

  if (isSubscribed) {
    return <>{children}</>;
  }

  // Otherwise, show paywall
  return (
    <div className="relative overflow-hidden rounded-2xl border border-warm-200 bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
      
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-warm-500/10 blur-3xl"></div>

      <div className="relative flex flex-col items-center justify-center px-4 py-24 text-center sm:px-16">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-warm-100 text-brand-600 shadow-inner">
          <Lock className="h-10 w-10" />
        </div>
        
        <h2 className="mb-3 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Unlock {featureName}
        </h2>
        
        <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-slate-600">
          {description || `Upgrade your plan to access ${featureName} and take your business to the next level.`}
        </p>
        
        <Card className="w-full max-w-md border-brand-100 bg-white/60 shadow-xl shadow-brand-900/5 backdrop-blur-xl">
          <CardContent className="flex flex-col gap-6 p-8">
            <div className="flex items-center gap-3 border-b border-warm-100 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Crown className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900">Premium Plan</h3>
                <p className="text-sm text-slate-500">Everything you need to grow</p>
              </div>
            </div>
            
            <ul className="space-y-3 text-left text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500"></div>
                Access to {featureName}
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500"></div>
                Unlimited Workshops & Schedules
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-500"></div>
                Custom Branding & Domains
              </li>
            </ul>
            
            <Button 
              className="mt-2 w-full gap-2 bg-brand-600 hover:bg-brand-700" 
              size="lg"
              onClick={() => router.push('/subscription')}
            >
              Upgrade Now <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
