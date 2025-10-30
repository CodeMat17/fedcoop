"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Calendar, Clock } from "lucide-react";
import { YouTubeVideoProps } from "@/lib/video-types";
import { useState } from "react";

export const YouTubeVideo = ({
  videoId,
  title,
  date,
  onVideoClick,
}: YouTubeVideoProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Fallback to lower quality thumbnail if maxresdefault fails
  const getThumbnailUrl = () => {
    if (imageError) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <motion.div
      className='group relative cursor-pointer overflow-hidden rounded-2xl  border  shadow-2xl'
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onVideoClick}
      layoutId={`video-${videoId}`}>
      {/* Thumbnail Container */}
      <div className='relative aspect-video overflow-hidden'>
        <div className='w-full h-full relative'>
          <Image
            src={getThumbnailUrl()}
            alt={title}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
            className='object-cover transition-all duration-500 group-hover:scale-110'
            onError={handleImageError}
            onLoad={handleImageLoad}
            priority={false} // Set to true for above-the-fold images
            placeholder='blur'
            blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
          />

          {/* Loading overlay */}
          {imageLoading && (
            <div className='absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center'>
              <div className='w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin' />
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300' />

        {/* Play Button */}
        <motion.div
          className='absolute inset-0 flex items-center justify-center'
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}>
          <div className='relative'>
            <div className='absolute inset-0 bg-white/20 rounded-full scale-150 group-hover:scale-110 transition-transform duration-300' />
            <div className='relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4 group-hover:bg-red-500 group-hover:border-red-400 transition-all duration-300'>
              <Play className='w-6 h-6 text-white fill-white group-hover:fill-white ml-1' />
            </div>
          </div>
        </motion.div>

        {/* Date Badge */}
        <div className='absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10'>
          <div className='flex items-center gap-1.5 text-xs text-white/80'>
            <Calendar className='w-3 h-3' />
            <span>{formatDate(date)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4 space-y-3'>
        <h3 className='font-medium line-clamp-2 transition-colors'>
          {title}
        </h3>


        {/* Video Duration Simulator */}
        <div className='flex items-center justify-between pt-2'>
          <div className='flex items-center gap-1 text-xs'>
            <Clock className='w-3 h-3' />
            <span>2:45</span>
          </div>
          <div className='text-xs'>YouTube</div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />
    </motion.div>
  );
};
