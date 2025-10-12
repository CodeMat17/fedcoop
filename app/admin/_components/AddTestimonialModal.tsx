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
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AddTestimonialModal = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTestimonial = useMutation(api.testimonials.addTestimonial);

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
    const sanitizedBody = sanitizeInput(body);

    if (!sanitizedName.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (sanitizedName.length > 100) {
      toast.error("Name is too long (max 100 characters)");
      return;
    }

    if (!sanitizedBody.trim()) {
      toast.error("Please enter a testimonial");
      return;
    }

    if (sanitizedBody.length > 1000) {
      toast.error("Testimonial is too long (max 1000 characters)");
      return;
    }

    if (rating < 0 || rating > 5) {
      toast.error("Rating must be between 0 and 5");
      return;
    }

    setIsSubmitting(true);

    try {
      await addTestimonial({
        name: sanitizedName,
        body: sanitizedBody,
        rating: rating,
      });

      toast.success("Testimonial added successfully!");

      // Reset form
      setName("");
      setBody("");
      setRating(5);
      setOpen(false);
    } catch (error) {
      console.error("Error adding testimonial:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add testimonial. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Testimonial</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Testimonial</DialogTitle>
            <DialogDescription>
              Add a new testimonial from a member. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Name */}
            <div className='grid gap-3'>
              <Label htmlFor='name'>Name *</Label>
              <Input
                id='name'
                placeholder='Enter member name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
              <span className='text-xs text-muted-foreground'>
                {name.length}/100 characters
              </span>
            </div>

            {/* Rating */}
            <div className='grid gap-3'>
              <Label htmlFor='rating'>Rating *</Label>
              <div className='flex items-center gap-4'>
                <div className='flex gap-1'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type='button'
                      onClick={() => setRating(star)}
                      className='transition-transform hover:scale-110'>
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Input
                  id='rating'
                  type='number'
                  min='0'
                  max='5'
                  value={rating}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setRating(Math.min(5, Math.max(0, value)));
                  }}
                  className='w-20'
                />
                <span className='text-sm font-medium'>/ 5</span>
              </div>
            </div>

            {/* Body */}
            <div className='grid gap-3'>
              <Label htmlFor='body'>Testimonial *</Label>
              <Textarea
                id='body'
                placeholder='Enter testimonial text...'
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={1000}
                rows={6}
                className='resize-none'
              />
              <span className='text-xs text-muted-foreground'>
                {body.length}/1000 characters
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
                "Add Testimonial"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTestimonialModal;
