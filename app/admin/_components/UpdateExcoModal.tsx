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
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ExcoItem {
  _id: Id<"excos">;
  name: string;
  position: string;
  image: string;
  imageUrl: string | null;
}

interface UpdateExcoModalProps {
  exco: ExcoItem;
}

const UpdateExcoModal = ({ exco }: UpdateExcoModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(exco.name);
  const [position, setPosition] = useState(exco.position);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    exco.imageUrl
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateExcos = useMutation(api.excos.updateExcos);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setName(exco.name);
      setPosition(exco.position);
      setImageFile(null);
      setImagePreview(exco.imageUrl);
    }
  }, [open, exco]);

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

          // Set square dimensions for profile photos (500x500)
          const SIZE = 500;
          const width = img.width;
          const height = img.height;

          // Calculate dimensions to crop to square
          const minDimension = Math.min(width, height);
          const cropX = (width - minDimension) / 2;
          const cropY = (height - minDimension) / 2;

          canvas.width = SIZE;
          canvas.height = SIZE;

          // Draw image on canvas with high quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(
            img,
            cropX,
            cropY,
            minDimension,
            minDimension,
            0,
            0,
            SIZE,
            SIZE
          );

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Could not compress image"));
                return;
              }

              // Create optimized file
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            "image/jpeg",
            0.9 // Higher quality for profile photos
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
    setImagePreview(exco.imageUrl);
  };

  // Sanitize input on the frontend
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
      .replace(/[<>]/g, "")
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validation and sanitization
    const sanitizedName = sanitizeInput(name);
    const sanitizedPosition = sanitizeInput(position);

    if (!sanitizedName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (sanitizedName.length > 100) {
      toast.error("Name is too long (max 100 characters)");
      return;
    }

    if (!sanitizedPosition.trim()) {
      toast.error("Please enter a position");
      return;
    }

    if (sanitizedPosition.length > 100) {
      toast.error("Position is too long (max 100 characters)");
      return;
    }

    setIsSubmitting(true);

    try {
      let storageId = exco.image;

      // If new image selected, upload it
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

        const { storageId: newStorageId } = await result.json();
        storageId = newStorageId;
      }

      // Step 3: Update executive
      await updateExcos({
        id: exco._id,
        image: imageFile ? storageId : undefined,
        name: sanitizedName,
        position: sanitizedPosition,
      });

      toast.success("Executive updated successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error updating executive:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update executive. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='px-8'>Update</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Executive</DialogTitle>
            <DialogDescription>
              Edit the executive member details and save your changes.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Image Upload */}
            <div className='grid gap-3'>
              <Label htmlFor='image'>Profile Photo</Label>
              <div className='relative mx-auto'>
                <div className='relative w-48 h-48 rounded-full overflow-hidden border-4 border-muted'>
                  <Image
                    src={imagePreview || "/hero.svg"}
                    alt='Preview'
                    fill
                    className='object-cover'
                  />
                </div>
                {imageFile && (
                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='absolute top-0 right-0 rounded-full'
                    onClick={removeImage}>
                    <X className='w-4 h-4' />
                  </Button>
                )}
              </div>
              <div className='border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors'>
                <label
                  htmlFor='image'
                  className='flex flex-col items-center gap-2 cursor-pointer'>
                  <ImagePlus className='w-6 h-6 text-muted-foreground' />
                  <span className='text-sm text-muted-foreground'>
                    {imageFile ? "Change image" : "Click to update image"}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    Max 5MB • Auto-cropped to 500x500px square
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
            </div>

            {/* Name */}
            <div className='grid gap-3'>
              <Label htmlFor='name'>Full Name *</Label>
              <Input
                id='name'
                placeholder='Enter full name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
              <span className='text-xs text-muted-foreground'>
                {name.length}/100 characters
              </span>
            </div>

            {/* Position */}
            <div className='grid gap-3'>
              <Label htmlFor='position'>Position *</Label>
              <Input
                id='position'
                placeholder='e.g., President, Vice President, Secretary'
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                maxLength={100}
              />
              <span className='text-xs text-muted-foreground'>
                {position.length}/100 characters
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
                "Update Executive"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateExcoModal;
