import { Request, Response, NextFunction } from "express";
import User from "../../models/User";

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
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
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
