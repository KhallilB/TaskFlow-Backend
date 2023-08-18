import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import isUserAuthorized from "./isUserAuthorized";

describe("isUserAuthorized Middleware", () => {
  const mockRequest = (headers: any = {}, query: any = {}) =>
    ({
      headers,
      query,
    } as Request);

  const mockResponse = () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    return res as Response;
  };

  const mockNext = jest.fn() as NextFunction;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should pass authorization and call next if token is valid", async () => {
    jest.spyOn(jwt, "verify");
    process.env.JWT_SECRET = "test_secret";
    const validToken = jwt.sign(
      { id: "123456", iat: Date.now() },
      process.env.JWT_SECRET
    );

    const req = mockRequest({
      authorization: `Bearer ${validToken}`,
    });
    const res = mockResponse();

    await isUserAuthorized(req, res, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(validToken, process.env.JWT_SECRET);
    expect((req as any).user).toHaveProperty("id", "123456");
    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 401 if no token is provided", async () => {
    const req = mockRequest();
    const res = mockResponse();

    await isUserAuthorized(req, res, mockNext);

    expect(jwt.verify).not.toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "No token provided",
    });
  });

  it("should return 403 if token verification fails", async () => {
    jest.spyOn(jwt, "verify");
    const invalidToken = "invalid_token";

    const req = mockRequest({
      authorization: `Bearer ${invalidToken}`,
    });
    const res = mockResponse();

    await isUserAuthorized(req, res, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(
      invalidToken,
      process.env.JWT_SECRET
    );
    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authorization failed.",
      error: expect.anything(),
    });
  });
});
