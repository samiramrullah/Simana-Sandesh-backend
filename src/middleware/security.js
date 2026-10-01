import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function checkOrigin(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  const origin = req.get("origin");
  if (origin && origin.replace(/\/$/, "") !== env.clientUrl) {
    return res.status(403).json({ message: "Request origin not allowed." });
  }
  next();
}

const limiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message },
  });

export const apiLimiter = limiter(60 * 1000, 300, "Too many requests. Please slow down.");
export const loginLimiter = limiter(15 * 60 * 1000, 10, "Too many login attempts. Try again in 15 minutes.");
export const newsletterLimiter = limiter(60 * 60 * 1000, 5, "Too many sign-up attempts. Try again later.");
export const viewLimiter = limiter(60 * 1000, 30, "Too many requests.");
export const uploadLimiter = limiter(60 * 1000, 20, "Too many uploads. Please wait a minute.");
