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

// ===== ABOUT SECTION QUERIES & MUTATIONS =====

// Get about section content
export const getAbout = query({
  handler: async (ctx) => {
    const about = await ctx.db.query("about").first();

    // If no about exists, return default values
    if (!about) {
      return {
        _id: null,
        tagline: "FEDCOOP",
        description:
          "is a secondary cooperative body that unites all Staff Cooperative Societies operating within Federal Government Ministries and MDAs. We promote collaboration, accountability, and sustainable development through the cooperative spirit of mutual benefit.",
      };
    }

    return about;
  },
});

// Update about section
export const updateAbout = mutation({
  args: {
    tagline: v.optional(v.string()),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    // Sanitize inputs
    const sanitizedTagline = args.tagline
      ? sanitizeString(args.tagline)
      : undefined;
    const sanitizedDescription = sanitizeString(args.description);

    // Validate required fields
    if (!sanitizedDescription.trim()) {
      throw new Error("Description is required");
    }
    if (sanitizedTagline && sanitizedTagline.length > 50) {
      throw new Error("Tagline is too long (max 50 characters)");
    }
    if (sanitizedDescription.length > 1000) {
      throw new Error("Description is too long (max 1000 characters)");
    }

    // Check if about already exists
    const existingAbout = await ctx.db.query("about").first();

    if (existingAbout) {
      // Update existing about
      await ctx.db.patch(existingAbout._id, {
        tagline: sanitizedTagline,
        description: sanitizedDescription,
      });
      return { success: true, updated: true };
    } else {
      // Create initial about
      await ctx.db.insert("about", {
        tagline: sanitizedTagline,
        description: sanitizedDescription,
      });
      return { success: true, created: true };
    }
  },
});

// ===== ABOUT FEATURES QUERIES & MUTATIONS =====

// Mutation to initialize default features
export const initializeAboutFeatures = mutation({
  handler: async (ctx) => {
    const existingFeatures = await ctx.db.query("aboutFeatures").collect();

    if (existingFeatures.length === 0) {
      const initialFeatures = [
        {
          title: "Cooperative Unity",
          description:
            "Uniting all Staff Cooperative Societies across Federal Government MDAs for collective growth and development.",
          iconName: "Users",
          order: 1,
        },
        {
          title: "Financial Empowerment",
          description:
            "Providing financial services and support to enhance members' economic well-being and stability.",
          iconName: "Shield",
          order: 2,
        },
        {
          title: "Capacity Building",
          description:
            "Offering training and development programs to strengthen cooperative management and operations.",
          iconName: "BookOpen",
          order: 3,
        },
        {
          title: "Sustainable Development",
          description:
            "Promoting environmentally and economically sustainable practices within the cooperative movement.",
          iconName: "Leaf",
          order: 4,
        },
      ];

      // Insert initial features into the database
      for (const feature of initialFeatures) {
        await ctx.db.insert("aboutFeatures", feature);
      }

      return { success: true, initialized: true };
    }

    return { success: true, alreadyInitialized: true };
  },
});

// Get all about features, ordered by order field
export const getAboutFeatures = query({
  handler: async (ctx) => {
    const aboutFeatures = await ctx.db
      .query("aboutFeatures")
      .withIndex("by_order", (q) => q)
      .order("asc")
      .collect();

    return aboutFeatures;
  },
});

// Update an about feature
export const updateAboutFeature = mutation({
  args: {
    id: v.id("aboutFeatures"),
    title: v.string(),
    description: v.string(),
    iconName: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    // Sanitize inputs
    const sanitizedTitle = sanitizeString(args.title);
    const sanitizedDescription = sanitizeString(args.description);
    const sanitizedIconName = sanitizeString(args.iconName);

    // Validate required fields
    if (!sanitizedTitle.trim()) {
      throw new Error("Title is required");
    }
    if (!sanitizedDescription.trim()) {
      throw new Error("Description is required");
    }
    if (!sanitizedIconName.trim()) {
      throw new Error("Icon name is required");
    }

    // Update about feature
    await ctx.db.patch(args.id, {
      title: sanitizedTitle,
      description: sanitizedDescription,
      iconName: sanitizedIconName,
      order: args.order,
    });

    return { success: true };
  },
});

// Reorder about features
export const reorderAboutFeatures = mutation({
  args: {
    featureOrders: v.array(
      v.object({
        id: v.id("aboutFeatures"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Update each about feature with new order
    for (const featureOrder of args.featureOrders) {
      await ctx.db.patch(featureOrder.id, {
        order: featureOrder.order,
      });
    }

    return { success: true };
  },
});
