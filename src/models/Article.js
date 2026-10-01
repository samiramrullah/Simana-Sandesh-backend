import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    caption: { type: String, default: "" },
    credit: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: [mongoose.Schema.Types.Mixed], default: [] },
    coverImage: { type: imageSchema, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tags: { type: [String], default: [] },
    location: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    isBreaking: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    publishedAt: Date,
    readingTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, status: 1, publishedAt: -1 });
articleSchema.index({ views: -1 });

articleSchema.pre("save", function () {
  const text = this.content
    .map((b) => (b.type === "list" ? (b.items || []).join(" ") : b.text || ""))
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  this.readingTime = Math.max(1, Math.round(words / 200));
  if (this.status === "published" && !this.publishedAt) this.publishedAt = new Date();
});

export const Article = mongoose.model("Article", articleSchema);
