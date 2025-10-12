"use client";

import { EventCarousel } from "@/components/ui/event-carousel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Minus } from "lucide-react";


export function EventGallerySection() {
  const gallery = useQuery(api.gallery.getAll);

  return (
    <section className='py-16 bg-background'>
      <div className='w-full max-w-6xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight mb-4'>
            Our Events & Activities
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Explore our recent events, conferences, and activities that bring
            our cooperative community together and drive positive change.
          </p>
        </div>

        {gallery === undefined ? (
          <div className='flex items-center justify-center py-32'>
            <Minus className='w-4 h-4 animate-spin mr-2' />
            Loading gallery...
          </div>
        ) : (
            gallery.length === 0 ? <div className="text-center py-32">No event items found</div> : 
          <div>
            <EventCarousel gallery={gallery} />

            <div className='text-center mt-12'>
              <p className='text-sm text-muted-foreground'>
                Stay updated with our upcoming events and join our growing
                cooperative community.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
