// components/ui/mobile-friendly-gallery.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GalleryItem {
  _id: string;
  image: string;
  imageUrl: string | null;
  description: string;
}

interface MobileFriendlyGalleryProps {
  gallery: GalleryItem[];
}

export function MobileFriendlyGallery({ gallery }: MobileFriendlyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const validGallery = gallery.filter((item) => item.imageUrl);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validGallery.length);
  }, [validGallery.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + validGallery.length) % validGallery.length
    );
  }, [validGallery.length]);

  useEffect(() => {
    if (!isPlaying || validGallery.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, validGallery.length]);

  if (validGallery.length === 0) {
    return (
      <div className='text-center py-20'>
        <div className='text-muted-foreground'>No images available</div>
      </div>
    );
  }

  return (
    <div className='relative w-full max-w-4xl mx-auto'>
      {/* Main Carousel - Better Mobile Height */}
      <div className='relative h-[70vh] sm:h-[75vh] md:h-[80vh] rounded-xl overflow-hidden shadow-2xl bg-gray-100'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className='absolute inset-0'>
            <Image
              src={validGallery[currentIndex].imageUrl!}
              alt={validGallery[currentIndex].description}
              fill
              className='object-cover'
              priority
              sizes='100vw'
            />

            {/* Optimized Gradient Overlay for Mobile */}
            <div className='absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80' />
            <div className='absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent' />

            {/* Content - Mobile Optimized */}
            <div className='absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white'>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='space-y-3'>
                {/* Progress & Counter */}
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2 text-sm'>
                    <span className='font-semibold text-amber-300'>
                      {currentIndex + 1} / {validGallery.length}
                    </span>
                  </div>
                  {validGallery.length > 1 && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 px-3 text-xs bg-black/40 backdrop-blur-sm hover:bg-black/60'
                      onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                  )}
                </div>

                {/* Description */}
                <h3 className='text-lg sm:text-xl md:text-2xl font-bold leading-tight line-clamp-3'>
                  {validGallery[currentIndex].description}
                </h3>

                {/* Additional Context */}
                <p className='text-xs sm:text-sm text-gray-200 opacity-90 leading-relaxed'>
                  Swipe to explore more events and community moments
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation - Better Mobile Touch Targets */}
        {validGallery.length > 1 && (
          <>
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-0 shadow-xl'
              onClick={prevSlide}>
              <ChevronLeft className='h-5 w-5 sm:h-6 sm:w-6' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-0 shadow-xl'
              onClick={nextSlide}>
              <ChevronRight className='h-5 w-5 sm:h-6 sm:w-6' />
            </Button>
          </>
        )}

        {/* Progress Bar */}
        {validGallery.length > 1 && isPlaying && (
          <motion.div
            className='absolute top-0 left-0 right-0 h-1 bg-amber-400 z-10'
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            key={currentIndex}
          />
        )}
      </div>

      {/* Mobile-Friendly Dots */}
      {validGallery.length > 1 && (
        <div className='flex justify-center gap-2 mt-4 px-4'>
          {validGallery.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 flex-1 max-w-12",
                index === currentIndex
                  ? "bg-amber-400"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
