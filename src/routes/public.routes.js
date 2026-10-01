import { Router } from "express";
import * as c from "../controllers/public.controller.js";
import { newsletterLimiter, viewLimiter } from "../middleware/security.js";

const router = Router();

router.get("/categories", c.getCategories);
router.get("/categories/:slug/articles", c.getCategoryArticles);
router.get("/homepage", c.getHomepage);
router.get("/articles/slugs", c.getSlugs);
router.get("/articles/trending", c.getTrending);
router.get("/articles/:slug", c.getArticle);
router.get("/articles/:slug/related", c.getRelated);
router.post("/articles/:slug/view", viewLimiter, c.addView);
router.get("/search", c.search);
router.post("/newsletter", newsletterLimiter, c.subscribe);

export default router;
