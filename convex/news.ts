import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Helper function to sanitize string input (for plain text fields)
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

// Helper function to sanitize HTML content (for rich text fields)
function sanitizeHtmlBody(input: string): string {
  // Remove script tags and other dangerous elements
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed[^>]*>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove dangerous event handlers and attributes
  sanitized = sanitized
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/javascript:/gi, "");

  return sanitized.trim();
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .substring(0, 100); // Limit length
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
  const sanitized = sanitizeHtmlBody(body);

  if (!sanitized || sanitized.length === 0) {
    throw new Error("Body cannot be empty");
  }

  if (sanitized.length > 50000) {
    throw new Error("Body is too long (max 50000 characters)");
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

// Query to get a single news item by slug
export const getNewsBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const newsItem = await ctx.db
      .query("news")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

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

    // Generate slug from title
    const slug = generateSlug(sanitizedTitle);

    // Check if slug already exists and make it unique if needed
    let uniqueSlug = slug;
    let counter = 1;
    while (
      (await ctx.db
        .query("news")
        .withIndex("by_slug", (q) => q.eq("slug", uniqueSlug))
        .first()) !== null
    ) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const newsId = await ctx.db.insert("news", {
      image: args.image,
      title: sanitizedTitle,
      slug: uniqueSlug,
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
      slug?: string;
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

      // Regenerate slug if title is updated
      const newSlug = generateSlug(updateData.title);

      // Check if slug already exists (excluding current item) and make it unique if needed
      let uniqueSlug = newSlug;
      let counter = 1;
      let existingSlugItem = await ctx.db
        .query("news")
        .withIndex("by_slug", (q) => q.eq("slug", uniqueSlug))
        .first();

      while (existingSlugItem !== null && existingSlugItem._id !== id) {
        uniqueSlug = `${newSlug}-${counter}`;
        counter++;
        existingSlugItem = await ctx.db
          .query("news")
          .withIndex("by_slug", (q) => q.eq("slug", uniqueSlug))
          .first();
      }

      updateData.slug = uniqueSlug;
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
