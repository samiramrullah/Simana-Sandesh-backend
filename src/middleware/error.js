import multer from "multer";
import { ZodError } from "zod";

export function notFound(req, res) {
  res.status(404).json({ message: "Not found." });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof ZodError) {
    const issue = err.issues[0];
    const field = issue?.path?.join(".");
    return res.status(400).json({ message: field ? `${field}: ${issue.message}` : issue?.message || "Invalid input." });
  }
  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "Image must be smaller than 5 MB." : "Only JPG, PNG, WEBP, GIF or AVIF images are allowed.";
    return res.status(400).json({ message });
  }
  if (err?.type === "entity.too.large") return res.status(413).json({ message: "Request is too large." });
  if (err?.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON." });
  if (err?.code === 11000) return res.status(409).json({ message: "This already exists." });
  if (err?.name === "CastError") return res.status(400).json({ message: "Invalid id." });
  if (err?.status >= 400 && err?.status < 500 && err.expose !== false) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
}
