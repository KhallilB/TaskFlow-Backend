import { Router } from "express";
import isUserAuthorized from "../middleware/isUserAuthorized/isUserAuthorized";
import { createProject, getProjects, getProject } from "../controllers/projects/projects";

const router = Router();

router.use("/projects", router);

// Private Routes
router.post("/create", isUserAuthorized, createProject);
router.get("/", isUserAuthorized, getProjects);
router.get("/:id", isUserAuthorized, getProject);

export default router;
