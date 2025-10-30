import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getVideoEvents = query({
  args: {},
  handler: async (ctx) => {
    const videoEvents = await ctx.db
      .query("videoEvents")
      .withIndex("by_date", (q) => q)
      .order("desc")
      .collect();

    return videoEvents;
  },
});

export const createVideoEvent = mutation({
  args: {
    description: v.string(),
    videoUrl: v.string(),
    captionUrl: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const videoEventId = await ctx.db.insert("videoEvents", {
      description: args.description,
      videoUrl: args.videoUrl,
      captionUrl: args.captionUrl,
      date: args.date,
    });

    return videoEventId;
  },
});

export const updateVideoEvent = mutation({
  args: {
    id: v.id("videoEvents"),
    description: v.string(),
    videoUrl: v.string(),
    captionUrl: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      description: args.description,
      videoUrl: args.videoUrl,
      captionUrl: args.captionUrl,
      date: args.date,
    });

    return args.id;
  },
});

export const deleteVideoEvent = mutation({
  args: {
    id: v.id("videoEvents"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
