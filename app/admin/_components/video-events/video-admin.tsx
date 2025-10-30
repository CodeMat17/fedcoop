"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminVideoForm } from "./admin-video-form";
import { AdminVideoCard } from "./admin-video-card";
import { VideoEvent } from "@/lib/video-types";
import { Plus, Search, Loader2 } from "lucide-react";
import { VideoModal } from "@/components/video-modal";

export const VideoAdmin = () => {
  const videoEvents = useQuery(api.videoEvents.getVideoEvents);
  const createVideo = useMutation(api.videoEvents.createVideoEvent);
  const updateVideo = useMutation(api.videoEvents.updateVideoEvent);
  const deleteVideo = useMutation(api.videoEvents.deleteVideoEvent);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoEvent | null>(null);
  const [previewVideo, setPreviewVideo] = useState<VideoEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredVideos = videoEvents?.filter((video) =>
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateVideo = async (data: {
    description: string;
    videoUrl: string;
    captionUrl?: string;
    date: string;
  }) => {
    setIsSubmitting(true);
    try {
      await createVideo(data);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating video:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateVideo = async (data: {
    description: string;
    videoUrl: string;
    captionUrl?: string;
    date: string;
  }) => {
    if (!editingVideo) return;

    setIsSubmitting(true);
    try {
      await updateVideo({
        id: editingVideo._id as Id<"videoEvents">,
        ...data,
      });
      setEditingVideo(null);
    } catch (error) {
      console.error("Error updating video:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await deleteVideo({ id: videoId as Id<"videoEvents"> });
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleEdit = (video: VideoEvent) => {
    setEditingVideo(video);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingVideo(null);
  };

  if (videoEvents === undefined) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900'>
        <div className='flex items-center gap-3 text-white/60'>
          <Loader2 className='w-6 h-6 animate-spin' />
          <span>Loading admin panel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen py-8'>
          {/* Header */}
      <motion.div
        className='text-center mb-12'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        <div className='flex items-center justify-center gap-3 mb-4'>
        
          <h1 className='text-3xl font-medium'>
            Video Admin
          </h1>
        </div>
      
      </motion.div>

      {/* Controls */}
      <motion.div
        className='max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}>
        {/* Search Bar */}
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5' />
          <Input
            type='text'
            placeholder='Search videos...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 pr-4 py-5 rounded-2xl'
          />
        </div>

        {/* Add Video Button */}
        <Button
          onClick={() => setIsFormOpen(true)}
          className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6 py-6 rounded-2xl shadow-2xl'>
          <Plus className='w-5 h-5 mr-2' />
          Add New Video
        </Button>
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
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}>
                    <AdminVideoCard
                      video={video}
                      onEdit={handleEdit}
                      onDelete={handleDeleteVideo}
                      onPreview={setPreviewVideo}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              className='text-center py-20'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <div className='text-white/40 text-lg mb-6'>
                {searchTerm
                  ? "No videos found matching your search."
                  : "No videos available yet."}
              </div>
              <Button
                onClick={() => setIsFormOpen(true)}
                variant='outline'
                className='border-white/20 text-white hover:bg-white/10'>
                <Plus className='w-4 h-4 mr-2' />
                Add Your First Video
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add/Edit Video Form Modal */}
      <AdminVideoForm
        video={editingVideo}
        isOpen={isFormOpen || !!editingVideo}
        onClose={handleFormClose}
        onSubmit={editingVideo ? handleUpdateVideo : handleCreateVideo}
        isSubmitting={isSubmitting}
      />

      {/* Video Preview Modal */}
      <VideoModal
        video={previewVideo}
        isOpen={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
      />
    </div>
  );
};
