import bcrypt from "bcryptjs";
import { clearSession, issueSession } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { toUser } from "../utils/serialize.js";
import { changePasswordSchema, loginSchema, profileSchema } from "../utils/validators.js";

const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", 12);

export async function login(req, res) {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email: String(email) }).select("+passwordHash");
  const valid = await bcrypt.compare(password, user?.passwordHash || DUMMY_HASH);

  if (!user || !valid || !user.active) {
    return res.status(401).json({ message: "Incorrect email or password." });
  }

  user.lastLoginAt = new Date();
  await user.save();
  issueSession(res, user);
  res.json({ user: toUser(user) });
}

export function logout(req, res) {
  clearSession(res);
  res.json({ ok: true });
}

export function me(req, res) {
  res.json({ user: toUser(req.user) });
}

export async function updateProfile(req, res) {
  const data = profileSchema.parse(req.body);
  Object.assign(req.user, data);
  await req.user.save();
  res.json({ user: toUser(req.user) });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
  const user = await User.findById(req.user._id).select("+passwordHash");
  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    return res.status(400).json({ message: "Current password is incorrect." });
  }
  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.tokenVersion += 1;
  await user.save();
  issueSession(res, user);
  res.json({ ok: true });
}

export async function logoutAll(req, res) {
  req.user.tokenVersion += 1;
  await req.user.save();
  clearSession(res);
  res.json({ ok: true });
}
