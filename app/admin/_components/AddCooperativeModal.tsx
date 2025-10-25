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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AddCooperativeModal = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addCooperative = useMutation(api.cooperatives.addCooperative);

  // Function to extract clean error message from Convex error
  const getCleanErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      const message = error.message;

      // Check if it's a Convex server error with the format we want to clean
      if (message.includes("[CONVEX") && message.includes("Server Error")) {
        // Extract the actual error message after "Uncaught Error: "
        const uncaughtErrorIndex = message.indexOf("Uncaught Error: ");
        if (uncaughtErrorIndex !== -1) {
          return message.substring(
            uncaughtErrorIndex + "Uncaught Error: ".length
          );
        }

        // If we can't extract a clean message, return a generic one
        return "A cooperative with this name already exists";
      }

      // Return the original message if it's not a Convex server error
      return message;
    }

    // Fallback for non-Error objects
    return "Failed to add cooperative. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter organization name");
      return;
    }

    if (name.trim().length < 2) {
      // Changed from 10 to 2 to match your mutation
      toast.error("Name must be at least 2 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await addCooperative({
        name: name.trim(),
      });

      toast.success("Cooperative added successfully!");

      // Reset form
      setName("");
      setOpen(false);
    } catch (error) {
      console.error("Error adding cooperative:", error);

      // Use the clean error message function
      const cleanErrorMessage = getCleanErrorMessage(error);
      toast.error(cleanErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Cooperative</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Cooperative</DialogTitle>
            <DialogDescription>
              Add a new cooperative. All required fields must be filled.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            {/* Organization Name */}
            <div className='grid gap-3'>
              <Label htmlFor='name'>Cooperative Name *</Label>
              <Input
                id='name'
                placeholder='Enter organization name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={200}
              />
              <span className='text-xs text-muted-foreground'>
                {name.length}/200 characters
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
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCooperativeModal;
