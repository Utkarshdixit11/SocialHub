import express from "express";
import { loginUser, registerUser, testEndpoint } from "../controllers/userController.js";

const router = express.Router()

// auth routes
router.post("/register", registerUser)
router.post("/login", loginUser)

// test route - remove in production
router.get("/test", testEndpoint)

export default router;