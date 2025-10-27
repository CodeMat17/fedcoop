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

// Helper function to validate required fields
function validateContent(title: string, body: string): void {
  if (!title.trim()) {
    throw new Error("Title is required");
  }
  if (!body.trim()) {
    throw new Error("Body is required");
  }
  if (title.length > 200) {
    throw new Error("Title is too long (max 200 characters)");
  }
  if (body.length > 1000) {
    throw new Error("Body is too long (max 1000 characters)");
  }
}

// ===== MISSION =====

// Query to get mission
export const getMission = query({
  handler: async (ctx) => {
    const mission = await ctx.db.query("mission").first();

    // If no mission exists, return default values
    if (!mission) {
      return {
        _id: null,
        title: "Our Mission",
        body: "To unify Workers Cooperatives for a Better World through Cooperation, Collaboration, Advocacy, Peer Review, Training, Savings and Investments",
      };
    }

    return mission;
  },
});

// Mutation to update mission
export const updateMission = mutation({
  args: {
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Sanitize inputs
    const sanitizedTitle = sanitizeString(args.title);
    const sanitizedBody = sanitizeString(args.body);

    // Validate required fields
    validateContent(sanitizedTitle, sanitizedBody);

    // Check if mission already exists
    const existingMission = await ctx.db.query("mission").first();

    if (existingMission) {
      // Update existing mission
      await ctx.db.patch(existingMission._id, {
        title: sanitizedTitle,
        body: sanitizedBody,
      });
      return { success: true, updated: true };
    } else {
      // Create initial mission (should only happen once)
      await ctx.db.insert("mission", {
        title: sanitizedTitle,
        body: sanitizedBody,
      });
      return { success: true, created: true };
    }
  },
});

// ===== VISION =====

// Query to get vision
export const getVision = query({
  handler: async (ctx) => {
    const vision = await ctx.db.query("vision").first();

    // If no vision exists, return default values
    if (!vision) {
      return {
        _id: null,
        title: "Our Vision",
        body: "A Cooperative Nigeria without Hunger & Poverty",
      };
    }

    return vision;
  },
});

// Mutation to update vision
export const updateVision = mutation({
  args: {
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    // Sanitize inputs
    const sanitizedTitle = sanitizeString(args.title);
    const sanitizedBody = sanitizeString(args.body);

    // Validate required fields
    validateContent(sanitizedTitle, sanitizedBody);

    // Check if vision already exists
    const existingVision = await ctx.db.query("vision").first();

    if (existingVision) {
      // Update existing vision
      await ctx.db.patch(existingVision._id, {
        title: sanitizedTitle,
        body: sanitizedBody,
      });
      return { success: true, updated: true };
    } else {
      // Create initial vision (should only happen once)
      await ctx.db.insert("vision", {
        title: sanitizedTitle,
        body: sanitizedBody,
      });
      return { success: true, created: true };
    }
  },
});
