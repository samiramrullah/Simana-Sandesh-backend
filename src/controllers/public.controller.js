import { Article } from "../models/Article.js";
import { Category } from "../models/Category.js";
import { Subscriber } from "../models/Subscriber.js";
import { escapeRegex } from "../utils/slug.js";
import { toArticle, toCategory } from "../utils/serialize.js";
import { emailSchema, limitSchema, listQuerySchema, slugParam } from "../utils/validators.js";

const AUTHOR_FIELDS = "name slug designation avatar bio";
const LIST_FIELDS = "-content";

const live = () => ({ status: "published", publishedAt: { $lte: new Date() } });

function findLive(filter = {}) {
  return Article.find({ ...live(), ...filter })
    .select(LIST_FIELDS)
    .populate("category")
    .populate("author", AUTHOR_FIELDS)
    .lean();
}

const summaries = (list) => list.map((a) => toArticle(a, { withContent: false }));

export async function getCategories(req, res) {
  const cats = await Category.find().sort({ order: 1, name: 1 }).lean();
  res.json(cats.map(toCategory));
}

export async function getHomepage(req, res) {
  const [latest, trending, categories] = await Promise.all([
    findLive().sort({ publishedAt: -1 }).limit(40),
    findLive({ publishedAt: { $gte: new Date(Date.now() - 30 * 86400000), $lte: new Date() } })
      .sort({ views: -1 })
      .limit(5),
    Category.find({ showOnHome: true }).sort({ order: 1, name: 1 }).lean(),
  ]);

  if (!latest.length) {
    return res.json({ breaking: [], lead: null, secondary: [], topStories: [], trending: [], opinion: [], sections: [] });
  }

  const isOpinion = (a) => a.category?.slug === "opinion";
  const news = latest.filter((a) => !isOpinion(a));
  const pool = news.length ? news : latest;
  const featured = pool.filter((a) => a.isFeatured);
  const lead = featured[0] || pool[0];
  const secondary = [...featured, ...pool].filter((a, i, arr) => a !== lead && arr.indexOf(a) === i).slice(0, 3);
  const used = new Set([lead, ...secondary].map((a) => String(a._id)));

  const sectionCats = categories.filter((c) => c.slug !== "opinion");
  const sectionLists = await Promise.all(
    sectionCats.map((c) => findLive({ category: c._id }).sort({ publishedAt: -1 }).limit(4))
  );

  res.json({
    breaking: summaries(latest.filter((a) => a.isBreaking).slice(0, 8)),
    lead: toArticle(lead, { withContent: false }),
    secondary: summaries(secondary),
    topStories: summaries(pool.filter((a) => !used.has(String(a._id))).slice(0, 6)),
    trending: summaries(trending),
    opinion: summaries(latest.filter(isOpinion).slice(0, 2)),
    sections: sectionCats
      .map((c, i) => ({ category: toCategory(c), articles: summaries(sectionLists[i]) }))
      .filter((s) => s.articles.length > 0),
  });
}

export async function getArticle(req, res) {
  const { slug } = slugParam.parse(req.params);
  const article = await Article.findOne({ ...live(), slug: String(slug) })
    .populate("category")
    .populate("author", AUTHOR_FIELDS)
    .lean();
  if (!article) return res.status(404).json({ message: "Article not found." });
  res.json(toArticle(article));
}

export async function getRelated(req, res) {
  const { slug } = slugParam.parse(req.params);
  const { limit } = limitSchema.parse(req.query);
  const article = await Article.findOne({ slug: String(slug), ...live() }).select("_id category").lean();
  if (!article) return res.json([]);

  const same = await findLive({ category: article.category, _id: { $ne: article._id } })
    .sort({ publishedAt: -1 })
    .limit(limit);
  let list = same;
  if (list.length < limit) {
    const exclude = [article._id, ...list.map((a) => a._id)];
    const more = await findLive({ _id: { $nin: exclude } }).sort({ publishedAt: -1 }).limit(limit - list.length);
    list = [...list, ...more];
  }
  res.json(summaries(list));
}

export async function getTrending(req, res) {
  const { limit } = limitSchema.parse(req.query);
  const list = await findLive({ publishedAt: { $gte: new Date(Date.now() - 30 * 86400000), $lte: new Date() } })
    .sort({ views: -1 })
    .limit(limit);
  res.json(summaries(list));
}

export async function getSlugs(req, res) {
  const list = await Article.find(live()).select("slug").sort({ publishedAt: -1 }).limit(500).lean();
  res.json(list.map((a) => a.slug));
}

export async function getCategoryArticles(req, res) {
  const { slug } = slugParam.parse(req.params);
  const { page, pageSize } = listQuerySchema.parse(req.query);
  const category = await Category.findOne({ slug: String(slug) }).lean();
  if (!category) return res.status(404).json({ message: "Category not found." });

  const filter = { category: category._id };
  const [items, total] = await Promise.all([
    findLive(filter).sort({ publishedAt: -1 }).skip((page - 1) * pageSize).limit(pageSize),
    Article.countDocuments({ ...live(), ...filter }),
  ]);

  res.json({
    category: toCategory(category),
    data: { items: summaries(items), page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
  });
}

export async function search(req, res) {
  const { q } = listQuerySchema.parse(req.query);
  if (!q) return res.json([]);
  const rx = new RegExp(escapeRegex(q), "i");
  const list = await findLive({ $or: [{ title: rx }, { excerpt: rx }, { tags: rx }] })
    .sort({ publishedAt: -1 })
    .limit(30);
  res.json(summaries(list));
}

export async function addView(req, res) {
  const { slug } = slugParam.parse(req.params);
  await Article.updateOne({ slug: String(slug), status: "published" }, { $inc: { views: 1 } });
  res.status(204).end();
}

export async function subscribe(req, res) {
  const { email } = emailSchema.parse(req.body);
  await Subscriber.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
  res.json({ ok: true });
}
