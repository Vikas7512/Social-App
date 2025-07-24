import express from "express";
import { getUser, getUsers, updateuser } from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:userId", getUser);
router.put("/", updateuser);

export default router;
