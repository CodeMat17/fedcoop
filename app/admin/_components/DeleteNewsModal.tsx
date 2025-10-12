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
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NewsItem {
  _id: Id<"news">;
  title: string;
}

interface DeleteNewsModalProps {
  news: NewsItem;
}

const DeleteNewsModal = ({ news }: DeleteNewsModalProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteNews = useMutation(api.news.deleteNews);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteNews({ id: news._id });
      toast.success("News deleted successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Failed to delete news. Please try again.");
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
              <DialogTitle>Delete News Article</DialogTitle>
              <DialogDescription className='mt-1'>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='py-4'>
          <p className='text-sm text-muted-foreground'>
            Are you sure you want to delete this news article?
          </p>
          <div className='mt-3 rounded-lg bg-muted p-3'>
            <p className='text-sm font-medium line-clamp-2'>{news.title}</p>
          </div>
          <p className='mt-3 text-sm text-destructive'>
            This will permanently delete the article and its associated image
            from storage.
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
              "Delete Article"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNewsModal;
