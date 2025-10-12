import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
    body: v.string(),
    featured: v.optional(v.boolean()),
  }),

  excos: defineTable({
    image: v.string(),
    name: v.string(),
    position: v.string(),
  }),

  registration: defineTable({
    name: v.string(),
    registrationCertificate: v.string(), // Storage ID for image or PDF
    paymentReceipt: v.string(), // Storage ID for image or PDF
    established: v.string(), // Format: "YYYY-MM" e.g., "2024-01"
    numberOfMembers: v.number(),
    email: v.string(),
    phoneNumber: v.string(),
    websiteUrl: v.optional(v.string()),
    address: v.string(),
    status: v.optional(v.boolean()), // Approval status, default false (pending)
  })
    .index("by_email", ["email"])
    .index("by_name", ["name"])
    .index("by_status", ["status"]),

  members: defineTable({
    name: v.string(),
    established: v.string(), // Format: "YYYY-MM" e.g., "2024-01"
    email: v.string(),
    phoneNumber: v.string(),
    websiteUrl: v.optional(v.string()),
    address: v.string(),
    status: v.optional(v.boolean()), // Active/Inactive status
    numberOfMembers: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_name", ["name"])
    .index("by_status", ["status"]),
});
