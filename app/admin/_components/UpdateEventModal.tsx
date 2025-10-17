"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit3 } from "lucide-react";

interface GalleryItem {
  _id: Id<"gallery">;
  imageUrl: string | null;
  description: string;
}

export default function UpdateEventModal({ item }: { item: GalleryItem }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>(item.description);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const updateGallery = useMutation(api.gallery.updateGallery);

  useEffect(() => {
    if (open) {
      setDescription(item.description);
      setFile(null);
    }
  }, [open, item.description]);

  const handleUpdate = async (): Promise<void> => {
    if (!description.trim()) {
      toast.error("Description cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      let newImageId: string | undefined = undefined;

      if (file) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!res.ok) throw new Error("Image upload failed");
        const { storageId }: { storageId: string } = await res.json();
        newImageId = storageId;
      }

      await updateGallery({
        id: item._id,
        image: newImageId,
        description: description.trim(),
      });

      toast.success("Gallery item updated successfully.");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update item"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit3 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Gallery Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {item.imageUrl && (
            <div className="relative w-full h-48 rounded-md overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.description}
                fill
                className="object-cover"
              />
            </div>
          )}

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
