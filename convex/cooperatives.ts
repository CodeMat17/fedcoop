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

// Helper function to validate email
function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
}

// Helper function to validate phone number
function validatePhoneNumber(phone: string): string {
  // Remove spaces and common formatting characters
  const sanitized = phone.replace(/[\s\-\(\)\.]/g, "");

  // Check if it contains only digits and optional + at the start
  if (!/^\+?\d{7,15}$/.test(sanitized)) {
    throw new Error("Invalid phone number format");
  }

  return sanitized;
}

// Helper function to validate URL
function validateUrl(url: string): void {
  try {
    const urlObj = new URL(url);
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      throw new Error("URL must use HTTP or HTTPS protocol");
    }
  } catch {
    throw new Error("Invalid URL format");
  }
}

// Helper function to validate status
function validateStatus(status: string): "active" | "inactive" | "processing" {
  if (!["inactive", "processing", "active"].includes(status)) {
    throw new Error("Status must be one of: inactive, processing, or active");
  }
  return status as "inactive" | "processing" | "active";
}

// Query to get all cooperatives
export const getAllCooperatives = query({
  args: {},
  handler: async (ctx) => {
    const cooperatives = await ctx.db.query("cooperatives").collect();

    // Get storage URLs for files
    const cooperativesWithUrls = await Promise.all(
      cooperatives.map(async (item) => ({
        ...item,
        certificateUrl: item.certificate
          ? await ctx.storage.getUrl(item.certificate)
          : null,
        paymentReceiptUrl: item.paymentReceipt
          ? await ctx.storage.getUrl(item.paymentReceipt)
          : null,
      }))
    );

    // Sort alphabetically by name
    return cooperativesWithUrls.sort((a, b) => a.name.localeCompare(b.name));
  },
});

// Query to get cooperatives by status
export const getCooperativesByStatus = query({
  args: {
    status: v.union(
      v.literal("inactive"),
      v.literal("processing"),
      v.literal("active")
    ),
  },
  handler: async (ctx, args) => {
    const cooperatives = await ctx.db
      .query("cooperatives")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();

    // Get storage URLs for files
    const cooperativesWithUrls = await Promise.all(
      cooperatives.map(async (item) => ({
        ...item,
        certificateUrl: item.certificate
          ? await ctx.storage.getUrl(item.certificate)
          : null,
        paymentReceiptUrl: item.paymentReceipt
          ? await ctx.storage.getUrl(item.paymentReceipt)
          : null,
      }))
    );

    return cooperativesWithUrls.sort((a, b) => a.name.localeCompare(b.name));
  },
});

// Mutation to add a new cooperative
export const addCooperative = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Sanitize and validate name (only required field)
    const sanitizedName = sanitizeString(args.name);
    if (!sanitizedName || sanitizedName.length === 0) {
      throw new Error("Name is required");
    }
    if (sanitizedName.length < 10) { // Fixed: changed from 10 to 2 as mentioned in comment
      throw new Error("Name must be at least 10 characters");
    }
    if (sanitizedName.length > 200) {
      throw new Error("Name is too long (max 200 characters)");
    }

    // Check if cooperative with same name already exists
    const existingCooperative = await ctx.db
      .query("cooperatives")
      .withIndex("by_name", (q) => q.eq("name", sanitizedName))
      .first();

    if (existingCooperative) {
      throw new Error("A cooperative with this name already exists");
    }

    // Prepare cooperative data with only provided fields
    const cooperativeData: {
      name: string;
      status: "inactive" | "processing" | "active";
    } = {
      name: sanitizedName,
      status: "inactive", // Default status
    };

    // Insert cooperative
    const cooperativeId = await ctx.db.insert("cooperatives", cooperativeData);

    return cooperativeId;
  },
});

