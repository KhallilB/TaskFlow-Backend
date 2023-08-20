import { Router } from "express";
import isUserAuthorized from "../middleware/isUserAuthorized/isUserAuthorized";
import {
    createTask,
} from "../controllers/task/tasks";

const router = Router();

router.post("/tasks/create", isUserAuthorized, createTask);

export default router;

