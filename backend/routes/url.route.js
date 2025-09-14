import { Router } from "express";
import {
  createShortUrl,
  deleteShortUrl,
  getLinkById,
  getUserLinks,
  updateShortUrl,
  redirectUrl,
} from "../controllers/url.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/create", protect, createShortUrl);
router.put("/update/:id", protect, updateShortUrl);
router.delete("/:id", protect, deleteShortUrl);
router.get("/urls", protect, getUserLinks);
router.get("/url/:id", protect, getLinkById);
router.get("/redirect/:shortCode", redirectUrl);

export default router;
