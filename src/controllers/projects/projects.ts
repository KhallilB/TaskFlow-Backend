import { Request, Response, NextFunction } from "express";
import Project from "../../models/Project";

export const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, description } = req.body;
        const createdBy = (<any>req).user?._id;

        const project = await Project.create({
            name,
            description,
            createdBy,
        });

        return res.status(201).json({
            success: true,
            data: project,
        });
    } catch (error: any) {
        next(error);
    }
};