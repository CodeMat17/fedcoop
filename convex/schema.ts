import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    tokenIdentifier: v.string(),
    phoneNo: v.optional(v.string()),
    coopName: v.optional(v.string()),
    role: v.optional(
      v.union(v.literal("null"), v.literal("coop"), v.literal("admin"))
    ),
  }).index("by_token", ["tokenIdentifier"]),

  cooperatives: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    address: v.optional(v.string()),
    certificate: v.optional(v.string()),
    paymentReceipt: v.optional(v.string()),
    status: v.union(
      v.literal("inactive"),
      v.literal("active"),
      v.literal("processing")
    ),
  })
    .index("by_name", ["name"])
    .index("by_status", ["status"])
    .index("by_email", ["email"]),

  testimonials: defineTable({
    name: v.string(),
    body: v.string(),
    rating: v.number(),
  }).index("by_name", ["name"]),

  gallery: defineTable({
    image: v.string(),
    description: v.string(),
  }),

  news: defineTable({
    image: v.string(),
    title: v.string(),
    slug: v.string(),
    body: v.string(),
    featured: v.optional(v.boolean()),
  }).index("by_slug", ["slug"]),

  excos: defineTable({
    image: v.optional(v.string()),
    name: v.string(),
    position: v.string(),
    description: v.string(),
  }),

  registration: defineTable({
    name: v.string(),
    registrationCertificate: v.string(), // Storage ID for image or PDF
    paymentReceipt: v.string(), // Storage ID for image or PDF
    email: v.string(),
    phoneNumber: v.string(),
    websiteUrl: v.optional(v.string()),
    address: v.string(),
    status: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_name", ["name"])
    .index("by_status", ["status"]),

  members: defineTable({
    name: v.string(),
    established: v.optional(v.string()),
    email: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    address: v.optional(v.string()),
    status: v.union(
      v.literal("inactive"),
      v.literal("active"),
      v.literal("processing")
    ),
    numberOfMembers: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_name", ["name"])
    .index("by_status", ["status"]),

  hero: defineTable({
    title: v.string(),
    subtitle: v.string(),
  }),

  mission: defineTable({
    title: v.string(),
    body: v.string(),
  }),

  vision: defineTable({
    title: v.string(),
    body: v.string(),
  }),

  ourRole: defineTable({
    title: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
  }),

  about: defineTable({
    tagline: v.optional(v.string()),
    description: v.string(),
  }),

  aboutFeatures: defineTable({
    title: v.string(),
    description: v.string(),
    order: v.number(),
    iconName: v.string(),
  }).index("by_order", ["order"]),

  videoEvents: defineTable({
    description: v.string(),
    videoUrl: v.string(), // YouTube URL
    captionUrl: v.optional(v.string()),
    date: v.string(), // ISO string (use dayjs().toISOString())
  }).index("by_date", ["date"]),
});
