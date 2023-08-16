import { Router } from "express";
import { register, login } from "../controllers/auth/auth";

const router = Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);

export default router;