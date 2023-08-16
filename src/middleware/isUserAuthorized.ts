import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const isUserAuth = async (req: Request, res: Response, next: NextFunction) => {
  // Get the token from headers or query parameters
  const token = req.headers.authorization || req.query.token;

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    // Verify the token using your secret key
    const decoded = await jwt.verify(
      token.toString(),
      process.env.JWT_SECRET_KEY as string
    );

    // Attach the decoded token to the request object
    (<any>req).user = decoded;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error.bind(console, error);
    return res.status(403).json({ message: "Authorization failed." });
  }
};

export default isUserAuth;