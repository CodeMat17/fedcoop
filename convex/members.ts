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

// Helper function to validate established date (YYYY-MM format)
function validateEstablishedDate(date: string): void {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
  if (!dateRegex.test(date)) {
    throw new Error(
      "Established date must be in YYYY-MM format (e.g., 2024-01)"
    );
  }

  const [year] = date.split("-").map(Number);
  const currentYear = new Date().getFullYear();

  if (year < 1900 || year > currentYear) {
    throw new Error(`Year must be between 1900 and ${currentYear}`);
  }
}

// Helper function to validate number of members
function validateNumberOfMembers(count: number): void {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error("Number of members must be a positive integer");
  }
  if (count > 1000000) {
    throw new Error("Number of members exceeds maximum allowed");
  }
}

// Query to get all members
export const getAllMembers = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("members").collect();

    // Sort alphabetically by name
    return members.sort((a, b) => a.name.localeCompare(b.name));
  },
});

// Mutation to add a new member
export const addMember = mutation({
  args: {
    name: v.string(),
    established: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    websiteUrl: v.optional(v.string()),
    address: v.string(),
    status: v.optional(v.boolean()),
    numberOfMembers: v.number(),
  },
  handler: async (ctx, args) => {
    // Sanitize and validate name
    const sanitizedName = sanitizeString(args.name);
    if (!sanitizedName || sanitizedName.length === 0) {
      throw new Error("Name is required");
    }
    if (sanitizedName.length < 3) {
      throw new Error("Name must be at least 3 characters");
    }
    if (sanitizedName.length > 200) {
      throw new Error("Name is too long (max 200 characters)");
    }

    // Validate established date
    validateEstablishedDate(args.established);

    // Sanitize and validate email
    const sanitizedEmail = sanitizeString(args.email).toLowerCase();
    validateEmail(sanitizedEmail);

    // Check if email already exists
    const existingEmail = await ctx.db
      .query("members")
      .withIndex("by_email", (q) => q.eq("email", sanitizedEmail))
      .first();

    if (existingEmail) {
      throw new Error("A member with this email already exists");
    }

    // Sanitize and validate phone number
    const sanitizedPhone = validatePhoneNumber(args.phoneNumber);

    // Sanitize and validate website URL if provided
    let sanitizedWebsiteUrl: string | undefined = undefined;
    if (args.websiteUrl && args.websiteUrl.trim().length > 0) {
      sanitizedWebsiteUrl = sanitizeString(args.websiteUrl).toLowerCase();
      validateUrl(sanitizedWebsiteUrl);
    }

    // Sanitize and validate address
    const sanitizedAddress = sanitizeString(args.address);
    if (!sanitizedAddress || sanitizedAddress.length === 0) {
      throw new Error("Address is required");
    }
    if (sanitizedAddress.length < 10) {
      throw new Error("Address must be at least 10 characters");
    }
    if (sanitizedAddress.length > 500) {
      throw new Error("Address is too long (max 500 characters)");
    }

    // Validate number of members
    validateNumberOfMembers(args.numberOfMembers);

    // Insert member
    const memberId = await ctx.db.insert("members", {
      name: sanitizedName,
      established: args.established,
      email: sanitizedEmail,
      phoneNumber: sanitizedPhone,
      websiteUrl: sanitizedWebsiteUrl,
      address: sanitizedAddress,
      status: args.status !== undefined ? args.status : true, // Default to active
      numberOfMembers: args.numberOfMembers,
    });

    return memberId;
  },
});

// Mutation to update a member
export const updateMember = mutation({
  args: {
    id: v.id("members"),
    name: v.optional(v.string()),
    established: v.optional(v.string()),
    email: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    address: v.optional(v.string()),
    status: v.optional(v.boolean()),
    numberOfMembers: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;

    // Check if member exists
    const existingMember = await ctx.db.get(id);
    if (!existingMember) {
      throw new Error("Member not found");
    }

    // Prepare update object
    const updateData: {
      name?: string;
      established?: string;
      email?: string;
      phoneNumber?: string;
      websiteUrl?: string;
      address?: string;
      status?: boolean;
      numberOfMembers?: number;
    } = {};

    // Sanitize and validate name if provided
    if (updateFields.name !== undefined) {
      const sanitizedName = sanitizeString(updateFields.name);
      if (!sanitizedName || sanitizedName.length === 0) {
        throw new Error("Name cannot be empty");
      }
      if (sanitizedName.length < 3) {
        throw new Error("Name must be at least 3 characters");
      }
      if (sanitizedName.length > 200) {
        throw new Error("Name is too long (max 200 characters)");
      }
      updateData.name = sanitizedName;
    }

    // Validate established date if provided
    if (updateFields.established !== undefined) {
      validateEstablishedDate(updateFields.established);
      updateData.established = updateFields.established;
    }

    // Sanitize and validate email if provided
    if (updateFields.email !== undefined) {
      const sanitizedEmail = sanitizeString(updateFields.email).toLowerCase();
      validateEmail(sanitizedEmail);

      // Check if email already exists (excluding current member)
      const existingEmail = await ctx.db
        .query("members")
        .withIndex("by_email", (q) => q.eq("email", sanitizedEmail))
        .first();

      if (existingEmail && existingEmail._id !== id) {
        throw new Error("A member with this email already exists");
      }

      updateData.email = sanitizedEmail;
    }

    // Sanitize and validate phone number if provided
    if (updateFields.phoneNumber !== undefined) {
      const sanitizedPhone = validatePhoneNumber(updateFields.phoneNumber);
      updateData.phoneNumber = sanitizedPhone;
    }

    // Sanitize and validate website URL if provided
    if (updateFields.websiteUrl !== undefined) {
      if (
        updateFields.websiteUrl &&
        updateFields.websiteUrl.trim().length > 0
      ) {
        const sanitizedWebsiteUrl = sanitizeString(
          updateFields.websiteUrl
        ).toLowerCase();
        validateUrl(sanitizedWebsiteUrl);
        updateData.websiteUrl = sanitizedWebsiteUrl;
      } else {
        updateData.websiteUrl = undefined;
      }
    }

    // Sanitize and validate address if provided
    if (updateFields.address !== undefined) {
      const sanitizedAddress = sanitizeString(updateFields.address);
      if (!sanitizedAddress || sanitizedAddress.length === 0) {
        throw new Error("Address cannot be empty");
      }
      if (sanitizedAddress.length < 10) {
        throw new Error("Address must be at least 10 characters");
      }
      if (sanitizedAddress.length > 500) {
        throw new Error("Address is too long (max 500 characters)");
      }
      updateData.address = sanitizedAddress;
    }

    // Update status if provided
    if (updateFields.status !== undefined) {
      updateData.status = updateFields.status;
    }

    // Validate number of members if provided
    if (updateFields.numberOfMembers !== undefined) {
      validateNumberOfMembers(updateFields.numberOfMembers);
      updateData.numberOfMembers = updateFields.numberOfMembers;
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await ctx.db.patch(id, updateData);
    }

    return { success: true };
  },
});

// Mutation to delete a member
export const deleteMember = mutation({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const { id } = args;

    // Check if member exists
    const member = await ctx.db.get(id);
    if (!member) {
      throw new Error("Member not found");
    }

    // Delete the member from database
    await ctx.db.delete(id);

    return { success: true, deletedId: id };
  },
});
