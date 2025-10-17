"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DeleteEventModal({ id }: { id: Id<"gallery"> }) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteGallery = useMutation(api.gallery.deleteGallery);

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    try {
      await deleteGallery({ id });
      toast.success("Gallery item deleted successfully.");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          <Trash2 className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p className='text-sm text-muted-foreground'>
          Are you sure you want to delete this gallery image? This action cannot
          be undone.
        </p>

        <div className='flex justify-end gap-2 mt-4'>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
