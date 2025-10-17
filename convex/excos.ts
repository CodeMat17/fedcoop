import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// --- Helper: sanitize string safely ---
function sanitizeString(input?: string): string {
  if (!input) return ""; // prevent undefined errors

  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();

  sanitized = sanitized.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
  return sanitized;
}

// --- Helper: validate storage ID ---
function validateStorageId(storageId: string): void {
  if (!storageId || storageId.trim().length === 0) {
    throw new Error("Storage ID is required");
  }
  if (/<|>|script|javascript:/i.test(storageId)) {
    throw new Error("Invalid storage ID format");
  }
}

// --- Query: Get all excos ---
export const getExcos = query({
  handler: async (ctx) => {
    const excos = await ctx.db.query("excos").collect();

    return await Promise.all(
      excos.map(async (item) => ({
        ...item,
        imageUrl: item.image
          ? await ctx.storage.getUrl(item.image as Id<"_storage">)
          : null,
      }))
    );
  },
});

// --- Mutation: Add new exco ---
export const addExcos = mutation({
  args: {
    image: v.optional(v.string()),
    name: v.string(),
    position: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    // validateStorageId(args.image || '');

    const name = sanitizeString(args.name);
    const position = sanitizeString(args.position);
    const description = sanitizeString(args.description);

    if (!name) throw new Error("Name is required");
    if (!position) throw new Error("Position is required");
    if (name.length > 100) throw new Error("Name too long (max 100 chars)");
    if (position.length > 100)
      throw new Error("Position too long (max 100 chars)");

    return await ctx.db.insert("excos", {
      image: args.image ?? undefined,
      name,
      position,
      description,
    });
  },
});

// --- Mutation: Update exco ---
export const updateExcos = mutation({
  args: {
    id: v.id("excos"),
    image: v.optional(v.string()),
    name: v.optional(v.string()),
    position: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Exco not found");

    const updateData: Partial<{
      image: string;
      name: string;
      position: string;
      description: string;
    }> = {};

    if (args.image && args.image !== existing.image) {
      validateStorageId(args.image);
      await ctx.storage.delete(existing.image as Id<"_storage">);
      updateData.image = args.image;
    }

    if (args.name !== undefined) {
      const name = sanitizeString(args.name);
      if (!name) throw new Error("Name cannot be empty");
      if (name.length > 100) throw new Error("Name too long");
      updateData.name = name;
    }

    if (args.position !== undefined) {
      const position = sanitizeString(args.position);
      if (!position) throw new Error("Position cannot be empty");
      if (position.length > 100) throw new Error("Position too long");
      updateData.position = position;
    }

    if (args.description !== undefined) {
      updateData.description = sanitizeString(args.description);
    }

    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(args.id, updateData);
    }

    return { success: true };
  },
});

// --- Mutation: Delete exco ---
export const deleteExcos = mutation({
  args: { id: v.id("excos") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Exco not found");

    await ctx.storage.delete(item.image as Id<"_storage">);
    await ctx.db.delete(args.id);
    return { success: true };
  },
});
