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
import { AlertTriangle, Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CooperativeItem {
  _id: Id<"cooperatives">;
  name: string;
  email?: string; // Changed to optional
}

interface DeleteCooperativeModalProps {
  cooperative: CooperativeItem;
}

const DeleteCooperativeModal = ({
  cooperative,
}: DeleteCooperativeModalProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteCooperative = useMutation(api.cooperatives.deleteCooperative);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteCooperative({ id: cooperative._id });
      toast.success("Cooperative deleted successfully!"); // Fixed success message
      setOpen(false);
    } catch (error) {
      console.error("Error deleting cooperative:", error);
      toast.error("Failed to delete cooperative. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' className='bg-red-500 text-white'>

            <Trash className='w-5 h-5' />
        </Button>
      
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
              <AlertTriangle className='h-6 w-6 text-destructive' />
            </div>
            <div>
              <DialogTitle>Delete Cooperative</DialogTitle>
              <DialogDescription className='mt-1'>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='py-4'>
          <p className='text-sm text-muted-foreground'>
            Are you sure you want to delete this cooperative?
          </p>
          <div className='mt-3 rounded-lg bg-muted p-3'>
            <p className='text-sm font-semibold'>{cooperative.name}</p>
            {cooperative.email && ( // Added conditional rendering for email
              <p className='text-xs text-muted-foreground mt-1'>
                {cooperative.email}
              </p>
            )}
          </div>
          <p className='mt-3 text-sm text-destructive'>
            This will permanently delete the cooperative from the database.
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
              "Delete Cooperative"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCooperativeModal;
