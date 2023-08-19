import { Router } from "express";
import isUserAuthorized from "../middleware/isUserAuthorized/isUserAuthorized";
import { createProject, getProjects } from "../controllers/projects/projects";

const router = Router();

router.use("/projects", router);

// Private Routes
router.post("/create", isUserAuthorized, createProject);
router.get("/", isUserAuthorized, getProjects);

export default router;
