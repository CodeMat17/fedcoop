// app/admin/gallery/_components/AddGalleryModal.tsx
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
  DialogTrigger,
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

const AddGalleryModal = () => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToGallery = useMutation(api.gallery.addToGallery);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl); // This should now work

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

          // Calculate new dimensions while maintaining aspect ratio
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

      // Create preview URL using URL.createObjectURL for immediate display
      const previewUrl = URL.createObjectURL(compressedFile);
      setImagePreview(previewUrl);
    } catch (err) {
      console.error(err);
      toast.error("Failed to optimize image. Try another image.");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    // Clean up the object URL to prevent memory leaks
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
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

    if (!imageFile) {
      return toast.error("Please select an image");
    }

    setIsSubmitting(true);

    try {
      // Upload image to Convex storage
      const uploadUrl = await generateUploadUrl();
      const upload = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": imageFile.type },
        body: imageFile,
      });

      if (!upload.ok) throw new Error("Image upload failed");

      const { storageId } = await upload.json();

      // Add to gallery
      await addToGallery({
        image: storageId,
        description: sanitizedDescription,
      });

      toast.success("Gallery item added successfully!");
      setDescription("");
      setImageFile(null);
      // Clean up preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add gallery item"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up object URLs when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Gallery Item</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Gallery Item</DialogTitle>
            <DialogDescription>
              Upload an image and add a description for your gallery.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Image Upload */}
            <div className='grid gap-3'>
              <Label htmlFor='image'>Image *</Label>
              {!imagePreview ? (
                <div className='border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors'>
                  <label
                    htmlFor='image'
                    className='flex flex-col items-center gap-2 cursor-pointer'>
                    <ImagePlus className='w-8 h-8 text-muted-foreground' />
                    <span className='text-sm text-muted-foreground'>
                      Click to upload image
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      Max 5MB • Auto-optimized
                    </span>
                  </label>
                  <Input
                    id='image'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                    required
                  />
                </div>
              ) : (
                <div className='relative'>
                  <div className='relative w-full h-64 rounded-lg overflow-hidden border-4 border-muted'>
                    <Image
                      src={imagePreview}
                      alt='Preview'
                      fill
                      className='object-cover'
                      unoptimized // Important for object URLs
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
              <Label htmlFor='description'>Description *</Label>
              <Textarea
                id='description'
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
                  Adding...
                </>
              ) : (
                "Add to Gallery"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGalleryModal;
