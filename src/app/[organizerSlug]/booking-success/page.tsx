'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function BookingSuccessPage() {
  const params = useParams();
  const organizerSlug = params?.organizerSlug as string;

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border-[#ebe9e4] overflow-hidden">
        <div className="bg-[#2d2a26] h-2 w-full"></div>
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-serif text-[#2d2a26]">Booking Confirmed!</h1>
            <p className="text-[#686662]">
              Your payment was successful and your spot is reserved. We've sent the ticket details to your email.
            </p>
            <p className="text-sm font-medium text-[#d45f2a]">Please also check your spam or junk folder.</p>
          </div>

          <div className="bg-warm-50 p-4 rounded-xl border border-warm-100 flex items-center justify-center gap-3 text-sm text-warm-800">
            <Calendar className="h-4 w-4" />
            <span>Check your email (and spam) for the schedule</span>
          </div>

          <div className="pt-4">
            <Link href={`/${organizerSlug}`}>
              <Button className="w-full h-12 bg-[#2d2a26] hover:bg-[#1a1815] text-white">
                Back to Storefront <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
