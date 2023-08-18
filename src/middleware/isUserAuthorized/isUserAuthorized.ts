import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const isUserAuthorized = async (req: Request, res: Response, next: NextFunction) => {
  // Get the token from headers or query parameters
  let token = req.headers.authorization || req.query.token;
  token = token?.toString().split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    // Attach the decoded token to the request object
    (<any>req).user = decoded;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.log("Error in authorization middleware", error);
    console.error.bind(console, error);
    return res.status(403).json({ message: "Authorization failed." });
  }
};

export default isUserAuthorized;