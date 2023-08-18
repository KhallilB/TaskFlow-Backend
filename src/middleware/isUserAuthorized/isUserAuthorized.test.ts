import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import isUserAuthorized from "./isUserAuthorized"; // Adjust the import path accordingly

const mockRequest = (sessionData = {}) => sessionData as Partial<Request>;

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("isUserAuthorized Middleware", () => {
  it("should pass authorization and call next if token is valid", async () => {
    // Generate mock token
    process.env.JWT_SECRET = "test-secret-key";
    const tokenData = { _id: "123456", "iat": Date.now() };
    const signedToken = jwt.sign(tokenData, "test-secret-key");
    jest.spyOn(jwt, "verify");

    // Mock request and response
    const req: Partial<Request> = mockRequest({
      headers: {
        authorization: `Bearer ${signedToken}`,
      },
    });

    const res: Partial<Response> = mockResponse(req);

    // Mock next function
    const next = jest.fn();

    // Call the middleware
    await isUserAuthorized(req as Request, res as Response, next);

    if ((req as any).user) {
      next();
    }

    // Assertions
    expect(jwt.verify).toHaveBeenCalledWith(
      signedToken,
      process.env.JWT_SECRET
    );
    expect((req as any).user).toEqual(tokenData);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });


  it("should return 401 if no token is provided", async () => {
    await isUserAuthorized(req as Request, res as Response, next);

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "No token provided",
    });
  });
});
