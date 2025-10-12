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

interface MemberItem {
  _id: Id<"members">;
  name: string;
  email: string;
}

interface DeleteMemberModalProps {
  member: MemberItem;
}

const DeleteMemberModal = ({ member }: DeleteMemberModalProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMember = useMutation(api.members.deleteMember);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteMember({ id: member._id });
      toast.success("Member deleted successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='destructive'>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
              <AlertTriangle className='h-6 w-6 text-destructive' />
            </div>
            <div>
              <DialogTitle>Delete Member</DialogTitle>
              <DialogDescription className='mt-1'>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='py-4'>
          <p className='text-sm text-muted-foreground'>
            Are you sure you want to delete this member?
          </p>
          <div className='mt-3 rounded-lg bg-muted p-3'>
            <p className='text-sm font-semibold'>{member.name}</p>
            <p className='text-xs text-muted-foreground mt-1'>{member.email}</p>
          </div>
          <p className='mt-3 text-sm text-destructive'>
            This will permanently delete the member from the database.
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
              "Delete Member"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMemberModal;
