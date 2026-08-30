import { connectToDatabase } from '@/lib/db/connection';
import { organizerRepository } from '@/repositories/organizer.repository';
import { experienceRepository } from '@/repositories/experience.repository';
import { reviewRepository } from '@/repositories/review.repository';
import { scheduleRepository } from '@/repositories/schedule.repository';
import { bookingRepository } from '@/repositories/booking.repository';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BadgeCheck, Star, Clock, MapPin, Users, ArrowRight, Quote, 
  Share2, Mail, MessageCircle, Calendar, CalendarCheck, Heart, 
  Smile
} from 'lucide-react';
import { TestimonialCarousel } from '@/components/ui/testimonial-carousel';
import { ViewTracker } from '@/components/marketing/view-tracker';

import { THEME_CONFIG } from '@/lib/theme';

export default async function OrganizerStorefront({
  params,
}: {
  params: Promise<{ organizerSlug: string }>;
}) {
  await connectToDatabase();
  
  const { organizerSlug } = await params;
  const organizer = await organizerRepository.findBySlug(organizerSlug);
  if (!organizer) notFound();

  const themeVars = THEME_CONFIG[(organizer as any).theme || 'terracotta'] || THEME_CONFIG.terracotta;

  const experiences = await experienceRepository.findMany(organizer._id as any, { status: 'published' });
  const pastExperiences = await experienceRepository.findMany(organizer._id as any, { status: 'past' });

  // Aggregate all reviews
  const allReviews = await reviewRepository.findMany(organizer._id as any, {});
  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1)
    : null;

  // Fetch schedules
  const now = new Date();
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3);

  const experiencesWithSchedules = await Promise.all(
    experiences.map(async (exp) => {
      const schedules = await scheduleRepository.findAvailableSlots(
        organizer._id as any,
        exp._id as any,
        now,
        futureDate
      );
      const available = schedules.filter(s => s.capacity > s.bookedCount);
      const nearest = available.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())[0];
      const minSpots = nearest ? nearest.capacity - nearest.bookedCount : null;
      return { exp, nearest, minSpots };
    })
  );

  const confirmedBookings = await bookingRepository.findMany(organizer._id as any, { status: 'confirmed' });
  const realBookingCount = confirmedBookings.length;
  const pastCustomersCount = (organizer as any).pastCustomersCount || 0;
  const totalCustomers = realBookingCount + pastCustomersCount;
  
  const desktopHero = (organizer as any).coverImage || null;
  const mobileHero = (organizer as any).mobileCoverImage || desktopHero || null;
  const avatarImage = (organizer as any).avatar || null;
  const organizerInitial = organizer.name.charAt(0).toUpperCase();

  return (
    <main className="w-full min-h-screen bg-[var(--bg-main)] font-sans" style={themeVars as React.CSSProperties}>
      <ViewTracker slug={organizer.slug} />
      {/* 🔹 HERO SECTION 🔹 */}
      <section className="relative w-full aspect-[4/3] md:aspect-auto md:h-[70vh] min-h-[350px] md:min-h-0 flex flex-col justify-between overflow-hidden rounded-b-[40px] md:rounded-b-[64px]">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[var(--grad-1)] via-[var(--grad-2)] to-[var(--grad-3)]">
          {desktopHero && (
            <Image src={desktopHero} alt={organizer.name} fill className="hidden md:block object-cover object-center" priority />
          )}
          {mobileHero && (
            <Image src={mobileHero} alt={organizer.name} fill className="block md:hidden object-cover object-center" priority />
          )}
          {/* Overlay to darken image for text readability */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        {/* Top Nav (Logo & Share) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-6 flex justify-end items-center">
          <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md transition border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Hero Content (Removed Brand Name as requested) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-28">
          {/* Cover is now purely visual */}
        </div>
      </section>

      {/* ── ORGANIZER FLOATING BIO CARD ── */}
      <section className="relative z-20 max-w-5xl mx-auto px-4 md:px-6 -mt-[40px] md:-mt-[60px] mb-12 md:mb-20">
        <div className="relative bg-[var(--bg-main)] rounded-[24px] md:rounded-[32px] p-6 md:p-10 flex flex-col gap-5">
          
          {/* Top row: Avatar + Text side by side */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8">
            {/* Avatar */}
            <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-3xl md:text-5xl font-serif shadow-sm overflow-hidden border-2 border-[var(--border)]">
              {avatarImage ? (
                <Image src={avatarImage} alt={organizer.name} width={112} height={112} className="object-cover w-full h-full" />
              ) : (
                organizer.name.charAt(0).toUpperCase()
              )}
            </div>

            {/* Brand Name & Bio text */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-serif text-[var(--text-main)] tracking-tight leading-none mb-3">
                {organizer.name}
              </h1>
              {organizer.bio ? (
                <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed max-w-3xl">
                  {organizer.bio}
                </p>
              ) : (
                <p className="text-[var(--text-light)] text-sm md:text-base italic">
                  Crafting memorable experiences and workshops.
                </p>
              )}
            </div>
          </div>

          {/* Stats Row */}
          {(totalCustomers > 0 || avgRating || experiences.length > 0) && (
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[var(--text-muted)] border-t border-[var(--border)] pt-4">
              {totalCustomers > 0 && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[var(--brand)]" />
                  <span className="font-semibold text-[var(--text-main)] text-sm">{totalCustomers}+</span>
                  <span className="text-xs text-[var(--text-light)]">Happy Customers</span>
                </div>
              )}
              {avgRating && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-[var(--text-main)] text-sm">{avgRating}</span>
                  <span className="text-xs text-[var(--text-light)]">Avg Rating</span>
                </div>
              )}
              {experiences.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-[var(--accent)]" />
                  <span className="font-semibold text-[var(--text-main)] text-sm">{experiences.length}</span>
                  <span className="text-xs text-[var(--text-light)]">Experiences</span>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <a 
            href={`mailto:${organizer.contact?.email}`}
            className="flex justify-center items-center gap-2 bg-[var(--brand)] hover:bg-[var(--brand-hover)] transition-colors text-white w-full px-6 py-3 rounded-xl font-medium text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Host
          </a>
        </div>
      </section>

      {/* ── EXPERIENCES GRID ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 mt-8 md:mt-24 mb-16 md:mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-14">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[var(--accent)]" />
              <p className="text-xs font-bold tracking-widest uppercase text-[var(--accent)]">Workshops & Events</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--text-main)] mb-2">Upcoming Workshops & Events</h2>
            <p className="text-[var(--text-muted)] text-sm md:text-lg">Discover and book amazing experiences</p>
          </div>
        </div>

        {experiences.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-[var(--border)] rounded-3xl bg-[var(--bg-card)]">
            <p className="text-[var(--text-light)] text-lg font-serif italic">No experiences available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiencesWithSchedules.map(({ exp, nearest }, idx) => {
              const priceStr = exp.price === 0 ? 'Free' : `₹${(exp.price / 100).toLocaleString('en-IN')}`;
              const durationStr = exp.duration >= 60
                ? `${Math.floor(exp.duration / 60)}h${exp.duration % 60 > 0 ? ` ${exp.duration % 60}m` : ''}`
                : `${exp.duration}m`;
                
              const badgeLabels = ['POPULAR', 'FEATURED', 'NEW'];
              const badgeLabel = badgeLabels[idx % badgeLabels.length];

              return (
                <Link
                  key={String(exp._id)}
                  href={`/${organizerSlug}/${exp._id}`}
                  className="group bg-[var(--bg-card)] rounded-[24px] border border-[var(--border)] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--border)]">
                    {exp.images?.[0] ? (
                      <Image
                        src={exp.images[0]}
                        alt={exp.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--border)] to-[var(--bg-alt)]" />
                    )}
                    
                    {/* Top Left Badge */}
                    <div className="absolute top-4 left-4 bg-[var(--brand)] text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-md uppercase shadow-sm">
                      {badgeLabel}
                    </div>
                    
                    {/* Top Right Price */}
                    <div className="absolute top-4 right-4 bg-[var(--bg-card)] text-[var(--text-main)] text-sm font-bold px-3 py-1.5 rounded-md shadow-md">
                      {priceStr}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 md:p-6 flex flex-col flex-1">
                    <h3 className="text-xl md:text-2xl font-serif text-[var(--text-main)] mb-3 md:mb-4 group-hover:text-[var(--brand)] transition-colors leading-tight">
                      {exp.title}
                    </h3>

                    {/* Meta Row 1 */}
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3 text-xs md:text-sm text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--brand)]" />
                        {durationStr}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--brand)]" />
                        <span className="capitalize">{exp.location?.type === 'physical' ? 'In-Person' : 'Online'}</span>
                      </span>
                    </div>

                    {/* Meta Row 2 (Date) */}
                    {nearest && (
                      <div className="flex items-center gap-1.5 text-xs md:text-sm text-[var(--text-muted)] mb-4">
                        <CalendarCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-[var(--brand)]" />
                        Next: {new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(nearest.startAt))} • {new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(nearest.startAt))}
                      </div>
                    )}

                    {/* Description excerpt */}
                    <p className="text-sm text-[var(--text-light)] line-clamp-2 mb-6 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Footer Buttons */}
                    <div className="mt-auto flex items-center gap-3 w-full">
                      <div className="flex-1 flex items-center justify-between bg-[var(--bg-dark)] text-white text-sm font-semibold px-5 py-3 rounded-full group-hover:bg-[var(--brand)] transition-colors duration-300">
                        <span>Book Now</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── PAST EXPERIENCES ── */}
      {pastExperiences.length > 0 && (
        <section className="relative z-20 max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif text-[var(--text-main)] mb-2">Past Experiences</h2>
              <p className="text-[var(--text-muted)] text-sm md:text-lg">Look back at the incredible moments we've shared</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80 hover:opacity-100 transition-opacity duration-300">
            {pastExperiences.map((exp: any) => {
              const priceStr = exp.price === 0 ? 'Free' : `₹${(exp.price / 100).toLocaleString('en-IN')}`;
              const durationStr = exp.duration >= 60
                ? `${Math.floor(exp.duration / 60)}h${exp.duration % 60 > 0 ? ` ${exp.duration % 60}m` : ''}`
                : `${exp.duration}m`;
                
              return (
                <Link
                  key={exp._id.toString()}
                  href={`/${organizerSlug}/${exp._id}`}
                  className="group bg-[var(--bg-card)] rounded-[24px] border border-[var(--border)] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col grayscale-[50%] hover:grayscale-0"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {exp.images?.[0] ? (
                      <Image
                        src={exp.images[0]}
                        alt={exp.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--border)] to-[var(--bg-alt)]" />
                    )}
                    
                    {/* Top Left Badge */}
                    <div className="absolute top-4 left-4 bg-[var(--bg-dark)] text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-md uppercase shadow-sm">
                      COMPLETED
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {exp.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold text-[var(--text-main)] mb-2 line-clamp-1 group-hover:text-[var(--brand)] transition-colors">
                      {exp.title}
                    </h3>
                    
                    <p className="text-[var(--text-muted)] text-sm line-clamp-2 mb-6">
                      {exp.shortDescription || exp.description}
                    </p>

                    <div className="mt-auto flex flex-col gap-4">
                      <div className="flex items-center justify-between text-sm text-[var(--text-main)] font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[var(--text-light)]" />
                          {durationStr}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[var(--text-light)]" />
                          <span className="capitalize">{exp.location.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {allReviews.length > 0 && (
        <section className="relative bg-[var(--bg-alt)] py-12 md:py-20 mt-6 md:mt-10 overflow-hidden">
          {/* Subtle leaf/botanical deco */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--border)] rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--border)] rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3"></div>

          <div className="relative max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-14">
              <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
                <Quote className="w-4 h-4 text-[var(--accent)]" />
                <p className="text-xs font-bold tracking-widest uppercase text-[var(--accent)]">What People Say</p>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif text-[var(--text-main)]">Testimonials</h2>
              <div className="w-12 h-1 bg-[var(--accent)] mx-auto mt-4 md:mt-6 rounded-full"></div>
            </div>

            <TestimonialCarousel reviews={JSON.parse(JSON.stringify(allReviews))} />
          </div>
        </section>
      )}

      {/* ── STATS STRIP (Bottom) ── */}
      {(totalCustomers > 0 || allReviews.length > 0 || experiences.length > 0) && (
        <section className="bg-[var(--bg-dark)] text-white">
          <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {totalCustomers > 0 && (
              <div className="flex flex-col items-center justify-center text-center px-4 pt-6 md:pt-0">
                <Smile className="w-8 h-8 text-white/70 mb-3 opacity-80" />
                <p className="text-4xl font-serif text-white/90">{totalCustomers}+</p>
                <p className="text-sm text-white/70 mt-2 font-medium">Happy Customers</p>
              </div>
            )}
            {allReviews.length > 0 && (
              <div className="flex flex-col items-center justify-center text-center px-4 pt-6 md:pt-0">
                <Star className="w-8 h-8 text-white/70 mb-3 opacity-80" />
                <p className="text-4xl font-serif text-white/90">{avgRating}</p>
                <p className="text-sm text-white/70 mt-2 font-medium">Average Rating</p>
              </div>
            )}
            {experiences.length > 0 && (
              <div className="flex flex-col items-center justify-center text-center px-4 pt-6 md:pt-0">
                <Calendar className="w-8 h-8 text-white/70 mb-3 opacity-80" />
                <p className="text-4xl font-serif text-white/90">{experiences.length}</p>
                <p className="text-sm text-white/70 mt-2 font-medium">Experiences</p>
              </div>
            )}
          </div>
        </section>
      )}

    </main>
  );
}
