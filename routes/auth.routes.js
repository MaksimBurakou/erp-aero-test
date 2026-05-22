import { Router } from "express";
import {
  signup,
  signin,
  logout,
  info,
} from "../controllers/auth.controller.js";
import { refreshToken } from "../controllers/token.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signin/new_token", refreshToken);
router.get("/info", authMiddleware, info);
router.get("/logout", authMiddleware, logout);

export default router;
