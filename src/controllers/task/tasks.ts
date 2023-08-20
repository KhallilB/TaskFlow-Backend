import { Request, Response, NextFunction } from "express";
import Task from "../../models/Task/Task";

// Create a new task
export const createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, description } = req.body;
        const createdBy = (<any>req).user?.id;

        const task = await Task.create({
            name,
            description,
            createdBy,
        });

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error: any) {
        next(error);
    }
};