"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Gallery {
  _id: string;
  image: string;
  imageUrl: string;
  description: string;
}

interface GalleryCarouselProps {
  gallery: Gallery[];
}

export function EventCarousel({ gallery }: GalleryCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 100 }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className='relative h-[500px] md:h-[450px] lg:h-[450px] w-full overflow-hidden rounded-lg shadow-2xl'>
      <style jsx>{`
        .embla {
          overflow: hidden;
        }
        .embla__container {
          display: flex;
        }
        .embla__slide {
          flex: 0 0 100%;
          min-width: 0;
        }
      `}</style>

      <div ref={emblaRef} className='embla h-full w-full '>
        <div className='embla__container h-full'>
          {gallery.map((event, index) => (
            <div key={event._id} className='embla__slide relative h-full'>
              {/* Background image */}
              <div className='absolute inset-0 transform transition-transform duration-1000 hover:scale-105'>
                <Image
                  src={event.imageUrl}
                  alt={event._id}
                  fill
                  priority={index === 0}
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
                />
              </div>

              {/* Gradient overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

              {/* Slide counter */}
              <div className='absolute top-6 left-6 flex items-center z-10'>
                <div className='text-6xl font-bold text-white drop-shadow-2xl'>
                  {String(selectedIndex + 1).padStart(2, "0")}
                </div>
                <div className='h-px w-16 bg-amber-400 mx-4 shadow-lg' />
                <div className='text-lg font-light text-white drop-shadow-xl'>
                  {String(gallery.length).padStart(2, "0")}
                </div>
              </div>

              {/* Description */}
              <div className='absolute bottom-6 left-0 right-0 z-10 max-w-2xl text-sm px-4'>
                <p className='text-white text-center text-shadow-amber-400 drop-shadow-2xl bg-black/5 backdrop-blur-sm rounded-lg px-2 py-1'>
                  {event.description ||
                    "Join us for our upcoming cooperative events and activities that strengthen our community bonds."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => emblaApi && emblaApi.scrollNext()}
        className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full z-10 transition-all duration-300 shadow-lg'>
        <ChevronLeft size={28} strokeWidth={1.5} />
      </button>
      <button
        onClick={() => emblaApi && emblaApi.scrollPrev()}
        className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full z-10 transition-all duration-300 shadow-lg'>
        <ChevronRight size={28} strokeWidth={1.5} />
      </button>
    </div>
  );
}
