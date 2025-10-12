import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Helper function to sanitize string input
function sanitizeString(input: string): string {
  // Remove any HTML tags and script content
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();

  // Remove potentially dangerous characters and normalize whitespace
  sanitized = sanitized.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();

  return sanitized;
}

// Helper function to validate storage ID
function validateStorageId(storageId: string): void {
  // Check if it looks like a valid Convex storage ID
  if (!storageId || storageId.trim().length === 0) {
    throw new Error("Storage ID is required");
  }

  // Storage IDs should not contain dangerous characters
  if (/<|>|script|javascript:/i.test(storageId)) {
    throw new Error("Invalid storage ID format");
  }
}

// Query to get all gallery items
export const getAll = query({
  handler: async (ctx) => {
    const gallery = await ctx.db.query("gallery").collect();

    // Get storage URLs for images
    const galleryWithUrls = await Promise.all(
      gallery.map(async (item) => ({
        ...item,
        imageUrl: await ctx.storage.getUrl(item.image as Id<"_storage">),
      }))
    );

    return galleryWithUrls;
  },
});

// Mutation to add a new gallery item
export const addToGallery = mutation({
  args: {
    image: v.string(), // Storage ID
    description: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate and sanitize storage ID
    validateStorageId(args.image);

    // Sanitize and validate description
    const sanitizedDescription = sanitizeString(args.description);
    if (!sanitizedDescription || sanitizedDescription.length === 0) {
      throw new Error("Description is required");
    }
    if (sanitizedDescription.length > 500) {
      throw new Error("Description is too long (max 500 characters)");
    }

    const galleryId = await ctx.db.insert("gallery", {
      image: args.image,
      description: sanitizedDescription,
    });
    return galleryId;
  },
});

// Mutation to update a gallery item
export const updateGallery = mutation({
  args: {
    id: v.id("gallery"),
    image: v.optional(v.string()), // Storage ID (optional)
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, image, description } = args;

    // Get the existing gallery item
    const existingItem = await ctx.db.get(id);

    if (!existingItem) {
      throw new Error("Gallery item not found");
    }

    // Prepare update object
    const updateData: {
      image?: string;
      description?: string;
    } = {};

    // If image is being updated, validate and delete the old image from storage
    if (image && image !== existingItem.image) {
      validateStorageId(image);
      await ctx.storage.delete(existingItem.image as Id<"_storage">);
      updateData.image = image;
    }

    // Update description if provided
    if (description !== undefined) {
      const sanitizedDescription = sanitizeString(description);
      if (!sanitizedDescription || sanitizedDescription.length === 0) {
        throw new Error("Description cannot be empty");
      }
      if (sanitizedDescription.length > 500) {
        throw new Error("Description is too long (max 500 characters)");
      }
      updateData.description = sanitizedDescription;
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(id, updateData);
    }

    return { success: true };
  },
});

// Mutation to delete a gallery item
export const deleteGallery = mutation({
  args: {
    id: v.id("gallery"),
  },
  handler: async (ctx, args) => {
    const { id } = args;

    // Get the gallery item
    const item = await ctx.db.get(id);

    if (!item) {
      throw new Error("Gallery item not found");
    }

    // Delete the image from storage
    await ctx.storage.delete(item.image);

    // Delete the gallery item from database
    await ctx.db.delete(id);

    return { success: true };
  },
});
