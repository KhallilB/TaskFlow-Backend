import { Request, Response, NextFunction } from "express";
import Project from "../../models/Project/Project";

// Create a new project
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    const createdBy = (<any>req).user?.id;

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

// Get all user projects
export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.find({ createdBy: (<any>req).user?.id });

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

// Get one project
export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = await Project.findById(req.params.projectId);

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

// Update a project
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (name) {
      project!.name = name;
    }

    if (description) {
      project!.description = description;
    }

    const updatedProject = await project?.save();

    return res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

// Delete a project
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Project.findByIdAndDelete(req.params.projectId);

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};


// Assign a user to a project
export const assignUserToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (userId === (<any>req).user?.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot assign yourself to a project",
      });
    }

    if (project?.assignedUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User is already assigned to this project",
      });
    }

    project?.assignedUsers.push(userId);
    const updatedProject = await project?.save();

    return res.status(200).json({
      success: true,
      data: updatedProject,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};
