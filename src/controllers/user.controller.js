import bcrypt from "bcryptjs";
import { Article } from "../models/Article.js";
import { User } from "../models/User.js";
import { toUser } from "../utils/serialize.js";
import { uniqueSlug } from "../utils/slug.js";
import { createUserSchema, idParam, updateUserSchema } from "../utils/validators.js";

export async function listUsers(req, res) {
  const users = await User.find().sort({ createdAt: 1 }).lean();
  res.json(users.map(toUser));
}

export async function createUser(req, res) {
  const { password, ...data } = createUserSchema.parse(req.body);
  if (await User.exists({ email: data.email })) {
    return res.status(409).json({ message: "A user with this email already exists." });
  }
  const user = await User.create({
    ...data,
    slug: await uniqueSlug(User, data.name),
    passwordHash: await bcrypt.hash(password, 12),
  });
  res.status(201).json(toUser(user));
}

export async function updateUser(req, res) {
  const { id } = idParam.parse(req.params);
  const { password, ...data } = updateUserSchema.parse(req.body);
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found." });

  const isSelf = String(user._id) === String(req.user._id);
  if (isSelf && (!data.active || data.role !== "admin")) {
    return res.status(400).json({ message: "You cannot deactivate yourself or remove your own admin role." });
  }

  const revoke = user.role !== data.role || (user.active && !data.active) || Boolean(password);
  Object.assign(user, data);
  if (password) user.passwordHash = await bcrypt.hash(password, 12);
  if (revoke && !isSelf) user.tokenVersion += 1;
  await user.save();
  res.json(toUser(user));
}

export async function deleteUser(req, res) {
  const { id } = idParam.parse(req.params);
  if (String(id) === String(req.user._id)) return res.status(400).json({ message: "You cannot delete yourself." });
  if (await Article.exists({ author: id })) {
    return res.status(400).json({ message: "This user has articles. Deactivate the account instead." });
  }
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "User not found." });
  res.json({ ok: true });
}
