import express from "express";
import { addPost, listpost } from "../controllers/postController.js";

const router = express.Router();

// post routes
router.post("/add", addPost);
router.get("/list", listpost);

export default router;
