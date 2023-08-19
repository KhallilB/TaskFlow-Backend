import { Router } from "express";
import isUserAuthorized from "../middleware/isUserAuthorized/isUserAuthorized";
import { createProject, getProjects, getProject, updateProject, deleteProject} from "../controllers/projects/projects";

const router = Router();

router.use("/projects", router);

// Private Routes
// Project CRUD
router.post("/create", isUserAuthorized, createProject);
router.get("/", isUserAuthorized, getProjects);
router.get("/:id", isUserAuthorized, getProject);
router.put("/:id", isUserAuthorized, updateProject);
router.delete("/:id", isUserAuthorized, deleteProject);

// Project Assignment
router.post("/:projectId/assign/user/:userId", isUserAuthorized, createProject);

export default router;
