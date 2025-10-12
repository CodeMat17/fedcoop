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

// Query to get all excos
export const getExcos = query({
  handler: async (ctx) => {
    const excos = await ctx.db.query("excos").collect();

    // Get storage URLs for images
    const excosWithUrls = await Promise.all(
      excos.map(async (item) => ({
        ...item,
        imageUrl: await ctx.storage.getUrl(item.image as Id<"_storage">),
      }))
    );

    return excosWithUrls;
  },
});

// Mutation to add a new exco
export const addExcos = mutation({
  args: {
    image: v.string(), // Storage ID
    name: v.string(),
    position: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate and sanitize storage ID
    validateStorageId(args.image);

    // Sanitize and validate name
    const sanitizedName = sanitizeString(args.name);
    if (!sanitizedName || sanitizedName.length === 0) {
      throw new Error("Name is required");
    }
    if (sanitizedName.length > 100) {
      throw new Error("Name is too long (max 100 characters)");
    }

    // Sanitize and validate position
    const sanitizedPosition = sanitizeString(args.position);
    if (!sanitizedPosition || sanitizedPosition.length === 0) {
      throw new Error("Position is required");
    }
    if (sanitizedPosition.length > 100) {
      throw new Error("Position is too long (max 100 characters)");
    }

    const excoId = await ctx.db.insert("excos", {
      image: args.image,
      name: sanitizedName,
      position: sanitizedPosition,
    });

    return excoId;
  },
});

// Mutation to update an exco
export const updateExcos = mutation({
  args: {
    id: v.id("excos"),
    image: v.optional(v.string()), // Storage ID (optional)
    name: v.optional(v.string()),
    position: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, image, name, position } = args;

    // Get the existing exco
    const existingItem = await ctx.db.get(id);

    if (!existingItem) {
      throw new Error("Exco not found");
    }

    // Prepare update object
    const updateData: {
      image?: string;
      name?: string;
      position?: string;
    } = {};

    // If image is being updated, validate and delete the old image from storage
    if (image && image !== existingItem.image) {
      validateStorageId(image);
      await ctx.storage.delete(existingItem.image as Id<"_storage">);
      updateData.image = image;
    }

    // Update name if provided
    if (name !== undefined) {
      const sanitizedName = sanitizeString(name);
      if (!sanitizedName || sanitizedName.length === 0) {
        throw new Error("Name cannot be empty");
      }
      if (sanitizedName.length > 100) {
        throw new Error("Name is too long (max 100 characters)");
      }
      updateData.name = sanitizedName;
    }

    // Update position if provided
    if (position !== undefined) {
      const sanitizedPosition = sanitizeString(position);
      if (!sanitizedPosition || sanitizedPosition.length === 0) {
        throw new Error("Position cannot be empty");
      }
      if (sanitizedPosition.length > 100) {
        throw new Error("Position is too long (max 100 characters)");
      }
      updateData.position = sanitizedPosition;
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(id, updateData);
    }

    return { success: true };
  },
});

// Mutation to delete an exco
export const deleteExcos = mutation({
  args: {
    id: v.id("excos"),
  },
  handler: async (ctx, args) => {
    const { id } = args;

    // Get the exco
    const item = await ctx.db.get(id);

    if (!item) {
      throw new Error("Exco not found");
    }

    // Delete the image from storage
    await ctx.storage.delete(item.image as Id<"_storage">);

    // Delete the exco from database
    await ctx.db.delete(id);

    return { success: true };
  },
});
