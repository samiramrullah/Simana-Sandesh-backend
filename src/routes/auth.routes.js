import { Router } from "express";
import * as c from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/security.js";

const router = Router();

router.post("/login", loginLimiter, c.login);
router.post("/logout", c.logout);
router.get("/me", requireAuth, c.me);
router.put("/profile", requireAuth, c.updateProfile);
router.put("/password", requireAuth, loginLimiter, c.changePassword);
router.post("/logout-all", requireAuth, c.logoutAll);

export default router;
