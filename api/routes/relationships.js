import express from "express";
import {
  followUnfollowUser,
  getFollowers,
} from "../controllers/relationship.js";

const router = express.Router();

router.get("/", getFollowers);
router.post("/", followUnfollowUser);
export default router;
