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
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { AlertTriangle, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TestimonialItem {
  _id: Id<"testimonials">;
  name: string;
  body: string;
  rating: number;
}

interface DeleteTestimonialModalProps {
  testimonial: TestimonialItem;
}

const DeleteTestimonialModal = ({
  testimonial,
}: DeleteTestimonialModalProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTestimonial = useMutation(api.testimonials.deleteTestimonial);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteTestimonial({ id: testimonial._id });
      toast.success("Testimonial deleted successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='px-8' variant='destructive'>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
              <AlertTriangle className='h-6 w-6 text-destructive' />
            </div>
            <div>
              <DialogTitle>Delete Testimonial</DialogTitle>
              <DialogDescription className='mt-1'>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='py-4'>
          <p className='text-sm text-muted-foreground'>
            Are you sure you want to delete this testimonial?
          </p>
          <div className='mt-3 rounded-lg bg-muted p-4 space-y-2'>
            <div className='flex items-center gap-2'>
              <p className='text-sm font-semibold'>{testimonial.name}</p>
              <div className='flex gap-0.5'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= testimonial.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className='text-xs text-muted-foreground line-clamp-2'>
              {testimonial.body}
            </p>
          </div>
          <p className='mt-3 text-sm text-destructive'>
            This will permanently delete the testimonial from the database.
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Deleting...
              </>
            ) : (
              "Delete Testimonial"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTestimonialModal;
