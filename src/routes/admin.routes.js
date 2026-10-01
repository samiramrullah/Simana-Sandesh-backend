import { Router } from "express";
import * as admin from "../controllers/admin.controller.js";
import * as articles from "../controllers/article.controller.js";
import * as categories from "../controllers/category.controller.js";
import * as users from "../controllers/user.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { uploadLimiter } from "../middleware/security.js";
import { imageUpload } from "../middleware/upload.js";

const router = Router();
const adminOnly = requireRole("admin");

router.use(requireAuth);

router.get("/stats", admin.stats);
router.post("/upload", uploadLimiter, imageUpload, admin.upload);

router.get("/articles", articles.listArticles);
router.post("/articles", articles.createArticle);
router.get("/articles/:id", articles.getArticle);
router.put("/articles/:id", articles.updateArticle);
router.delete("/articles/:id", adminOnly, articles.deleteArticle);

router.get("/categories", categories.listCategories);
router.post("/categories", adminOnly, categories.createCategory);
router.put("/categories/:id", adminOnly, categories.updateCategory);
router.delete("/categories/:id", adminOnly, categories.deleteCategory);

router.get("/users", adminOnly, users.listUsers);
router.post("/users", adminOnly, users.createUser);
router.put("/users/:id", adminOnly, users.updateUser);
router.delete("/users/:id", adminOnly, users.deleteUser);

router.get("/subscribers", adminOnly, admin.listSubscribers);
router.delete("/subscribers/:id", adminOnly, admin.deleteSubscriber);

export default router;
