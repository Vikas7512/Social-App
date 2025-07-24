import express from "express";
import { getLikes, likePost } from "../controllers/like.js";

const router = express.Router();

router.get("/", getLikes);
router.post("/", likePost);
export default router;
