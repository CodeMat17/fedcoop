"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { YouTubeVideo } from "./youtube-video";
import { VideoModal } from "./video-modal";
import { VideoEvent } from "@/lib/video-types";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export const VideoGrid = () => {
  const videoEvents = useQuery(api.videoEvents.getVideoEvents);
  const [selectedVideo, setSelectedVideo] = useState<VideoEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const extractVideoId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  // FIXED: Show all videos by default, only filter when searchTerm is not empty
 const filteredVideos = searchTerm 
  ? videoEvents?.filter(video => 
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : videoEvents; 
  

  if (videoEvents === undefined) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900'>
        <div className='flex items-center gap-3 text-white/60'>
          <Loader2 className='w-6 h-6 animate-spin' />
          <span>Loading amazing videos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
      {/* Header */}
      <motion.div
        className='text-center mb-12'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        <h1 className='font-semibold text-2xl  mb-4'>
          Video Gallery
        </h1>
        
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className='max-w-2xl mx-auto mb-12'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5' />
          <Input
            type='text'
            placeholder='Search videos by name...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 pr-4 py-5 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50'
          />
        </div>
      </motion.div>

      {/* Video Grid */}
      <motion.div className='max-w-7xl mx-auto' layout>
        <AnimatePresence mode='wait'>
          {filteredVideos && filteredVideos.length > 0 ? (
            <motion.div
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}>
              <AnimatePresence>
                {filteredVideos.map((video, index) => {
                  const videoId = extractVideoId(video.videoUrl);
                  if (!videoId) return null;

                  return (
                    <motion.div
                      key={video._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      layoutId={`video-${videoId}`}>
                      <YouTubeVideo
                        videoId={videoId}
                        title={video.description}
                        description={video.description}
                        date={video.date}
                        onVideoClick={() => setSelectedVideo(video)}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className='text-center py-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <div className='text-white/40 text-lg'>
                {searchTerm
                  ? "No videos found matching your search."
                  : "No videos available yet."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  );
};
