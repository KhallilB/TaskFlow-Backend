import { Router } from "express";
import isUserAuthorized from "../middleware/isUserAuthorized";
import { register, login, getProfile } from "../controllers/auth/auth";

const router = Router();

router.use('/auth', router);

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Private Routes
router.get("/profile", isUserAuthorized, getProfile);

export default router;