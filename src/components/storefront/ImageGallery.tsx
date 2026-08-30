'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // If no images, render fallback
  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[500px] rounded-2xl overflow-hidden bg-[var(--border)] flex items-center justify-center">
        <div className="text-center space-y-2 opacity-30">
          <div className="w-16 h-16 mx-auto border-2 border-[var(--text-main)] rounded-full flex items-center justify-center">
            <span className="text-2xl">📷</span>
          </div>
        </div>
      </div>
    );
  }

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomed) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsZoomed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, images.length]);

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image View */}
      <div 
        className="group relative w-full h-[320px] sm:h-[420px] lg:h-[500px] rounded-2xl overflow-hidden bg-[var(--border)] cursor-pointer"
        onClick={() => setIsZoomed(true)}
      >
        <Image 
          src={images[currentIndex] as string} 
          alt={`${title} - Image ${currentIndex + 1}`} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
          priority 
        />
        
        {/* Zoom Icon overlay */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-5 h-5" />
        </div>

        {/* Arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Row */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-[45%] sm:w-[30%] lg:w-[25%] h-[120px] sm:h-[140px] lg:h-[160px] rounded-xl overflow-hidden snap-center transition-all ${
                currentIndex === idx ? 'ring-2 ring-[var(--brand)] opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${title} - Thumbnail ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Close Button */}
          <button 
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 z-[110] w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Lightbox Image */}
          <div className="relative w-full max-w-6xl h-[80vh] mx-4 sm:mx-10" onClick={() => setIsZoomed(false)}>
            <Image 
              src={images[currentIndex] as string} 
              alt={`${title} - Zoomed Image ${currentIndex + 1}`} 
              fill 
              className="object-contain" 
              priority 
            />
          </div>

          {/* Lightbox Arrows */}
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-[110]"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-[110]"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium tracking-widest">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
