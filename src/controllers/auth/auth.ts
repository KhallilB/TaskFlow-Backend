import { Request, Response, NextFunction } from "express";
import User, { IUserDocument } from "../../models/User/User";
import { UpdateFieldProps } from "./types";

// Register a new user
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, firstName, lastName, email, password } = req.body;

  try {
    // Check username and email are registered
    let foundUser = await User.findOne({ $or: [{ username }, { email }] });
    if (foundUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already registered",
      });
    }

    // Create user
    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password,
    });

    // Create token
    const token = user.getSignedJwtToken();

    // Save user to database
    await user.save();

    res.status(201).json({
      success: true,
      token,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

// Login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

// Get current logged in user
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById((<any>req).user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    next(error);
  }
};

// Update user profile
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let fields: UpdateFieldProps = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      notificationPreferences: req.body.notificationPreferences,
      timezone: req.body.timezone,
    };

    // Exit if request body fields are not in fields object return error
    Object.keys(req.body).forEach((key) => {
      if (!fields[key]) {
        return res.status(400).json({
          success: false,
          message: `Invalid field ${key}`,
        });
      }
    });

    const user = (await User.findByIdAndUpdate((<any>req).user?.id, fields, {
      new: true,
      runValidators: true,
    })) as IUserDocument;

    if (user) {
      res.status(200).json({
        success: true,
        data: fields,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
    next(error);
  }
};

// Delete user profile
export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await User.findByIdAndDelete((<any>req).user?.id);

    res.status(200).json({
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
