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

// Helper function to validate and sanitize title
function sanitizeTitle(title: string): string {
  const sanitized = sanitizeString(title);

  if (!sanitized || sanitized.length === 0) {
    throw new Error("Title cannot be empty");
  }

  if (sanitized.length > 200) {
    throw new Error("Title is too long (max 200 characters)");
  }

  return sanitized;
}

// Helper function to validate and sanitize body
function sanitizeBody(body: string): string {
  const sanitized = sanitizeString(body);

  if (!sanitized || sanitized.length === 0) {
    throw new Error("Body cannot be empty");
  }

  if (sanitized.length > 10000) {
    throw new Error("Body is too long (max 10000 characters)");
  }

  return sanitized;
}

// Query to get all news items
export const getAllNews = query({
  handler: async (ctx) => {
    const news = await ctx.db.query("news").collect();

    // Get storage URLs for images
    const newsWithUrls = await Promise.all(
      news.map(async (item) => ({
        ...item,
        imageUrl: await ctx.storage.getUrl(item.image as Id<"_storage">),
      }))
    );

    return newsWithUrls;
  },
});

// Query to get a single news item by ID
export const getNewsById = query({
  args: {
    id: v.id("news"),
  },
  handler: async (ctx, args) => {
    const newsItem = await ctx.db.get(args.id);

    if (!newsItem) {
      return null;
    }

    // Get storage URL for image
    const imageUrl = await ctx.storage.getUrl(newsItem.image as Id<"_storage">);

    return {
      ...newsItem,
      imageUrl,
    };
  },
});

// Mutation to add a new news item
export const addNews = mutation({
  args: {
    image: v.string(), // Storage ID
    title: v.string(),
    body: v.string(),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Sanitize inputs
    const sanitizedTitle = sanitizeTitle(args.title);
    const sanitizedBody = sanitizeBody(args.body);

    // Validate image storage ID format
    if (!args.image || args.image.trim().length === 0) {
      throw new Error("Image is required");
    }

    const newsId = await ctx.db.insert("news", {
      image: args.image,
      title: sanitizedTitle,
      body: sanitizedBody,
      featured: args.featured,
    });

    return newsId;
  },
});

// Mutation to update a news item
export const updateNews = mutation({
  args: {
    id: v.id("news"),
    image: v.optional(v.string()), // Storage ID (optional)
    title: v.optional(v.string()),
    body: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, image, title, body, featured } = args;

    // Get the existing news item
    const existingItem = await ctx.db.get(id);

    if (!existingItem) {
      throw new Error("News item not found");
    }

    // Prepare update object
    const updateData: {
      image?: string;
      title?: string;
      body?: string;
      featured?: boolean;
    } = {};

    // If image is being updated, delete the old image from storage
    if (image && image !== existingItem.image) {
      await ctx.storage.delete(existingItem.image as Id<"_storage">);
      updateData.image = image;
    }

    // Sanitize and validate title if provided
    if (title !== undefined) {
      updateData.title = sanitizeTitle(title);
    }

    // Sanitize and validate body if provided
    if (body !== undefined) {
      updateData.body = sanitizeBody(body);
    }

    // Update featured if provided
    if (featured !== undefined) updateData.featured = featured;

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(id, updateData);
    }

    return { success: true };
  },
});

// Mutation to delete a news item
export const deleteNews = mutation({
  args: {
    id: v.id("news"),
  },
  handler: async (ctx, args) => {
    const { id } = args;

    // Get the news item
    const item = await ctx.db.get(id);

    if (!item) {
      throw new Error("News item not found");
    }

    // Delete the image from storage
    await ctx.storage.delete(item.image as Id<"_storage">);

    // Delete the news item from database
    await ctx.db.delete(id);

    return { success: true };
  },
});
