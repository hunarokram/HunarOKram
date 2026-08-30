import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/guard';
import { connectToDatabase } from '@/lib/db/connection';
import { organizerRepository, bookingRepository, experienceRepository } from '@/repositories';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  await connectToDatabase();
  
  let userId: string;
  try {
    const auth = await requireAuth();
    userId = auth.userId;
  } catch {
    redirect('/login');
  }

  const organizer = await organizerRepository.findOne({ ownerId: userId as any });

  if (!organizer) {
    redirect('/onboarding');
  }

  // Fetch real analytics data
  const bookings = await bookingRepository.findMany(organizer._id);
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  
  const totalRevenuePaise = confirmedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalRevenueINR = totalRevenuePaise / 100;
  
  const experiences = await experienceRepository.findMany(organizer._id, { status: 'published' });

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl md:text-3xl font-display font-bold text-warm-900">Welcome, {organizer.name}</h1>
        <p className="text-sm md:text-base text-warm-600 mt-1 md:mt-2">Here is what is happening with your experiences today.</p>
      </div>

      {/* Grid: 3 columns on mobile too */}
      <div className="grid grid-cols-3 gap-2 md:gap-6">
        <Card className="flex flex-col justify-center">
          <CardHeader className="p-3 pb-1 md:p-6 md:pb-2">
            <CardTitle className="text-[10px] md:text-lg leading-tight md:leading-none truncate">Bookings</CardTitle>
            <CardDescription className="hidden md:block">All time confirmed</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            <p className="text-lg md:text-3xl font-bold text-brand-600">{confirmedBookings.length}</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center">
          <CardHeader className="p-3 pb-1 md:p-6 md:pb-2">
            <CardTitle className="text-[10px] md:text-lg leading-tight md:leading-none truncate">Revenue</CardTitle>
            <CardDescription className="hidden md:block">All time confirmed</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            <p className="text-lg md:text-3xl font-bold text-green-600 truncate">
              {totalRevenueINR >= 1000 ? `₹${(totalRevenueINR / 1000).toFixed(1)}k` : `₹${totalRevenueINR}`}
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center">
          <CardHeader className="p-3 pb-1 md:p-6 md:pb-2">
            <CardTitle className="text-[10px] md:text-lg leading-tight md:leading-none truncate">Active Exp.</CardTitle>
            <CardDescription className="hidden md:block">Currently published</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
            <p className="text-lg md:text-3xl font-bold text-warm-900">{experiences.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-brand-900">Create your first experience</h3>
          <p className="text-xs md:text-base text-brand-700 mt-1">Get started by creating a new experience for your customers.</p>
        </div>
        <Link href="/dashboard/experiences/new" className="w-full md:w-auto">
          <Button className="w-full md:w-auto gap-2">
            <Plus className="w-4 h-4" />
            Create Experience
          </Button>
        </Link>
      </div>
    </div>
  );
}
