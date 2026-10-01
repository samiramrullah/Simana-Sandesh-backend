import { deleteImage } from "../config/cloudinary.js";
import { Article } from "../models/Article.js";
import { escapeRegex, uniqueSlug } from "../utils/slug.js";
import { toArticle } from "../utils/serialize.js";
import { articleSchema, idParam, listQuerySchema } from "../utils/validators.js";
import { Category } from "../models/Category.js";

const AUTHOR_FIELDS = "name slug designation avatar bio";

function adminView(a) {
  const out = toArticle(a, { admin: true });
  out.categoryId = a.category?._id ? String(a.category._id) : String(a.category || "");
  return out;
}

async function applyInput(article, input) {
  if (!(await Category.exists({ _id: input.category }))) {
    const err = new Error("Category not found.");
    err.status = 400;
    throw err;
  }
  const { slug, publishedAt, ...rest } = input;
  Object.assign(article, rest);
  article.tags = [...new Set(rest.tags.map((t) => t.trim()).filter(Boolean))];
  if (publishedAt) article.publishedAt = new Date(publishedAt);
  if (slug || !article.slug) article.slug = await uniqueSlug(Article, slug || rest.title, article._id);
}

export async function listArticles(req, res) {
  const { page, pageSize, q, status, category } = listQuerySchema.parse(req.query);
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (q) filter.title = new RegExp(escapeRegex(q), "i");

  const [items, total] = await Promise.all([
    Article.find(filter)
      .select("-content")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("category")
      .populate("author", AUTHOR_FIELDS)
      .lean(),
    Article.countDocuments(filter),
  ]);

  res.json({
    items: items.map((a) => adminView({ ...a, content: undefined })),
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}

export async function getArticle(req, res) {
  const { id } = idParam.parse(req.params);
  const article = await Article.findById(id).populate("category").populate("author", AUTHOR_FIELDS).lean();
  if (!article) return res.status(404).json({ message: "Article not found." });
  res.json(adminView(article));
}

export async function createArticle(req, res) {
  const input = articleSchema.parse(req.body);
  const article = new Article({ author: req.user._id });
  await applyInput(article, input);
  await article.save();
  res.status(201).json({ id: String(article._id), slug: article.slug });
}

export async function updateArticle(req, res) {
  const { id } = idParam.parse(req.params);
  const input = articleSchema.parse(req.body);
  const article = await Article.findById(id);
  if (!article) return res.status(404).json({ message: "Article not found." });

  const oldImages = collectImageIds(article);
  await applyInput(article, input);
  await article.save();

  const kept = new Set(collectImageIds(article));
  await Promise.all(oldImages.filter((p) => !kept.has(p)).map(deleteImage));
  res.json({ id: String(article._id), slug: article.slug });
}

export async function deleteArticle(req, res) {
  const { id } = idParam.parse(req.params);
  const article = await Article.findByIdAndDelete(id);
  if (!article) return res.status(404).json({ message: "Article not found." });
  await Promise.all(collectImageIds(article).map(deleteImage));
  res.json({ ok: true });
}

function collectImageIds(article) {
  const ids = [article.coverImage?.publicId];
  for (const b of article.content || []) if (b.type === "image") ids.push(b.image?.publicId);
  return ids.filter(Boolean);
}
