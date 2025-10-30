// app/admin/gallery/page.tsx
"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import AddGalleryModal from "./AddGalleryModal";
import UpdateGalleryModal from "./UpdateGalleryModal";
import DeleteGalleryModal from "./DeleteGalleryModal";

interface GalleryItem {
  _id: Id<"gallery">;
  _creationTime: number;
  image: string;
  description: string;
  imageUrl?: string;
}

export default function GalleryAdminPage() {
  const gallery = useQuery(api.gallery.getAll) as GalleryItem[] | undefined;
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleUpdateClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setUpdateModalOpen(true);
  };

  const handleDeleteClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  if (gallery === undefined) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='container mx-auto py-6 space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Photo Gallery
          </h1>
          <p className='text-muted-foreground'>
            Manage your gallery images and descriptions
          </p>
        </div>
        <AddGalleryModal />
      </div>

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <ImageIcon className='w-12 h-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-semibold mb-2'>No gallery items yet</h3>
            <p className='text-muted-foreground text-center mb-4'>
              Get started by adding your first gallery item.
            </p>
            <AddGalleryModal />
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {gallery.map((item) => (
            <Card key={item._id} className='overflow-hidden group py-0'>
              <div className='aspect-square relative bg-muted'>
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.description}
                    fill
                    className='object-cover transition-transform group-hover:scale-105'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <ImageIcon className='w-8 h-8 text-muted-foreground' />
                  </div>
                )}
              </div>

              <CardContent className='px-4 pb-4 space-y-3'>
                <p className='text-sm text-muted-foreground line-clamp-2'>
                  {item.description}
                </p>

                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() => handleUpdateClick(item)}>
                    Update
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    className='flex-1'
                    onClick={() => handleDeleteClick(item)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedItem && (
        <>
          <UpdateGalleryModal
            open={updateModalOpen}
            onOpenChange={setUpdateModalOpen}
            galleryItem={selectedItem}
          />
          <DeleteGalleryModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            galleryItem={selectedItem}
          />
        </>
      )}
    </div>
  );
}
