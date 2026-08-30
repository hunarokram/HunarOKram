import { connectToDatabase } from '@/lib/db/connection';
import { organizerRepository } from '@/repositories/organizer.repository';
import { experienceRepository } from '@/repositories/experience.repository';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function DomainStorefront({
  params,
}: {
  params: Promise<{ hostname: string }>;
}) {
  await connectToDatabase();
  
  const { hostname } = await params;
  const organizer = await organizerRepository.findOne({ 'customDomain.hostname': hostname });
  
  if (!organizer) {
    notFound();
  }

  // Fetch published experiences
  const experiences = await experienceRepository.findMany(organizer._id as any, { status: 'published' });

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/storefront_banner.jpg"
            alt={`${organizer.name} banner`}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4 tracking-tight">
            {organizer.name}
          </h1>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2d2a26]">Curated Experiences</h2>
            <p className="text-[#686662] mt-3 max-w-xl text-lg font-light">
              Discover and book workshops and events crafted with care.
            </p>
          </div>
        </div>

        {experiences.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#686662] text-xl font-serif italic">No experiences available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {experiences.map((experience) => (
              <Link 
                key={String(experience._id)} 
                href={`/${experience._id}`}
                className="group block"
              >
                <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-[#ebe9e4]">
                  <Image
                    src={experience.images?.[0] || '/images/experience_thumbnail.jpg'}
                    alt={experience.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-2xl font-serif text-[#2d2a26] mb-2 group-hover:text-[#a37e5c] transition-colors">
                    {experience.title}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-[#686662] font-light truncate mr-4 capitalize">
                      {experience.duration} mins • {experience.location.type}
                    </p>
                    <p className="text-lg font-medium text-[#2d2a26]">
                      {experience.price === 0 ? 'Free' : `₹${(experience.price / 100).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
