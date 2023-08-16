import { Router } from "express";
import isUserAuthorized from "../middleware/isUserAuthorized";
import { register, login, getProfile, updateProfile, deleteProfile } from "../controllers/auth/auth";

const router = Router();

router.use('/auth', router);

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Private Routes
router.get("/profile", isUserAuthorized, getProfile);
router.put("/profile", isUserAuthorized, updateProfile);
router.delete("/profile", isUserAuthorized, deleteProfile);

export default router;