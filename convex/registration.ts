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

// Helper function to validate storage ID
function validateStorageId(storageId: string): void {
  // Check if it looks like a valid Convex storage ID
  if (!storageId || storageId.trim().length === 0) {
    throw new Error("Storage ID is required");
  }

  // Storage IDs should not contain dangerous characters
  if (/<|>|script|javascript:/i.test(storageId)) {
    throw new Error("Invalid storage ID format");
  }
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

// Query to get all registrations
export const getAllRegistrations = query({
  args: {},
  handler: async (ctx) => {
    const registrations = await ctx.db
      .query("registration")
      .order("desc")
      .collect();

    // Get storage URLs for files
    const registrationsWithUrls = await Promise.all(
      registrations.map(async (item) => ({
        ...item,
        registrationCertificateUrl: await ctx.storage.getUrl(
          item.registrationCertificate
        ),
        paymentReceiptUrl: await ctx.storage.getUrl(item.paymentReceipt),
      }))
    );

    return registrationsWithUrls;
  },
});

// Mutation to submit a new registration
export const submitRegistration = mutation({
  args: {
    name: v.string(),
    registrationCertificate: v.string(), // Storage ID
    paymentReceipt: v.string(), // Storage ID
    established: v.string(),
    numberOfMembers: v.number(),
    email: v.string(),
    phoneNumber: v.string(),
    websiteUrl: v.optional(v.string()),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate and sanitize storage IDs
    validateStorageId(args.registrationCertificate);
    validateStorageId(args.paymentReceipt);

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

    // Sanitize and validate email
    const sanitizedEmail = sanitizeString(args.email).toLowerCase();
    validateEmail(sanitizedEmail);

    // Check if email already exists
    const existingRegistration = await ctx.db
      .query("registration")
      .withIndex("by_email", (q) => q.eq("email", sanitizedEmail))
      .first();

    if (existingRegistration) {
      throw new Error("A registration with this email already exists");
    }

    // Sanitize and validate phone number
    const sanitizedPhone = validatePhoneNumber(args.phoneNumber);

    // Validate established date
    validateEstablishedDate(args.established);

    // Validate number of members
    validateNumberOfMembers(args.numberOfMembers);

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

    // Sanitize and validate website URL if provided
    let sanitizedWebsiteUrl: string | undefined = undefined;
    if (args.websiteUrl && args.websiteUrl.trim().length > 0) {
      sanitizedWebsiteUrl = sanitizeString(args.websiteUrl).toLowerCase();
      validateUrl(sanitizedWebsiteUrl);
    }

    // Insert registration with default status as false (pending)
    const registrationId = await ctx.db.insert("registration", {
      name: sanitizedName,
      registrationCertificate: args.registrationCertificate,
      paymentReceipt: args.paymentReceipt,
      established: args.established,
      numberOfMembers: args.numberOfMembers,
      email: sanitizedEmail,
      phoneNumber: sanitizedPhone,
      websiteUrl: sanitizedWebsiteUrl,
      address: sanitizedAddress,
      status: false, // Default to pending approval
    });

    return registrationId;
  },
});

// Mutation to update registration status
export const updateRegistrationStatus = mutation({
  args: {
    id: v.id("registration"),
    status: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, status } = args;

    // Check if registration exists
    const existingRegistration = await ctx.db.get(id);
    if (!existingRegistration) {
      throw new Error("Registration not found");
    }

    // Update the registration status
    await ctx.db.patch(id, {
      status: status,
    });

    // Also update the corresponding member status if exists
    const matchingMember = await ctx.db
      .query("members")
      .withIndex("by_name", (q) => q.eq("name", existingRegistration.name))
      .first();

    if (matchingMember) {
      await ctx.db.patch(matchingMember._id, {
        status: status,
      });
    }

    return { success: true, status: status, memberUpdated: !!matchingMember };
  },
});
