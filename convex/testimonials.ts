import { v } from "convex/values";
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

// Helper function to validate rating
function validateRating(rating: number): void {
  if (rating < 0 || rating > 5) {
    throw new Error("Rating must be between 0 and 5");
  }
  if (!Number.isInteger(rating)) {
    throw new Error("Rating must be a whole number");
  }
}

// Query to get all testimonials
export const getAllTestimonials = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("testimonials").order("desc").collect();
  },
});

// Mutation to add a new testimonial
export const addTestimonial = mutation({
  args: {
    name: v.string(),
    body: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    // Validate rating
    validateRating(args.rating);

    // Sanitize and validate name
    const sanitizedName = sanitizeString(args.name);
    if (!sanitizedName || sanitizedName.length === 0) {
      throw new Error("Name is required");
    }
    if (sanitizedName.length > 100) {
      throw new Error("Name is too long (max 100 characters)");
    }

    // Sanitize and validate body
    const sanitizedBody = sanitizeString(args.body);
    if (!sanitizedBody || sanitizedBody.length === 0) {
      throw new Error("Body is required");
    }
    if (sanitizedBody.length > 1000) {
      throw new Error("Body is too long (max 1000 characters)");
    }

    const testimonialId = await ctx.db.insert("testimonials", {
      name: sanitizedName,
      body: sanitizedBody,
      rating: args.rating,
    });

    return testimonialId;
  },
});

// Mutation to update a testimonial
export const updateTestimonial = mutation({
  args: {
    id: v.id("testimonials"),
    name: v.string(),
    body: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, name, body, rating } = args;

    // Check if testimonial exists
    const existingTestimonial = await ctx.db.get(id);
    if (!existingTestimonial) {
      throw new Error("Testimonial not found");
    }

    // Validate rating
    validateRating(rating);

    // Sanitize and validate name
    const sanitizedName = sanitizeString(name);
    if (!sanitizedName || sanitizedName.length === 0) {
      throw new Error("Name is required");
    }
    if (sanitizedName.length > 100) {
      throw new Error("Name is too long (max 100 characters)");
    }

    // Sanitize and validate body
    const sanitizedBody = sanitizeString(body);
    if (!sanitizedBody || sanitizedBody.length === 0) {
      throw new Error("Body is required");
    }
    if (sanitizedBody.length > 1000) {
      throw new Error("Body is too long (max 1000 characters)");
    }

    // Update the testimonial
    await ctx.db.patch(id, {
      name: sanitizedName,
      body: sanitizedBody,
      rating: rating,
    });

    return await ctx.db.get(id);
  },
});

// Mutation to delete a testimonial
export const deleteTestimonial = mutation({
  args: {
    id: v.id("testimonials"),
  },
  handler: async (ctx, args) => {
    // Check if testimonial exists
    const existingTestimonial = await ctx.db.get(args.id);
    if (!existingTestimonial) {
      throw new Error("Testimonial not found");
    }

    // Delete the testimonial
    await ctx.db.delete(args.id);

    return { success: true, deletedId: args.id };
  },
});
