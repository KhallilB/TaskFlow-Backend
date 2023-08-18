import { Router } from "express";
import isUserAuthorized from "../middleware/isUserAuthorized/isUserAuthorized";
import { createProject } from "../controllers/projects/projects";

const router = Router();

router.use("/projects", router);

// Private Routes
router.post("/create", isUserAuthorized, createProject);

export default router;
