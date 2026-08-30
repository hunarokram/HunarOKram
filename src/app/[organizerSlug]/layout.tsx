import { connectToDatabase } from '@/lib/db/connection';
import { organizerRepository } from '@/repositories/organizer.repository';
import { notFound } from 'next/navigation';

export default async function OrganizerStorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizerSlug: string }>;
}) {
  await connectToDatabase();
  
  const { organizerSlug } = await params;
  const organizer = await organizerRepository.findBySlug(organizerSlug);
  
  if (!organizer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2d2a26] font-sans antialiased">
      {children}
    </div>
  );
}
