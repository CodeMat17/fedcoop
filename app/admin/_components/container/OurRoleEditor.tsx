"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Edit, Loader2, Save, X, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";

const OurRoleEditor = () => {
  // Use the basic query for admin (returns storage IDs)
  const ourRole = useQuery(api.ourRole.getOurRole);
  const updateOurRole = useMutation(api.ourRole.updateOurRole);
  const generateUploadUrl = useMutation(api.ourRole.generateUploadUrl);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to get display URL for preview
  const getDisplayUrl = (imageUrl: string | null | undefined): string => {
    if (!imageUrl) return "/connected.svg";

    // If it's a storage ID, we can't display it directly in admin
    if (imageUrl && !imageUrl.startsWith("/") && !imageUrl.startsWith("http")) {
      return "/connected.svg"; // Use default for storage IDs in admin
    }

    return imageUrl;
  };

  // Initialize form data when data loads or editing starts
  const startEditing = () => {
    if (ourRole) {
      setTitle(ourRole.title);
      setContent(ourRole.content);
      setImageFile(null);
      // Use display URL for preview
      setImagePreview(getDisplayUrl(ourRole.imageUrl));
      setEditing(true);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setTitle("");
    setContent("");
    setImageFile(null);
    setImagePreview(null);
  };

  // Function to compress and optimize image (keep your existing implementation)
  const compressImage = async (file: File): Promise<File> => {
    // ... your existing compressImage implementation ...
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let { width, height } = img;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Could not compress image"));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            "image/jpeg",
            0.8
          );
        };

        img.onerror = () => reject(new Error("Could not load image"));
      };

      reader.onerror = () => reject(new Error("Could not read file"));
    });
  };

  // Validate file type and size (keep your existing implementation)
  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
      return false;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return false;
    }

    const suspiciousPatterns =
      /[<>:"/\\|?*]|\.(exe|bat|cmd|scr|pif|vbs|js|jar)$/i;
    if (suspiciousPatterns.test(file.name)) {
      toast.error("Invalid file name detected");
      return false;
    }

    return true;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    try {
      const compressedFile = await compressImage(file);

      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);

      if (parseFloat(originalSize) > parseFloat(compressedSize)) {
        toast.success(
          `Image optimized: ${originalSize}MB → ${compressedSize}MB`
        );
      }

      setImageFile(compressedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
      toast.error("Failed to process image. Please try another image.");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(getDisplayUrl(ourRole?.imageUrl));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdateOurRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = ourRole?.imageUrl;

      // Upload new image if selected
      if (imageFile) {
        // Step 1: Get upload URL
        const uploadUrl = await generateUploadUrl();

        // Step 2: Upload image to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();
        // Store the storage ID
        finalImageUrl = storageId;
      }

      // Step 3: Update our role content with storage ID
      await updateOurRole({
        title: title.trim(),
        content: content.trim(),
        imageUrl: finalImageUrl,
      });

      toast.success("Our Role content updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating our role:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update content. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (ourRole === undefined) {
    return (
      <div className='flex items-center justify-center min-h-[200px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='py-12'>
      <div className='pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div>
              <h2 className='text-2xl font-bold text-foreground'>
                Our Role Section
              </h2>
            </div>
          </div>
          {!editing && (
            <Button
              variant='outline'
              size='sm'
              onClick={startEditing}
              className='flex items-center space-x-2'>
              <Edit className='w-4 h-4' />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </div>
      <div>
        {editing ? (
          <form onSubmit={handleUpdateOurRole} className='space-y-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='our-role-title' className='text-sm font-medium'>
                  Section Title *
                </Label>
                <Input
                  id='our-role-title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='Enter the section title'
                  className='text-base font-semibold'
                  maxLength={200}
                />
                <p className='text-xs text-muted-foreground'>
                  {title.length}/200 characters
                </p>
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='our-role-content'
                  className='text-sm font-medium'>
                  Content *
                </Label>
                <Textarea
                  id='our-role-content'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder='Enter the detailed content about your role'
                  rows={8}
                  className='text-base resize-none leading-relaxed'
                  maxLength={2000}
                />
                <p className='text-xs text-muted-foreground'>
                  {content.length}/2000 characters
                </p>
              </div>

            
            </div>

            <div className='flex space-x-3 pt-4 border-t'>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='flex items-center space-x-2'>
                {isSubmitting ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Save className='w-4 h-4' />
                )}
                <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={cancelEditing}
                disabled={isSubmitting}
                className='flex items-center space-x-2'>
                <X className='w-4 h-4' />
                <span>Cancel</span>
              </Button>
            </div>
          </form>
        ) : (
          <div className='space-y-6'>
            {/* Preview Section */}
            <div className='space-y-4'>
              <div className='p-4 bg-muted/30 rounded-lg border'>
                <h3 className='text-sm font-medium text-muted-foreground mb-3'>
                  Preview
                </h3>
                <div className='space-y-3'>
                  <h4 className='text-xl font-bold text-foreground'>
                    {ourRole.title}
                  </h4>
                  <div className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                    {ourRole.content}
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OurRoleEditor;
