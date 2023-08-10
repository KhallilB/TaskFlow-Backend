import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import app from "../../app";
import User from "../../models/User";

// Delete user after test suites are done
afterAll(async () => {
  await User.deleteOne({ username: "testuser" });
});

describe("User model", () => {
  it("should return error on bcrypt hash pre save hook", async () => {
    const userData = {
      username: "testuser",
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      password: "testpassword",
    };
    
    // Mocking bcrypt.hash() to throw an error
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const user = new User(userData);
    await expect(user.save()).rejects.toThrow("Mocked error");
  });
});

describe("Registration v1", () => {
  const userData = {
    username: "testuser",
    firstName: "John",
    lastName: "Doe",
    email: "test@example.com",
    password: "testpassword",
  };

  it("should register a new user", async () => {
    await mongoose.connect(process.env.MONGO_URI!);

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.data).toBeDefined();
  });

  it("should not register a user with an existing username", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Username or email already registered");
  });

  it("should handle registration error", async () => {
    // Mocking User.save() to throw an error
    jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(new Error("Mocked error"));

    const response = await request(app).post("/api/v1/auth/register").send({});

    expect(response.status).toBe(500);
  });
});

//------------------------------------------------------------

describe("Login v1", () => {
  const userData = {
    email: "test@example.com",
    password: "testpassword",
  };
  it("should login a user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: userData.email, password: userData.password });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.data).toBeDefined();
  });

  it("should not login a user with incorrect email", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "1" + userData.email, password: userData.password });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should not login a user with incorrect password", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: userData.email, password: "1" + userData.password });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should handle login error", async () => {
    // Mocking User.findOne() to throw an error
    jest.spyOn(User, "findOne").mockRejectedValue(new Error("Mocked error"));

    const response = await request(app).post("/api/v1/auth/login").send({});

    expect(response.status).toBe(500);
  });
});
