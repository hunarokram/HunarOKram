'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

export function TestimonialCarousel({ reviews }: { reviews: any[] }) {
  // Take up to 9 reviews
  const displayReviews = reviews.slice(0, 9);

  // Initialize Embla with loop enabled
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  if (displayReviews.length === 0) return null;

  return (
    <div className="relative w-full">
      <div className="relative flex items-center group">
        {/* Left Arrow */}
        <button 
          onClick={scrollPrev}
          className="hidden md:flex absolute -left-5 z-10 w-12 h-12 bg-white rounded-full shadow-md items-center justify-center text-gray-400 hover:text-[var(--brand)] transition opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Embla Viewport */}
        <div className="overflow-hidden w-full pb-4" ref={emblaRef}>
          <div className="flex touch-pan-y -ml-3">
            {displayReviews.map((review) => (
              <div 
                key={review._id?.toString() || Math.random().toString()} 
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.333%] pl-2 md:pl-3"
              >
                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[var(--border)] flex flex-col h-full">
                  <Quote className="w-5 h-5 md:w-6 md:h-6 text-[var(--brand)] fill-[var(--brand)] mb-3 md:mb-4 opacity-80" />
                  <p className="text-[#2c2a27] leading-relaxed text-sm md:text-xs italic font-medium flex-1 line-clamp-4">
                    "{review.comment || 'Amazing experience!'}"
                  </p>
                  <div className="flex items-center gap-2 mt-4 md:mt-3">
                    <div className="w-8 h-8 md:w-8 md:h-8 rounded-full bg-[var(--bg-alt)] flex items-center justify-center text-sm md:text-xs font-bold text-[var(--brand)] shrink-0">
                      {review.customerName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm md:text-xs font-bold text-[#2c2a27] truncate">
                        {review.customerName}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 md:w-3 md:h-3 ${review.rating >= i ? 'fill-amber-400 text-amber-400' : 'text-[#e0dbd3]'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button 
          onClick={scrollNext}
          className="hidden md:flex absolute -right-5 z-10 w-12 h-12 bg-white rounded-full shadow-md items-center justify-center text-gray-400 hover:text-[var(--brand)] transition opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dynamic Pagination Dots */}
      {scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === selectedIndex
                  ? 'w-6 h-2.5 bg-[var(--brand)]' 
                  : 'w-2.5 h-2.5 bg-[var(--border)] hover:bg-[var(--accent)]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
