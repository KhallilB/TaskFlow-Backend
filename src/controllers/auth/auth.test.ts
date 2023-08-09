import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import User from "../../models/User";

describe("Registration API", () => {
  // Delete user after each test
  afterEach(async () => {
    await User.deleteOne({ username: "testuser" });
  });

  it("should register a new user", async () => {
    await mongoose.connect(process.env.MONGO_URI!);

    const userData = {
      username: "testuser",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      password: "testpassword",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.data).toBeDefined();
  });

  it("should handle registration error", async () => {
    // Mocking User.save() to throw an error
    jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(new Error("Mocked error"));

    const userData = {
      // ... provide user data
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Internal Server Error");
  });
});
