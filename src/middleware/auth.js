import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export const COOKIE_NAME = "ss_token";

export function issueSession(res, user) {
  const token = jwt.sign({ sub: String(user._id), v: user.tokenVersion }, env.jwtSecret, {
    algorithm: "HS256",
    expiresIn: `${env.jwtExpiresDays}d`,
  });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "strict",
    path: "/",
    maxAge: env.jwtExpiresDays * 24 * 60 * 60 * 1000,
  });
}

export function clearSession(res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: env.isProd, sameSite: "strict", path: "/" });
}

export async function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: "Please log in." });

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
  } catch {
    clearSession(res);
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }

  if (!mongoose.isValidObjectId(payload.sub)) return res.status(401).json({ message: "Please log in." });
  const user = await User.findById(payload.sub);
  if (!user || !user.active || user.tokenVersion !== payload.v) {
    clearSession(res);
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }

  req.user = user;
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) return res.status(403).json({ message: "You do not have permission to do this." });
    next();
  };
}