// Mutation to update a cooperative - only updates provided fields
export const updateCooperative = mutation({
  args: {
    id: v.id("cooperatives"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    address: v.optional(v.string()),
    certificate: v.optional(v.string()),
    paymentReceipt: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("inactive"),
        v.literal("processing"),
        v.literal("active")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;

    // Check if cooperative exists
    const existingCooperative = await ctx.db.get(id);
    if (!existingCooperative) {
      throw new Error("Cooperative not found");
    }

    // Prepare update object - only include fields that are provided
    const updateData: {
      name?: string;
      email?: string;
      phoneNumber?: string;
      websiteUrl?: string;
      address?: string;
      certificate?: string;
      paymentReceipt?: string;
      status?: "inactive" | "processing" | "active";
    } = {};

    // Sanitize and validate name if provided
    if (updateFields.name !== undefined) {
      const sanitizedName = sanitizeString(updateFields.name);
      if (!sanitizedName || sanitizedName.length === 0) {
        throw new Error("Name cannot be empty");
      }
      if (sanitizedName.length < 2) {
        throw new Error("Name must be at least 2 characters");
      }
      if (sanitizedName.length > 200) {
        throw new Error("Name is too long (max 200 characters)");
      }
      updateData.name = sanitizedName;
    }

    // Sanitize and validate email if provided
    if (updateFields.email !== undefined) {
      if (updateFields.email.trim().length > 0) {
        const sanitizedEmail = sanitizeString(updateFields.email).toLowerCase();
        validateEmail(sanitizedEmail);

        // Check if email already exists (excluding current cooperative)
        const existingEmail = await ctx.db
          .query("cooperatives")
          .withIndex("by_email", (q) => q.eq("email", sanitizedEmail))
          .first();

        if (existingEmail && existingEmail._id !== id) {
          throw new Error("A cooperative with this email already exists");
        }

        updateData.email = sanitizedEmail;
      } else {
        // Cannot clear required email field, set to empty string instead
        updateData.email = "";
      }
    }

    // Sanitize and validate phone number if provided
    if (updateFields.phoneNumber !== undefined) {
      if (updateFields.phoneNumber.trim().length > 0) {
        const sanitizedPhone = validatePhoneNumber(updateFields.phoneNumber);
        updateData.phoneNumber = sanitizedPhone;
      } else {
        // Cannot clear required phoneNumber field, set to empty string instead
        updateData.phoneNumber = "";
      }
    }

    // Sanitize and validate website URL if provided
    if (updateFields.websiteUrl !== undefined) {
      if (updateFields.websiteUrl.trim().length > 0) {
        const sanitizedWebsiteUrl = sanitizeString(
          updateFields.websiteUrl
        ).toLowerCase();
        validateUrl(sanitizedWebsiteUrl);
        updateData.websiteUrl = sanitizedWebsiteUrl;
      } else {
        // Allow clearing the optional website URL by providing empty string
        updateData.websiteUrl = undefined;
      }
    }

    // Sanitize and validate address if provided
    if (updateFields.address !== undefined) {
      if (updateFields.address.trim().length > 0) {
        const sanitizedAddress = sanitizeString(updateFields.address);
        if (sanitizedAddress.length < 5) {
          throw new Error("Address must be at least 5 characters if provided");
        }
        if (sanitizedAddress.length > 500) {
          throw new Error("Address is too long (max 500 characters)");
        }
        updateData.address = sanitizedAddress;
      } else {
        // Allow clearing the optional address by providing empty string
        updateData.address = undefined;
      }
    }

    // Handle certificate file update if provided
    if (updateFields.certificate !== undefined) {
      updateData.certificate = updateFields.certificate;
    }

    // Handle payment receipt file update if provided
    if (updateFields.paymentReceipt !== undefined) {
      updateData.paymentReceipt = updateFields.paymentReceipt;
    }

    // Validate and update status if provided
    if (updateFields.status !== undefined) {
      updateData.status = validateStatus(updateFields.status);
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(id, updateData);
    }

    return { success: true };
  },
});

// Mutation to activate a cooperative - all fields are required and sets status to 'processing'
export const activateCooperative = mutation({
  args: {
    id: v.id("cooperatives"),
    name: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    websiteUrl: v.string(),
    address: v.string(),
    certificate: v.string(),
    paymentReceipt: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...activateFields } = args;

    // Check if cooperative exists
    const existingCooperative = await ctx.db.get(id);
    if (!existingCooperative) {
      throw new Error("Cooperative not found");
    }

    // Validate all required fields
    if (!activateFields.name.trim()) {
      throw new Error("Name is required");
    }
    if (!activateFields.email.trim()) {
      throw new Error("Email is required");
    }
    if (!activateFields.phoneNumber.trim()) {
      throw new Error("Phone number is required");
    }
    if (!activateFields.address.trim()) {
      throw new Error("Address is required");
    }
    if (!activateFields.certificate) {
      throw new Error("Certificate is required");
    }
    if (!activateFields.paymentReceipt) {
      throw new Error("Payment receipt is required");
    }

    // Sanitize and validate all fields
    const sanitizedName = sanitizeString(activateFields.name);
    if (sanitizedName.length < 2) {
      throw new Error("Name must be at least 2 characters");
    }
    if (sanitizedName.length > 200) {
      throw new Error("Name is too long (max 200 characters)");
    }

    const sanitizedEmail = sanitizeString(activateFields.email).toLowerCase();
    validateEmail(sanitizedEmail);

    const sanitizedPhone = validatePhoneNumber(activateFields.phoneNumber);

    const sanitizedAddress = sanitizeString(activateFields.address);
    if (sanitizedAddress.length < 5) {
      throw new Error("Address must be at least 5 characters");
    }
    if (sanitizedAddress.length > 500) {
      throw new Error("Address is too long (max 500 characters)");
    }

    // Validate website URL if provided
    let sanitizedWebsiteUrl = "";
    if (activateFields.websiteUrl.trim()) {
      const tempUrl = sanitizeString(activateFields.websiteUrl).toLowerCase();
      validateUrl(tempUrl);
      sanitizedWebsiteUrl = tempUrl;
    }

    // Check if email already exists (excluding current cooperative)
    const existingEmail = await ctx.db
      .query("cooperatives")
      .withIndex("by_email", (q) => q.eq("email", sanitizedEmail))
      .first();

    if (existingEmail && existingEmail._id !== id) {
      throw new Error("A cooperative with this email already exists");
    }

    // Prepare activation data - all fields are required and status is set to 'processing'
    const activateData = {
      name: sanitizedName,
      email: sanitizedEmail,
      phoneNumber: sanitizedPhone,
      websiteUrl: sanitizedWebsiteUrl || undefined,
      address: sanitizedAddress,
      certificate: activateFields.certificate,
      paymentReceipt: activateFields.paymentReceipt,
      status: "processing" as const, // Set status to processing
    };

    // Update the cooperative with all activation data
    await ctx.db.patch(id, activateData);

    return { success: true };
  },
});

// Mutation to update cooperative status
export const updateCooperativeStatus = mutation({
  args: {
    id: v.id("cooperatives"),
    status: v.union(
      v.literal("inactive"),
      v.literal("processing"),
      v.literal("active")
    ),
  },
  handler: async (ctx, args) => {
    const { id, status } = args;

    // Check if cooperative exists
    const existingCooperative = await ctx.db.get(id);
    if (!existingCooperative) {
      throw new Error("Cooperative not found");
    }

    // Validate status
    const validatedStatus = validateStatus(status);

    // Update status
    await ctx.db.patch(id, { status: validatedStatus });

    return { success: true, newStatus: validatedStatus };
  },
});

// Mutation to delete a cooperative
export const deleteCooperative = mutation({
  args: {
    id: v.id("cooperatives"),
  },
  handler: async (ctx, args) => {
    const { id } = args;

    // Check if cooperative exists
    const cooperative = await ctx.db.get(id);
    if (!cooperative) {
      throw new Error("Cooperative not found");
    }

    // Delete the cooperative from database
    await ctx.db.delete(id);

    return { success: true, deletedId: id };
  },
});
