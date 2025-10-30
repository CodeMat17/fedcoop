"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Edit2,
  Trash2,
  Play,
  Calendar,
  ExternalLink,
  Youtube,
} from "lucide-react";
import { VideoEvent } from "@/lib/video-types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface AdminVideoCardProps {
  video: VideoEvent;
  onEdit: (video: VideoEvent) => void;
  onDelete: (videoId: string) => void;
  onPreview: (video: VideoEvent) => void;
}

export const AdminVideoCard = ({
  video,
  onEdit,
  onDelete,
  onPreview,
}: AdminVideoCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const extractVideoId = (url: string): string | null => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const videoId = extractVideoId(video.videoUrl);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Get the appropriate thumbnail URL with fallbacks
  const getThumbnailUrl = () => {
    if (!videoId) return null;

    if (imageError) {
      // Final fallback - hqdefault always exists
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }

    // Try maxresdefault first, then fallback to hqdefault
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const thumbnailUrl = getThumbnailUrl();

  return (
    <motion.div
      className='group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden'
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 },
      }}
      layout>
      {/* Thumbnail */}
      <div
        className='relative aspect-video overflow-hidden cursor-pointer'
        onClick={() => onPreview(video)}>
        {videoId && thumbnailUrl ? (
          <div className='w-full h-full relative'>
            <Image
              src={thumbnailUrl}
              alt={video.description}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
              className='object-cover transition-all duration-500 group-hover:scale-110'
              onError={handleImageError}
              onLoad={handleImageLoad}
              priority={false}
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
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center'>
            <Youtube className='w-12 h-12 text-white/20' />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300' />

        {/* Play Button */}
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 group-hover:bg-red-500 group-hover:border-red-400 transition-all duration-300'>
            <Play className='w-6 h-6 text-white fill-white ml-0.5' />
          </div>
        </div>

        {/* Date Badge */}
        <div className='absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10'>
          <div className='flex items-center gap-1.5 text-xs text-white/80'>
            <Calendar className='w-3 h-3' />
            <span>{formatDate(video.date)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4 space-y-3'>
        <h3 className='font-semibold text-white line-clamp-2 text-sm'>
          {video.description}
        </h3>

        <div className='flex items-center justify-between pt-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => window.open(video.videoUrl, "_blank")}
            className='text-xs text-white/60 hover:text-white hover:bg-white/10'>
            <ExternalLink className='w-3 h-3 mr-1' />
            YouTube
          </Button>

          <div className='flex items-center gap-1'>
            {/* Edit Button */}
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onEdit(video)}
              className='h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20'>
              <Edit2 className='w-3 h-3' />
            </Button>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20'>
                  <Trash2 className='w-3 h-3' />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='bg-gray-900 border-white/10'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-white'>
                    Delete Video
                  </AlertDialogTitle>
                  <AlertDialogDescription className='text-white/60'>
                    Are you sure you want to delete this video? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className='bg-white/5 border-white/10 text-white hover:bg-white/10'>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(video._id)}
                    className='bg-red-600 text-white hover:bg-red-700'>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />
    </motion.div>
  );
};
