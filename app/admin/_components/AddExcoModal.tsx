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
import { useMutation } from "convex/react";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const AddExcoModal = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addExcos = useMutation(api.excos.addExcos);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  // --- Image compression (unchanged)
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

          const SIZE = 500;
          const minDimension = Math.min(img.width, img.height);
          const cropX = (img.width - minDimension) / 2;
          const cropY = (img.height - minDimension) / 2;
          canvas.width = SIZE;
          canvas.height = SIZE;

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
            0.9
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
      toast.success(`Image optimized: ${originalSize}MB → ${compressedSize}MB`);
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

    const sanitizedName = sanitizeInput(name);
    const sanitizedPosition = sanitizeInput(position);
    const sanitizedDescription = sanitizeInput(description);

    if (!sanitizedName.trim()) return toast.error("Please enter a name");
    if (sanitizedName.length > 100)
      return toast.error("Name too long (max 100 chars)");

    if (!sanitizedPosition.trim())
      return toast.error("Please enter a position");
    if (sanitizedPosition.length > 100)
      return toast.error("Position too long (max 100 chars)");

    if (!sanitizedDescription.trim())
      return toast.error("Please enter an organization/post");

    setIsSubmitting(true);

    try {
      let storageId: string | undefined;

      // Image is optional
      if (imageFile) {
        const uploadUrl = await generateUploadUrl();
        const upload = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });
        if (!upload.ok) throw new Error("Image upload failed");
        const data = await upload.json();
        storageId = data.storageId;
      }

      await addExcos({
        image: storageId || undefined,
        name: sanitizedName,
        position: sanitizedPosition,
        description: sanitizedDescription,
      });

      toast.success("Executive added successfully!");
      setName("");
      setPosition("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add executive"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Executive</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Executive</DialogTitle>
            <DialogDescription>
              Name, position, and organization are required. Image is optional.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Optional Image Upload */}
            <div className='grid gap-3'>
              <Label htmlFor='image'>Profile Photo (optional)</Label>
              {!imagePreview ? (
                <div className='border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors'>
                  <label
                    htmlFor='image'
                    className='flex flex-col items-center gap-2 cursor-pointer'>
                    <ImagePlus className='w-8 h-8 text-muted-foreground' />
                    <span className='text-sm text-muted-foreground'>
                      Click to upload (optional)
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      Max 5MB • Auto-cropped to 500x500px
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
                <div className='relative mx-auto'>
                  <div className='relative w-48 h-48 rounded-full overflow-hidden border-4 border-muted'>
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
                    className='absolute top-0 right-0 rounded-full'
                    onClick={removeImage}>
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              )}
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
                placeholder='e.g., President, Secretary'
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                maxLength={100}
              />
              <span className='text-xs text-muted-foreground'>
                {position.length}/100 characters
              </span>
            </div>

            {/* Description */}
            <div className='grid gap-3'>
              <Label htmlFor='description'>Organization Coop/Post *</Label>
              <Input
                id='description'
                placeholder='e.g., PRO, EFCC Cooperative'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={150}
              />
              <span className='text-xs text-muted-foreground'>
                {description.length}/150 characters
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
                "Add Executive"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExcoModal;
