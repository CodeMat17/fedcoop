"use client";

import { RichTextEditor } from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const AddNewsModal = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addNews = useMutation(api.news.addNews);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

 

  // Function to compress and optimize image
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

          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          // Set optimal dimensions (max width 1200px, maintain aspect ratio)
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw image on canvas with high quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression (quality 0.85 for good balance)
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Could not compress image"));
                return;
              }

              // Create optimized file
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg", // Convert to JPEG for better compression
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            "image/jpeg",
            0.85 // Quality setting (0.85 = 85% quality)
          );
        };

        img.onerror = () => reject(new Error("Could not load image"));
      };

      reader.onerror = () => reject(new Error("Could not read file"));
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      // Compress and optimize image
      const compressedFile = await compressImage(file);

      // Show compression success message
      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2);
      toast.success(`Image optimized: ${originalSize}MB → ${compressedSize}MB`);

      setImageFile(compressedFile);

      // Create preview from compressed file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
      toast.error("Failed to optimize image. Please try another image.");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!body.trim()) {
      toast.error("Please enter news content");
      return;
    }

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    setIsSubmitting(true);

    try {
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

      // Step 3: Create news with storage ID
      await addNews({
        image: storageId,
        title: title.trim(),
        body: body.trim(),
        featured: featured,
      });

      toast.success("News added successfully!");

      // Reset form
      setTitle("");
      setBody("");
      setFeatured(false);
      setImageFile(null);
      setImagePreview(null);
      setOpen(false);
    } catch (error) {
      console.error("Error adding news:", error);
      toast.error("Failed to add news. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add News</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add News Article</DialogTitle>
            <DialogDescription>
              Create a new news article. Fill in all the required fields.
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
                      Max 5MB • Auto-optimized to 1200x800px
                    </span>
                  </label>
                  <Input
                    id='image'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                </div>
              ) : (
                <div className='relative'>
                  <div className='relative w-full h-48 rounded-lg overflow-hidden'>
                    <Image
                      src={imagePreview}
                      alt='Preview'
                      fill
                      className='object-cover'
                    />
                  </div>
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute top-2 right-2'
                    onClick={removeImage}>
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              )}
            </div>

            {/* Title */}
            <div className='grid gap-3'>
              <Label htmlFor='title'>Title *</Label>
              <Input
                id='title'
                placeholder='Enter news title'
                value={title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setTitle(newTitle);
                  // Auto-generate slug from title
                }}
                maxLength={200}
              />
              <span className='text-xs text-muted-foreground'>
                {title.length}/200 characters
              </span>
            </div>

            {/* Body */}
            <div className='grid gap-3'>
              <Label htmlFor='body'>Content *</Label>
              <RichTextEditor
                value={body}
                onChange={setBody}
                placeholder='Start writing your news content...'
                maxLength={10000}
              />
            </div>

            {/* Featured Checkbox */}
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='featured'
                checked={featured}
                onCheckedChange={(checked: boolean) => setFeatured(checked)}
              />
              <Label
                htmlFor='featured'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                Mark as featured article
              </Label>
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
                "Add News"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewsModal;
