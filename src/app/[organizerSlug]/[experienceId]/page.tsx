import { connectToDatabase } from '@/lib/db/connection';
import { organizerRepository } from '@/repositories/organizer.repository';
import { experienceRepository } from '@/repositories/experience.repository';
import { scheduleRepository } from '@/repositories/schedule.repository';
import { reviewRepository } from '@/repositories/review.repository';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, Star, Shield, CalendarCheck, BadgeCheck, Flame } from 'lucide-react';
import BookingForm from '@/components/storefront/BookingForm';
import ImageGallery from '@/components/storefront/ImageGallery';
import { THEME_CONFIG } from '@/lib/theme';

export default async function ExperienceDetails({
  params,
}: {
  params: Promise<{ organizerSlug: string; experienceId: string }>;
}) {
  await connectToDatabase();
  
  const { organizerSlug, experienceId } = await params;
  const organizer = await organizerRepository.findBySlug(organizerSlug);
  if (!organizer) notFound();

  const experience = await experienceRepository.findById(organizer._id as any, experienceId);
  if (!experience) notFound();

  const now = new Date();
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); // Start of today to include all of today's schedules
  
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3);

  const schedules = await scheduleRepository.findAvailableSlots(
    organizer._id as any,
    experience._id as any,
    startDate,
    futureDate
  );

  const availableSchedules = schedules.filter(s => s.capacity > s.bookedCount && new Date(s.endAt) > now);

  const reviews = await reviewRepository.findMany(organizer._id as any, { experienceId: experience._id as any });
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : null;

  const images = experience.images || [];
  const themeVars = THEME_CONFIG[(organizer as any).theme || 'terracotta'] || THEME_CONFIG.terracotta;

  // Compute minimum spots left across all schedules for FOMO
  const minSpotsLeft = availableSchedules.length > 0 
    ? Math.min(...availableSchedules.map(s => s.capacity - s.bookedCount))
    : null;
  const showFomo = minSpotsLeft !== null && minSpotsLeft <= 5;

  const priceInRupees = experience.price / 100;

  return (
    <main className="w-full min-h-screen bg-[var(--bg-main)]" style={themeVars as React.CSSProperties}>
      {/* Top nav bar */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-main)] opacity-95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <Link
            href={`/${organizerSlug}`}
            className="inline-flex items-center text-sm text-[var(--text-light)] hover:text-[var(--text-main)] transition-colors font-medium gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            {organizer.name}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-7 space-y-10">

            {/* Image Gallery */}
            <ImageGallery images={images} title={experience.title} />

            {/* Organizer pill */}
            <div className="flex items-center gap-3">
              {organizer.avatar ? (
                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[var(--border)]">
                  <Image src={organizer.avatar} alt={organizer.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-[var(--text-main)] flex items-center justify-center text-[var(--bg-main)] text-sm font-semibold shrink-0">
                  {organizer.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-[var(--text-main)]">{organizer.name}</span>
                  <BadgeCheck className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <p className="text-xs text-[var(--text-light)]">Verified Host</p>
              </div>
              {avgRating && (
                <div className="ml-auto flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3.5 h-3.5 ${parseFloat(avgRating) >= i ? 'fill-amber-400 text-amber-400' : 'text-amber-200'}`} />
                  ))}
                  <span className="text-xs font-semibold text-amber-800 ml-0.5">{avgRating}</span>
                  <span className="text-xs text-amber-600">({reviews.length})</span>
                </div>
              )}
            </div>

            {/* Title + FOMO */}
            <div className="space-y-3">
              {showFomo && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-red-700">
                    Only {minSpotsLeft} spot{minSpotsLeft === 1 ? '' : 's'} left — filling fast
                  </span>
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-main)] leading-tight">
                {experience.title}
              </h1>
            </div>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] px-4 py-2 rounded-full text-sm text-[var(--text-muted)]">
                <Clock className="w-4 h-4 text-[var(--accent)]" />
                {experience.duration >= 60 
                  ? `${Math.floor(experience.duration / 60)}h${experience.duration % 60 > 0 ? ` ${experience.duration % 60}m` : ''}` 
                  : `${experience.duration}m`}
              </div>
              <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] px-4 py-2 rounded-full text-sm text-[var(--text-muted)]">
                <MapPin className="w-4 h-4 text-[var(--accent)]" />
                <span className="capitalize">{experience.location.type === 'physical' ? 'In-person' : 'Online'}</span>
              </div>
              {experience.tags?.map((tag: string) => (
                <div key={tag} className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] px-4 py-2 rounded-full text-sm text-[var(--text-muted)]">
                  {tag}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#edeae4]" />

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-[var(--text-main)]">About this experience</h2>
              <p className="text-[var(--text-muted)] leading-relaxed text-base font-light whitespace-pre-wrap">
                {experience.description}
              </p>
            </div>

            {/* Location (If present) */}
            {experience.location?.address && (
              <>
                <div className="h-px bg-[#edeae4]" />
                <div className="space-y-4">
                  <h2 className="text-xl font-serif text-[var(--text-main)]">Location</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border)]">
                    <div className="p-3 bg-[var(--accent)]/10 rounded-xl">
                      <MapPin className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[var(--text-main)] font-medium">Venue Address</p>
                      <p className="text-[var(--text-muted)] text-sm">{experience.location.address}</p>
                    </div>
                    {experience.location.mapUrl && (
                      <a 
                        href={experience.location.mapUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] text-sm font-medium rounded-full hover:bg-[var(--accent)] hover:text-white hover:border-[var(--accent)] transition-all whitespace-nowrap"
                      >
                        <MapPin className="w-4 h-4" />
                        Get Directions
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-4 py-8 border-t border-b border-[var(--border)]">
              <div className="text-center space-y-2">
                <div className="w-10 h-10 mx-auto bg-[#f5f2ee] rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <p className="text-xs font-semibold text-[var(--text-main)]">Secure Payment</p>
                <p className="text-xs text-[var(--text-light)]">Razorpay encrypted</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-10 h-10 mx-auto bg-[#f5f2ee] rounded-full flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <p className="text-xs font-semibold text-[var(--text-main)]">Instant Confirmation</p>
                <p className="text-xs text-[var(--text-light)]">Ticket via email</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-10 h-10 mx-auto bg-[#f5f2ee] rounded-full flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <p className="text-xs font-semibold text-[var(--text-main)]">Verified Host</p>
                <p className="text-xs text-[var(--text-light)]">Identity confirmed</p>
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-serif text-[var(--text-main)]">Reviews</h2>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-[var(--text-main)]">{avgRating}</span>
                    <span className="text-sm text-[var(--text-light)]">· {reviews.length} reviews</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review: any) => (
                    <div key={review._id.toString()} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--text-main)]">
                            {review.customerName?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-[var(--text-main)]">{review.customerName}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className={`w-3 h-3 ${review.rating >= i ? 'fill-amber-400 text-amber-400' : 'text-[#e0dbd3]'}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">"{review.comment}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN: Sticky Booking Card ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-20">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Card header */}
                <div className="p-6 border-b border-[var(--border)]">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-[var(--text-main)] font-serif">
                        ₹{priceInRupees.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-[var(--text-light)] mt-0.5">per person</p>
                    </div>
                    {showFomo && (
                      <div className="flex items-center gap-1.5 text-red-600">
                        <Flame className="w-4 h-4" />
                        <span className="text-xs font-semibold">{minSpotsLeft} spots left</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking form */}
                <BookingForm
                  organizerId={organizer._id.toString()}
                  experienceId={experience._id.toString()}
                  schedules={JSON.parse(JSON.stringify(availableSchedules))}
                  price={experience.price}
                  offers={JSON.parse(JSON.stringify(experience.offers || []))}
                  razorpayEnabled={!!(organizer.paymentSettings as any)?.razorpayKeyId && ((organizer.paymentSettings as any)?.acceptedMethods === 'both' || (organizer.paymentSettings as any)?.acceptedMethods === 'razorpay' || !(organizer.paymentSettings as any)?.acceptedMethods)}
                  manualPaymentEnabled={((organizer.paymentSettings as any)?.acceptedMethods === 'both' || (organizer.paymentSettings as any)?.acceptedMethods === 'manual' || !(organizer.paymentSettings as any)?.acceptedMethods)}
                  manualPaymentUpiId={(organizer.paymentSettings as any)?.manualPaymentUpiId || ''}
                  manualPaymentQrCodeUrl={(organizer.paymentSettings as any)?.manualPaymentQrCodeUrl || ''}
                  manualPaymentLink={(organizer.paymentSettings as any)?.manualPaymentLink || ''}
                />

                {/* Bottom trust strip */}
                <div className="px-6 pb-5 grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-4">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Shield className="w-4 h-4 text-[var(--text-light)]" />
                    <span className="text-[10px] text-[var(--text-light)]">Secure</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <CalendarCheck className="w-4 h-4 text-[var(--text-light)]" />
                    <span className="text-[10px] text-[var(--text-light)]">Instant</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <BadgeCheck className="w-4 h-4 text-[var(--text-light)]" />
                    <span className="text-[10px] text-[var(--text-light)]">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
