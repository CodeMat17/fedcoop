// app/admin/gallery/_components/UpdateGalleryModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface UpdateGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  galleryItem: {
    _id: Id<"gallery">;
    image: string;
    description: string;
    imageUrl?: string;
  };
}

const UpdateGalleryModal = ({
  open,
  onOpenChange,
  galleryItem,
}: UpdateGalleryModalProps) => {
  const [description, setDescription] = useState(galleryItem.description);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateGallery = useMutation(api.gallery.updateGallery);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  // Reset form when modal opens with new item
  useEffect(() => {
    if (open) {
      setDescription(galleryItem.description);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [open, galleryItem]);

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas not supported"));

          const MAX_SIZE = 1200;
          let { width, height } = img;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Could not compress image"));
              const compressed = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressed);
            },
            "image/jpeg",
            0.85
          );
        };
      };
      reader.onerror = () => reject(new Error("File read error"));
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      const compressedFile = await compressImage(file);
      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);

      if (parseFloat(compressedSize) < parseFloat(originalSize)) {
        toast.success(
          `Image optimized: ${originalSize}MB → ${compressedSize}MB`
        );
      }

      setImageFile(compressedFile);

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error(err);
      toast.error("Failed to optimize image. Try another image.");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const sanitizeInput = (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
      .replace(/[<>]/g, "")
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedDescription = sanitizeInput(description);

    if (!sanitizedDescription.trim()) {
      return toast.error("Please enter a description");
    }
    if (sanitizedDescription.length > 500) {
      return toast.error("Description is too long (max 500 characters)");
    }

    setIsSubmitting(true);

    try {
      let storageId: string | undefined;

      // Upload new image if changed
      if (imageFile) {
        const uploadUrl = await generateUploadUrl();
        const upload = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });

        if (!upload.ok) throw new Error("Image upload failed");
        const { storageId: newStorageId } = await upload.json();
        storageId = newStorageId;
      }

      // Update gallery item
      await updateGallery({
        id: galleryItem._id,
        ...(storageId && { image: storageId }),
        description: sanitizedDescription,
      });

      toast.success("Gallery item updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update gallery item"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Gallery Item</DialogTitle>
            <DialogDescription>
              Update the image and description for this gallery item.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Current Image Preview */}
            <div className='grid gap-3'>
              <Label>Current Image</Label>
              <div className='relative w-full h-48 rounded-lg overflow-hidden border'>
                {galleryItem.imageUrl ? (
                  <Image
                    src={galleryItem.imageUrl}
                    alt='Current image'
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <ImagePlus className='w-8 h-8 text-muted-foreground' />
                  </div>
                )}
              </div>
            </div>

            {/* New Image Upload */}
            <div className='grid gap-3'>
              <Label htmlFor='update-image'>
                New Image (optional - leave empty to keep current)
              </Label>
              {!imagePreview ? (
                <div className='border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors'>
                  <label
                    htmlFor='update-image'
                    className='flex flex-col items-center gap-2 cursor-pointer'>
                    <ImagePlus className='w-8 h-8 text-muted-foreground' />
                    <span className='text-sm text-muted-foreground'>
                      Click to change image
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      Max 5MB • Auto-optimized
                    </span>
                  </label>
                  <Input
                    id='update-image'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                </div>
              ) : (
                <div className='relative mx-auto'>
                  <div className='relative w-full h-64 rounded-lg overflow-hidden border-4 border-muted'>
                    <Image
                      src={imagePreview}
                      alt='New image preview'
                      fill
                      className='object-cover'
                    />
                  </div>
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute top-2 right-2 rounded-full'
                    onClick={removeImage}>
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className='grid gap-3'>
              <Label htmlFor='update-description'>Description *</Label>
              <Textarea
                id='update-description'
                placeholder='Enter image description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <span className='text-xs text-muted-foreground'>
                {description.length}/500 characters
              </span>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' type='button' disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Updating...
                </>
              ) : (
                "Update Gallery Item"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGalleryModal;
