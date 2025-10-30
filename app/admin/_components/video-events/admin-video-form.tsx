"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Youtube,
  Loader2,
  Plus,
  Edit3,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { VideoEvent } from "@/lib/video-types";

interface AdminVideoFormProps {
  video?: VideoEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    description: string;
    videoUrl: string;
    captionUrl?: string;
    date: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

const validateYouTubeUrl = (
  url: string
): { isValid: boolean; error?: string; videoId?: string } => {
  if (!url.trim()) {
    return { isValid: false, error: "YouTube URL is required" };
  }

  try {
    new URL(url);
  } catch {
    return { isValid: false, error: "Please enter a valid URL" };
  }

  const youtubeDomains = [
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be",
    "www.youtu.be",
  ];

  const urlObj = new URL(url);
  const isYouTubeDomain = youtubeDomains.some(
    (domain) =>
      urlObj.hostname === domain || urlObj.hostname.endsWith("." + domain)
  );

  if (!isYouTubeDomain) {
    return { isValid: false, error: "Please enter a valid YouTube URL" };
  }

  const videoIdRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(videoIdRegex);
  const videoId = match ? match[1] : null;

  if (!videoId) {
    return {
      isValid: false,
      error: "Could not find video ID. Please check the URL format.",
    };
  }

  const validVideoIdRegex = /^[A-Za-z0-9_-]{11}$/;
  if (!validVideoIdRegex.test(videoId)) {
    return { isValid: false, error: "Invalid YouTube video ID format" };
  }

  return { isValid: true, videoId };
};

export const AdminVideoForm = ({
  video,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AdminVideoFormProps) => {
  const [formData, setFormData] = useState({
    description: "",
    videoUrl: "",
    captionUrl: "",
    date: new Date(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form data when video prop changes (for editing)
  useEffect(() => {
    if (video) {
      setFormData({
        description: video.description || "",
        videoUrl: video.videoUrl || "",
        captionUrl: video.captionUrl || "",
        date: video.date ? new Date(video.date) : new Date(),
      });
    } else {
      // Reset form for new video
      setFormData({
        description: "",
        videoUrl: "",
        captionUrl: "",
        date: new Date(),
      });
    }
    // Clear errors when video changes
    setErrors({});
  }, [video]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;

      // Add styles to disable scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";

      return () => {
        // Re-enable scroll when modal closes
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Description validation with min/max length
    const description = formData.description.trim();
    if (!description) {
      newErrors.description = "Description is required";
    } else if (description.length < 5) {
      newErrors.description = "Description must be at least 5 characters long";
    } else if (description.length > 150) {
      newErrors.description = "Description must not exceed 150 characters";
    }

    const urlValidation = validateYouTubeUrl(formData.videoUrl);
    if (!urlValidation.isValid) {
      newErrors.videoUrl = urlValidation.error || "Invalid YouTube URL";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        description: formData.description.trim(),
        videoUrl: formData.videoUrl,
        captionUrl: formData.captionUrl || undefined,
        date: formData.date.toISOString(),
      });

      // Only reset form if we're creating a new video (not editing)
      if (!video) {
        setFormData({
          description: "",
          videoUrl: "",
          captionUrl: "",
          date: new Date(),
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Character count for description
  const descriptionLength = formData.description.length;
  const isDescriptionValid = descriptionLength >= 5 && descriptionLength <= 150;
  const isDescriptionNearLimit = descriptionLength > 130;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className='bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}>
        <div className='p-6 border-b border-white/10 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-500/10 rounded-lg'>
              {video ? (
                <Edit3 className='w-5 h-5 text-blue-400' />
              ) : (
                <Plus className='w-5 h-5 text-green-400' />
              )}
            </div>
            <div>
              <h2 className='text-xl font-semibold text-white'>
                {video
                  ? `Edit Video`
                  : "Add New Video"}
              </h2>
              <p className='text-sm text-white/60'>
                {video
                  ? "Update the video details"
                  : "Add a new video to the gallery"}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Description */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='description' className='text-white/80'>
                Video Description *
              </Label>
              <div
                className={cn(
                  "text-xs transition-colors",
                  isDescriptionValid
                    ? "text-green-400"
                    : isDescriptionNearLimit
                      ? "text-yellow-400"
                      : "text-white/40"
                )}>
                {descriptionLength}/150
              </div>
            </div>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder='Enter a compelling description for the video (5-150 characters)...'
              maxLength={150}
              className={cn(
                "min-h-[100px] bg-white/5 border-white/10 text-white placeholder-white/40 resize-none",
                errors.description && "border-red-500/50 focus:ring-red-500/50",
                isDescriptionNearLimit &&
                  !errors.description &&
                  "border-yellow-500/50 focus:ring-yellow-500/50"
              )}
            />
            {errors.description ? (
              <p className='text-sm text-red-400 flex items-center gap-2'>
                <AlertCircle className='w-4 h-4' />
                {errors.description}
              </p>
            ) : (
              <p className='text-sm text-white/40'>
                Description must be between 5 and 150 characters
              </p>
            )}
          </div>

          {/* YouTube URL */}
          <div className='space-y-2'>
            <Label htmlFor='videoUrl' className='text-white/80'>
              YouTube URL *
            </Label>
            <div className='relative'>
              <Youtube className='absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5' />
              <Input
                id='videoUrl'
                type='url'
                value={formData.videoUrl}
                onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                placeholder='https://www.youtube.com/watch?v=...'
                className={cn(
                  "pl-10 bg-white/5 border-white/10 text-white placeholder-white/40 transition-colors",
                  errors.videoUrl
                    ? "border-red-500/50 focus:ring-red-500/50"
                    : formData.videoUrl &&
                        validateYouTubeUrl(formData.videoUrl).isValid
                      ? "border-green-500/50 focus:ring-green-500/50"
                      : ""
                )}
              />
            </div>
            {errors.videoUrl ? (
              <p className='text-sm text-red-400 flex items-center gap-2'>
                <AlertCircle className='w-4 h-4' />
                {errors.videoUrl}
              </p>
            ) : formData.videoUrl &&
              validateYouTubeUrl(formData.videoUrl).isValid ? (
              <p className='text-sm text-green-400 flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                Valid YouTube URL detected
              </p>
            ) : (
              <p className='text-sm text-white/40'>
                Supported formats:{" "}
                <code className='bg-white/10 px-1 rounded'>
                  youtube.com/watch?v=...
                </code>{" "}
                or{" "}
                <code className='bg-white/10 px-1 rounded'>youtu.be/...</code>
              </p>
            )}
          </div>

        

          {/* Date Picker */}
          <div className='space-y-2'>
            <Label htmlFor='date' className='text-white/80'>
              Video Date *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/5 border-white/10 text-white hover:bg-white/10",
                    !formData.date && "text-white/40",
                    errors.date && "border-red-500/50"
                  )}>
                  <Calendar className='mr-2 h-4 w-4 text-white/60' />
                  {formData.date ? (
                    format(formData.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0 bg-gray-900 border-white/10 z-50'>
                <CalendarComponent
                  mode='single'
                  selected={formData.date}
                  onSelect={(date) => date && handleInputChange("date", date)}
                  initialFocus
                  className='bg-gray-900 text-white'
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className='text-sm text-red-400 flex items-center gap-2'>
                <AlertCircle className='w-4 h-4' />
                {errors.date}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-gray-900/95 backdrop-blur-sm pb-2 -mx-6 px-6'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isSubmitting}
              className='flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white'>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting || !isDescriptionValid}
              className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0'>
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  {video ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{video ? "Update Video" : "Add Video"}</>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Export types for external use
export type { AdminVideoFormProps };
