import { Router } from "express";
import isUserAuthorized from "../middleware/isUserAuthorized/isUserAuthorized";
import { createProject, getProjects, getProject, updateProject, deleteProject} from "../controllers/projects/projects";

const router = Router();

router.use("/projects", router);

// Private Routes
// Project CRUD
router.post("/create", isUserAuthorized, createProject);
router.get("/", isUserAuthorized, getProjects);
router.get("/:projectId", isUserAuthorized, getProject);
router.put("/:projectId", isUserAuthorized, updateProject);
router.delete("/:projectId", isUserAuthorized, deleteProject);

// Project Assignment
router.post("/:projectId/assign/user", isUserAuthorized, createProject);

export default router;
