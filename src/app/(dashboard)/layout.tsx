import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth/guard';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { connectToDatabase } from '@/lib/db/connection';
import { organizerRepository } from '@/repositories';
import { headers } from 'next/headers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userId: string;
  try {
    await connectToDatabase();
    const auth = await requireAuth();
    userId = auth.userId;
  } catch (error) {
    redirect('/login');
  }

  // We can also fetch organizer state to enforce onboarding,
  // but let's allow access to /onboarding page if no organizer.
  const organizer = await organizerRepository.findOne({ ownerId: userId as any });
  const headersList = await headers();
  const currentPath = headersList.get('x-invoke-path') || '';

  // If there's no organizer and the user is NOT on the onboarding page, redirect to onboarding.
  // Note: headersList.get('x-invoke-path') might not always be reliable in App Router,
  // it's generally better to let the page components handle specific redirects.
  // We'll let page.tsx handle its own check if we want, or just wrap in DashboardShell.

  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}
