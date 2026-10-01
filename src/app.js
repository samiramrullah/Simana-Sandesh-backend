import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import morgan from "morgan";
import { errorHandler, notFound } from "./middleware/error.js";
import { apiLimiter, checkOrigin } from "./middleware/security.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";

const app = express();
app.use(morgan('dev')); 
app.set("trust proxy", env.trustProxy);
app.disable("x-powered-by");
app.set("query parser", "simple");

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(checkOrigin);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/admin", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
}, adminRoutes);
app.use("/api", publicRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
