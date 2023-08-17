import { Request, Response, NextFunction } from "express";
import User, { IUserDocument } from "../../models/User";
import { UpdateFieldProps } from "./types";

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
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
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
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
    next(error);
  }
};

// @desc Get current logged in user
// @route GET /api/v1/auth/profile
// @access Private
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById((<any>req).user?.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    next(error);
  }
};

// @desc Update user profile
// @route PUT /api/v1/auth/profile
// @access Private
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

      if (key === "notificationPreferences") {
        fields[key] = JSON.parse(fields[key]);
      }

      // Sanaitize fields
      fields[key] = req.body[key].trim().replace(/ /g, "");

      // Uppercase first letter of first and last name
      if (key === "firstName" || key === "lastName")
        fields[key] = req.body[key].str.charAt(0).toUpperCase();

      // match email regex
      if (key === "email") {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(fields[key])) {
          return res.status(400).json({
            success: false,
            message: `Invalid email`,
          });
        }
      }

      // match timezone regex
      if (key === "timezone") {
        const timezoneRegex = /^([+-]?)([\d]{2}):?([\d]{2})$/;
        if (!timezoneRegex.test(fields[key])) {
          return res.status(400).json({
            success: false,
            message: `Invalid timezone`,
          });
        }
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
    next(error);
  }
};

// @desc Delete user profile
// @route DELETE /api/v1/auth/profile
// @access Private
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
    next(error);
  }
};
