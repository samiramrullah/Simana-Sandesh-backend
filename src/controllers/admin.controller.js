import { cloudinaryEnabled, optimizedUrl, uploadImage } from "../config/cloudinary.js";
import { Article } from "../models/Article.js";
import { Category } from "../models/Category.js";
import { Subscriber } from "../models/Subscriber.js";
import { User } from "../models/User.js";
import { toArticle } from "../utils/serialize.js";
import { idParam } from "../utils/validators.js";

export async function stats(req, res) {
  const [published, drafts, categories, users, subscribers, viewAgg, recent] = await Promise.all([
    Article.countDocuments({ status: "published" }),
    Article.countDocuments({ status: "draft" }),
    Category.countDocuments(),
    User.countDocuments({ active: true }),
    Subscriber.countDocuments(),
    Article.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
    Article.find()
      .select("-content")
      .sort({ updatedAt: -1 })
      .limit(6)
      .populate("category")
      .populate("author", "name slug designation")
      .lean(),
  ]);

  res.json({
    published,
    drafts,
    categories,
    users,
    subscribers,
    views: viewAgg[0]?.total || 0,
    recent: recent.map((a) => toArticle(a, { withContent: false, admin: true })),
  });
}

export async function upload(req, res) {
  if (!cloudinaryEnabled) {
    return res.status(503).json({ message: "Image storage is not configured. Add Cloudinary keys to the backend .env file." });
  }
  if (!req.file) return res.status(400).json({ message: "Please choose an image." });
  const result = await uploadImage(req.file.buffer);
  res.status(201).json({
    url: optimizedUrl(result.secure_url),
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  });
}

export async function listSubscribers(req, res) {
  const subs = await Subscriber.find().sort({ createdAt: -1 }).limit(5000).lean();
  res.json(subs.map((s) => ({ id: String(s._id), email: s.email, createdAt: s.createdAt?.toISOString() })));
}

export async function deleteSubscriber(req, res) {
  const { id } = idParam.parse(req.params);
  await Subscriber.deleteOne({ _id: id });
  res.json({ ok: true });
}
