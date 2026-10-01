import mongoose from "mongoose";
import { z } from "zod";
import { env } from "../config/env.js";

const text = (max) => z.string().trim().max(max);
const objectId = z.string().refine((v) => mongoose.isValidObjectId(v), "Invalid id");

const imageUrl = z
  .string()
  .trim()
  .url("Image must be a valid URL")
  .refine((v) => {
    try {
      const u = new URL(v);
      return u.protocol === "https:" && env.allowedImageHosts.includes(u.hostname.toLowerCase());
    } catch {
      return false;
    }
  }, "Image must be uploaded through the admin panel");

const image = z.object({
  url: imageUrl,
  alt: text(200).default(""),
  caption: text(300).default(""),
  credit: text(100).default(""),
  publicId: text(200).default(""),
});

const block = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: text(10000).min(1) }),
  z.object({ type: z.literal("heading"), text: text(200).min(1) }),
  z.object({ type: z.literal("quote"), text: text(1000).min(1), cite: text(150).optional() }),
  z.object({ type: z.literal("list"), items: z.array(text(500).min(1)).min(1).max(50) }),
  z.object({ type: z.literal("image"), image }),
]);

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(120),
  password: z.string().min(1).max(200),
});

const password = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(200)
  .refine((p) => /[a-zA-Z]/.test(p) && /\d/.test(p), "Password must contain letters and numbers");

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: password,
});

export const profileSchema = z.object({
  name: text(80).min(2),
  designation: text(80).default(""),
  bio: text(500).default(""),
});

export const createUserSchema = z.object({
  name: text(80).min(2),
  email: z.string().trim().toLowerCase().email().max(120),
  password,
  role: z.enum(["admin", "editor"]),
  designation: text(80).default("Correspondent"),
  bio: text(500).default(""),
});

export const updateUserSchema = z.object({
  name: text(80).min(2),
  role: z.enum(["admin", "editor"]),
  designation: text(80).default(""),
  bio: text(500).default(""),
  active: z.boolean(),
  password: password.optional().or(z.literal("")),
});

export const categorySchema = z.object({
  name: text(50).min(2),
  slug: text(60).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex value like #b3121b").default("#b3121b"),
  order: z.coerce.number().int().min(0).max(1000).default(0),
  showOnHome: z.boolean().default(true),
});

export const articleSchema = z.object({
  title: text(250).min(5, "Title is too short"),
  slug: text(100).optional(),
  excerpt: text(500).default(""),
  content: z.array(block).max(300).default([]),
  coverImage: image,
  category: objectId,
  tags: z.array(text(40).min(1)).max(15).default([]),
  location: text(80).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  isBreaking: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  publishedAt: z.string().datetime({ offset: true }).optional().or(z.literal("")),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
  q: text(100).optional(),
  status: z.enum(["draft", "published"]).optional().or(z.literal("")),
  category: objectId.optional().or(z.literal("")),
});

export const limitSchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(5),
});

export const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email address.").max(120),
});

export const idParam = z.object({ id: objectId });
export const slugParam = z.object({ slug: z.string().trim().min(1).max(120) });
