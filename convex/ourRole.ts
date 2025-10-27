import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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
function validateOurRoleContent(title: string, content: string): void {
  if (!title.trim()) {
    throw new Error("Title is required");
  }
  if (!content.trim()) {
    throw new Error("Content is required");
  }
  if (title.length > 200) {
    throw new Error("Title is too long (max 200 characters)");
  }
  if (content.length > 2000) {
    throw new Error("Content is too long (max 2000 characters)");
  }
}

// Query to get our role content (for admin - returns storage IDs)
export const getOurRole = query({
  handler: async (ctx) => {
    const ourRole = await ctx.db.query("ourRole").first();

    // If no ourRole exists, return default values
    if (!ourRole) {
      return {
        _id: null,
        title: "Our Role in Nigeria's Development",
        content: `FEDCOOP plays a pivotal role in shaping the cooperative landscape in Nigeria. We serve as the central coordinating body that advocates for policy reforms, ensures operational transparency, and builds capacity among member societies through training and digital transformation initiatives.

We also facilitate partnerships between government agencies, private sector stakeholders, and cooperative institutions — creating an enabling environment for innovation, inclusive growth, and socio-economic resilience.

By strengthening the financial and managerial capacity of cooperatives, FEDCOOP contributes to wealth creation, employment generation, and the overall stability of the Nigerian economy.`,
        imageUrl: "/connected.svg",
      };
    }

    return ourRole;
  },
});

// Query for frontend - always resolves image URLs
export const getOurRoleWithImageUrl = query({
  handler: async (ctx) => {
    const ourRole = await ctx.db.query("ourRole").first();

    if (!ourRole) {
      return {
        _id: null,
        title: "Our Role in Nigeria's Development",
        content: `FEDCOOP plays a pivotal role...`,
        imageUrl: "/connected.svg",
      };
    }

    // Get the actual image URL if it's a storage ID
    let imageUrl = ourRole.imageUrl;

    // If imageUrl exists and doesn't start with / or http, assume it's a storage ID
    if (imageUrl && !imageUrl.startsWith("/") && !imageUrl.startsWith("http")) {
      try {
        const storageUrl = await ctx.storage.getUrl(imageUrl as Id<"_storage">);
        // Only use the storage URL if it's not null
        if (storageUrl) {
          imageUrl = storageUrl;
        } else {
          // If storage URL is null, fallback to default
          imageUrl = "/connected.svg";
        }
      } catch (error) {
        console.error("Error getting storage URL:", error);
        imageUrl = "/connected.svg"; // Fallback on error
      }
    }

    // If no imageUrl or it's still a storage ID, use default
    if (
      !imageUrl ||
      (!imageUrl.startsWith("/") && !imageUrl.startsWith("http"))
    ) {
      imageUrl = "/connected.svg";
    }

    return {
      ...ourRole,
      imageUrl,
    };
  },
});

// Unified mutation for updating our role
export const updateOurRole = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Sanitize inputs
    const sanitizedTitle = sanitizeString(args.title);
    const sanitizedContent = sanitizeString(args.content);

    // Don't sanitize imageUrl if it's a storage ID (it's already a clean string)
    const sanitizedImageUrl = args.imageUrl;

    // Validate required fields
    validateOurRoleContent(sanitizedTitle, sanitizedContent);

    // Check if ourRole already exists
    const existingOurRole = await ctx.db.query("ourRole").first();

    if (existingOurRole) {
      // Update existing ourRole
      await ctx.db.patch(existingOurRole._id, {
        title: sanitizedTitle,
        content: sanitizedContent,
        imageUrl: sanitizedImageUrl,
      });
      return { success: true, updated: true };
    } else {
      // Create initial ourRole (should only happen once)
      await ctx.db.insert("ourRole", {
        title: sanitizedTitle,
        content: sanitizedContent,
        imageUrl: sanitizedImageUrl || "/connected.svg",
      });
      return { success: true, created: true };
    }
  },
});

// Mutation to upload image and get storage ID
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
