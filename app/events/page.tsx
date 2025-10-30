"use client";

import { motion } from "framer-motion";

import { MobileFriendlyGallery } from "@/components/ui/mobile-friendly-gallery";
import { VideoGrid } from "@/components/video-grid";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";

const EventsPage = () => {
  const gallery = useQuery(api.gallery.getAll);

  return (
    <section className='pt-24 pb-16 bg-gradient-to-b from-background to-muted/20'>
      <div className='w-full max-w-7xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
            Our Events Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
            Immerse yourself in the vibrant moments and memorable events that
            define our cooperative community journey.
          </motion.p>
        </div>

        {gallery === undefined ? (
          <div className='flex items-center justify-center py-32'>
            <Loader2 className='w-6 h-6 animate-spin mr-3' />
            <span className='text-muted-foreground'>
              Loading beautiful moments...
            </span>
          </div>
        ) : gallery.length === 0 ? (
          <div className='text-center py-32'>
            <div className='text-muted-foreground text-lg'>
              No events to display yet. Check back soon!
            </div>
          </div>
        ) : (
          // <GalleryGrid gallery={gallery} />
          <MobileFriendlyGallery gallery={gallery} />
        )}
      </div>

      <div>
        <VideoGrid />
      </div>
    </section>
  );
};

export default EventsPage;
