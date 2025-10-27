import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper function to sanitize string input
function sanitizeString(input: string): string {
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();

  sanitized = sanitized.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
  return sanitized;
}

// Helper function to validate required fields
function validateHeroContent(title: string, subtitle: string): void {
  if (!title.trim()) {
    throw new Error("Title is required");
  }
  if (!subtitle.trim()) {
    throw new Error("Subtitle is required");
  }
  if (title.length > 300) {
    throw new Error("Title is too long (max 300 characters)");
  }
  if (subtitle.length > 500) {
    throw new Error("Subtitle is too long (max 500 characters)");
  }
}

// Query to get hero content
export const getHero = query({
  handler: async (ctx) => {
    const hero = await ctx.db.query("hero").first();

    // If no hero exists, return default values
    if (!hero) {
      return {
        _id: null,
        title:
          "Federal Civil Service Staff of Nigeria Cooperative Societies Union Limited (FEDCOOP)",
        subtitle:
          "Unifying Workers Cooperatives for a Better World through Cooperation, Collaboration, Advocacy, Peer Review, Training and Investment.",
      };
    }

    return hero;
  },
});

// Mutation to update hero content
export const updateHero = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
  },
  handler: async (ctx, args) => {
    // Sanitize inputs
    const sanitizedTitle = sanitizeString(args.title);
    const sanitizedSubtitle = sanitizeString(args.subtitle);

    // Validate required fields
    validateHeroContent(sanitizedTitle, sanitizedSubtitle);

    // Check if hero already exists
    const existingHero = await ctx.db.query("hero").first();

    if (existingHero) {
      // Update existing hero
      await ctx.db.patch(existingHero._id, {
        title: sanitizedTitle,
        subtitle: sanitizedSubtitle,
      });
      return { success: true, updated: true };
    } else {
      // Create initial hero (should only happen once)
      await ctx.db.insert("hero", {
        title: sanitizedTitle,
        subtitle: sanitizedSubtitle,
      });
      return { success: true, created: true };
    }
  },
});
