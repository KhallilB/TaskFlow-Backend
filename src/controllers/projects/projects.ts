import { Request, Response, NextFunction } from "express";
import Project from "../../models/Project/Project";

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

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.find({ createdBy: (<any>req).user?._id });

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findById(req.params.id);

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    next(error);
  }
};