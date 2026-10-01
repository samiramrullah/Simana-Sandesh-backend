import { Article } from "../models/Article.js";
import { Category } from "../models/Category.js";
import { toCategory } from "../utils/serialize.js";
import { uniqueSlug } from "../utils/slug.js";
import { categorySchema, idParam } from "../utils/validators.js";

export async function listCategories(req, res) {
  const [cats, counts] = await Promise.all([
    Category.find().sort({ order: 1, name: 1 }).lean(),
    Article.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
  ]);
  const byId = new Map(counts.map((c) => [String(c._id), c.count]));
  res.json(cats.map((c) => ({ ...toCategory(c), articleCount: byId.get(String(c._id)) || 0 })));
}

export async function createCategory(req, res) {
  const { slug, ...data } = categorySchema.parse(req.body);
  const category = await Category.create({ ...data, slug: await uniqueSlug(Category, slug || data.name) });
  res.status(201).json(toCategory(category));
}

export async function updateCategory(req, res) {
  const { id } = idParam.parse(req.params);
  const { slug, ...data } = categorySchema.parse(req.body);
  const category = await Category.findById(id);
  if (!category) return res.status(404).json({ message: "Category not found." });
  Object.assign(category, data);
  if (slug && slug !== category.slug) category.slug = await uniqueSlug(Category, slug, category._id);
  await category.save();
  res.json(toCategory(category));
}

export async function deleteCategory(req, res) {
  const { id } = idParam.parse(req.params);
  if (await Article.exists({ category: id })) {
    return res.status(400).json({ message: "Move or delete the articles in this category first." });
  }
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Category not found." });
  res.json({ ok: true });
}
