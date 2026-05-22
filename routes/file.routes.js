import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../config/multer.js";
import {
  uploadFile,
  getFileList,
  getFileById,
  downloadFile,
  deleteFile,
  updateFile,
} from "../controllers/file.controller.js";

const router = Router();

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);
router.get("/list", authMiddleware, getFileList);
router.get("/download/:id", authMiddleware, downloadFile);
router.get("/:id", authMiddleware, getFileById);
router.delete("/delete/:id", authMiddleware, deleteFile);
router.put("/update/:id", authMiddleware, upload.single("file"), updateFile);

export default router;
