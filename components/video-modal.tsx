"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  ExternalLink,
  Loader2,
  AlertTriangle, // Using AlertTriangle instead of CircleAlert
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VideoEvent } from "@/lib/video-types";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";

interface VideoModalProps {
  video: VideoEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

// Skeleton Components
const VideoPlayerSkeleton = () => (
  <div className='flex-1 relative min-h-0 bg-gray-800 animate-pulse'>
    <div className='absolute inset-0 flex items-center justify-center'>
      <Loader2 className='w-12 h-12 text-white/40 animate-spin' />
    </div>
  </div>
);

const VideoInfoSkeleton = () => (
  <div className='bg-gradient-to-t from-black/95 to-gray-900/95 backdrop-blur-sm border-t border-white/10 p-6 space-y-4'>
    <div className='space-y-3'>
      <div className='h-6 bg-white/10 rounded animate-pulse w-3/4'></div>
      <div className='h-4 bg-white/10 rounded animate-pulse w-1/2'></div>
      <div className='flex items-center gap-2'>
        <div className='w-4 h-4 bg-white/10 rounded animate-pulse'></div>
        <div className='h-4 bg-white/10 rounded animate-pulse w-32'></div>
      </div>
    </div>
    <div className='h-9 bg-white/10 rounded animate-pulse w-full sm:w-48'></div>
  </div>
);

export const VideoModal = ({ video, isOpen, onClose }: VideoModalProps) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const extractVideoId = (url: string): string | null => {
    try {
      const match = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      );
      return match ? match[1] : null;
    } catch (error) {
      console.error("Error extracting video ID:", error);
      return null;
    }
  };

  const validateVideoUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      const videoId = extractVideoId(url);
      return videoId !== null && videoId.length === 11;
    } catch {
      return false;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const videoId = video ? extractVideoId(video.videoUrl) : null;
  const isValidVideo = video && videoId && validateVideoUrl(video.videoUrl);

  const youtubeOpts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  const handleVideoReady = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  useEffect(() => {
    if (video) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [video]);

  const handleClose = () => {
    setIsLoading(true);
    setHasError(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className='max-w-4xl h-[80vh] p-0 overflow-hidden border-0 bg-transparent shadow-none'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className='relative w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden'>
              <Button
                variant='ghost'
                size='icon'
                className='absolute top-4 right-4 z-50 bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 hover:text-white'
                onClick={handleClose}>
                <X className='w-4 h-4' />
              </Button>

              <div className='flex flex-col h-full'>
                {/* Video Player Section */}
                {!video ? (
                  <VideoPlayerSkeleton />
                ) : !isValidVideo ? (
                  <div className='flex-1 relative min-h-0 bg-gray-800 flex items-center justify-center'>
                    <div className='text-center space-y-4 p-8'>
                      <AlertTriangle className='w-16 h-16 text-yellow-400 mx-auto' />
                      <div className='space-y-2'>
                        <h3 className='text-white text-lg font-semibold'>
                          Invalid Video URL
                        </h3>
                        <p className='text-white/60 text-sm max-w-md'>
                          Please check the YouTube URL format.
                        </p>
                      </div>
                      <Button
                        variant='outline'
                        onClick={() => window.open(video.videoUrl, "_blank")}
                        className='border-white/20 text-white hover:bg-white/10'>
                        <ExternalLink className='w-4 h-4 mr-2' />
                        Open on YouTube
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='flex-1 relative min-h-0'>
                    {isLoading && (
                      <div className='absolute inset-0 bg-gray-800 flex items-center justify-center z-10'>
                        <Loader2 className='w-12 h-12 text-white/40 animate-spin' />
                      </div>
                    )}

                    {hasError && (
                      <div className='absolute inset-0 bg-gray-800 flex items-center justify-center z-10'>
                        <div className='text-center space-y-4 p-8'>
                          <AlertTriangle className='w-16 h-16 text-yellow-400 mx-auto' />
                          <div className='space-y-2'>
                            <h3 className='text-white text-lg font-semibold'>
                              Video Unavailable
                            </h3>
                            <p className='text-white/60 text-sm'>
                              This video cannot be played.
                            </p>
                          </div>
                          <Button
                            variant='outline'
                            onClick={() =>
                              window.open(video.videoUrl, "_blank")
                            }
                            className='border-white/20 text-white hover:bg-white/10'>
                            <ExternalLink className='w-4 h-4 mr-2' />
                            Open on YouTube
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className='absolute inset-0 bg-black'>
                      {isClient && (
                        <YouTube
                          videoId={videoId || ""}
                          opts={youtubeOpts}
                          className='w-full h-full'
                          iframeClassName='w-full h-full'
                          onReady={handleVideoReady}
                          onError={handleVideoError}
                        />
                      )}
                    </div>

                    <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none' />
                  </div>
                )}

                {/* Video Info Section */}
                {!video ? (
                  <VideoInfoSkeleton />
                ) : !isValidVideo ? (
                  <div className='bg-gradient-to-t from-black/95 to-gray-900/95 backdrop-blur-sm border-t border-white/10 p-6 space-y-4'>
                    <div className='space-y-3'>
                      <h2 className='text-lg text-white font-semibold'>
                        {video.description}
                      </h2>
                      <div className='flex items-center gap-4 text-white/60'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='w-4 h-4' />
                          <span className='text-sm'>
                            {formatDate(video.date)}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-yellow-400'>
                          <AlertTriangle className='w-4 h-4' />
                          <span className='text-sm'>Invalid URL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    className='bg-gradient-to-t from-black/95 to-gray-900/95 backdrop-blur-sm border-t border-white/10 p-6 space-y-4'
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}>
                   
                      <div className='space-y-3 flex-1'>
                        <h2 className='text-white'>{video.description}</h2>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                          <div className='flex items-center gap-4 text-white/60'>
                            <div className='flex items-center gap-2'>
                              <Calendar className='w-4 h-4 shrink-0' />
                              <span className='text-sm'>
                                {formatDate(video.date)}
                              </span>
                            </div>
                            {hasError && (
                              <div className='flex items-center gap-2 text-yellow-400'>
                                <AlertTriangle className='w-4 h-4' />
                                <span className='text-sm'>Playback Error</span>
                              </div>
                            )}
                          </div>

                          <Button
                            variant='outline'
                            size='sm'
                            className='bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white shrink-0'
                            onClick={() =>
                              window.open(video.videoUrl, "_blank")
                            }>
                            <ExternalLink className='w-4 h-4 mr-2' />
                            Watch on YouTube
                          </Button>
                        </div>
                      </div>

                    
             

                    {video.captionUrl && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className='pt-4 border-t border-white/10'>
                        <a
                          href={video.captionUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors'>
                          <span>View Captions</span>
                          <ExternalLink className='w-3 h-3' />
                        </a>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export type { VideoModalProps };
