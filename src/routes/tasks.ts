import { Router } from "express";
import isUserAuthorized from "../middleware/isUserAuthorized/isUserAuthorized";
import {
    createTask,
    getAllTasks,
} from "../controllers/task/tasks";

const router = Router();

router.post("/tasks/create", isUserAuthorized, createTask);
router.get("/tasks", isUserAuthorized, getAllTasks);

export default router;

