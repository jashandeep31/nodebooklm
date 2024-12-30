import { Router } from "express";
import { askChat, createChat, getChats } from "../controllers/chat.controller";
import { upload } from "../lib/multer.config";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router
  .route("/")
  .post(authMiddleware, upload.array("files"), createChat)
  .get(authMiddleware, getChats);
router.route("/:id").post(authMiddleware, askChat);

export default router;
