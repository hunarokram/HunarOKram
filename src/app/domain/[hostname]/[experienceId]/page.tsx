import { connectToDatabase } from '@/lib/db/connection';
import { organizerRepository } from '@/repositories/organizer.repository';
import { experienceRepository } from '@/repositories/experience.repository';
import { scheduleRepository } from '@/repositories/schedule.repository';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Users } from 'lucide-react';
import BookingForm from '@/components/storefront/BookingForm';

export default async function DomainExperienceDetails({
  params,
}: {
  params: Promise<{ hostname: string; experienceId: string }>;
}) {
  await connectToDatabase();
  
  const { hostname, experienceId } = await params;
  const organizer = await organizerRepository.findOne({ 'customDomain.hostname': hostname });
  if (!organizer) notFound();

  const experience = await experienceRepository.findById(organizer._id as any, experienceId);
  if (!experience) notFound();

  // Fetch future schedules
  const now = new Date();
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3); // next 3 months

  const schedules = await scheduleRepository.findAvailableSlots(
    organizer._id as any,
    experience._id as any,
    now,
    futureDate
  );

  // Filter out full schedules
  const availableSchedules = schedules.filter(s => s.capacity > s.bookedCount);

  return (
    <main className="w-full min-h-screen bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link 
          href={`/`}
          className="inline-flex items-center text-[#686662] hover:text-[#2d2a26] transition-colors mb-8 md:mb-12 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {organizer.name}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative aspect-[4/3] w-full mb-10 bg-[#ebe9e4] overflow-hidden">
              <Image
                src={experience.images?.[0] || '/images/experience_thumbnail.jpg'}
                alt={experience.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-[#2d2a26] mb-6 leading-tight">
              {experience.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-[#ebe9e4]">
              <div className="flex items-center text-[#686662]">
                <Clock className="w-5 h-5 mr-3 text-[#a37e5c]" />
                <span className="text-lg">{experience.duration} minutes</span>
              </div>
              <div className="flex items-center text-[#686662]">
                <MapPin className="w-5 h-5 mr-3 text-[#a37e5c]" />
                <span className="text-lg capitalize">{experience.location.type}</span>
              </div>
              <div className="flex items-center text-[#686662]">
                <Users className="w-5 h-5 mr-3 text-[#a37e5c]" />
                <span className="text-lg">Group Experience</span>
              </div>
            </div>

            <div className="prose prose-lg prose-p:text-[#686662] prose-headings:font-serif prose-headings:text-[#2d2a26] max-w-none">
              <h2 className="text-2xl font-serif text-[#2d2a26] mb-4">About this experience</h2>
              <div className="text-[#686662] leading-relaxed whitespace-pre-wrap font-light">
                {experience.description}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-12">
              <BookingForm 
                organizerId={organizer._id.toString()}
                experienceId={experience._id.toString()}
                schedules={JSON.parse(JSON.stringify(availableSchedules))}
                price={experience.price}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
