import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Article } from "./models/Article.js";
import { Category } from "./models/Category.js";
import { User } from "./models/User.js";
import { articles, authors, categories } from "./sample-data.js";
import { uniqueSlug } from "./utils/slug.js";

const withSample = process.argv.includes("--sample");

async function seedCategories() {
  for (const [i, c] of categories.entries()) {
    await Category.updateOne(
      { slug: c.slug },
      { $setOnInsert: { name: c.name, slug: c.slug, color: c.color, order: i } },
      { upsert: true }
    );
  }
  console.log(`Categories ready (${categories.length})`);
}

async function seedAdmin() {
  if (await User.exists({ role: "admin" })) {
    console.log("Admin already exists, skipping");
    return;
  }
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Administrator";
  if (!email || !password || password.length < 10) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD (min 10 characters) in .env to create the first admin.");
    process.exit(1);
  }
  await User.create({
    name,
    email,
    slug: await uniqueSlug(User, name),
    role: "admin",
    designation: "Editor-in-Chief",
    passwordHash: await bcrypt.hash(password, 12),
  });
  console.log(`Admin created: ${email}`);
}

async function seedSampleArticles() {
  if (await Article.exists({})) {
    console.log("Articles already exist, skipping sample content");
    return;
  }
  const userIds = {};
  for (const a of authors) {
    const existing = await User.findOne({ slug: a.slug });
    const user =
      existing ||
      (await User.create({
        name: a.name,
        slug: a.slug,
        email: `${a.slug}@example.invalid`,
        role: "editor",
        designation: a.role,
        bio: a.bio,
        active: false,
        passwordHash: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12),
      }));
    userIds[a.id] = user._id;
  }

  const catIds = Object.fromEntries((await Category.find().lean()).map((c) => [c.slug, c._id]));
  for (const a of articles) {
    await Article.create({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      coverImage: a.coverImage,
      category: catIds[a.category.slug],
      author: userIds[a.author.id],
      tags: a.tags,
      location: a.location || "",
      status: "published",
      isBreaking: Boolean(a.isBreaking),
      isFeatured: Boolean(a.isFeatured),
      publishedAt: new Date(a.publishedAt),
      views: a.views || 0,
    });
  }
  console.log(`Sample articles created (${articles.length})`);
}

try {
  await connectDB();
  await seedCategories();
  await seedAdmin();
  if (withSample) await seedSampleArticles();
  console.log("Seed complete");
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
