// app/admin/gallery/_components/DeleteGalleryModal.tsx
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
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { AlertTriangle, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface DeleteGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  galleryItem: {
    _id: Id<"gallery">;
    image: string;
    description: string;
    imageUrl?: string;
  };
}

const DeleteGalleryModal = ({
  open,
  onOpenChange,
  galleryItem,
}: DeleteGalleryModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteGallery = useMutation(api.gallery.deleteGallery);

  const handleDelete = async () => {
    setIsSubmitting(true);

    try {
      await deleteGallery({ id: galleryItem._id });
      toast.success("Gallery item deleted successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete gallery item"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-destructive'>
            <AlertTriangle className='w-5 h-5' />
            Delete Gallery Item
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            gallery item and remove the image from storage.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-4'>
          {galleryItem.imageUrl && (
            <div className='relative w-full h-32 rounded-lg overflow-hidden border'>
              <Image
                src={galleryItem.imageUrl}
                alt={galleryItem.description}
                fill
                className='object-cover'
              />
            </div>
          )}

          <div className='space-y-2'>
            <h4 className='font-medium'>Description:</h4>
            <p className='text-sm text-muted-foreground'>
              {galleryItem.description}
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Deleting...
              </>
            ) : (
              "Delete Gallery Item"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteGalleryModal;
