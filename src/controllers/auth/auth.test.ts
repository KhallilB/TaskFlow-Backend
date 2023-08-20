import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import app from "../../app";
import User from "../../models/User/User";

import { MOCK_USER_DATA } from "../../test/mock";

describe("Registration v1", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(MOCK_USER_DATA);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.data).toBeDefined();
  });

  it("should not register a user with an existing username", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(MOCK_USER_DATA);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Username or email already registered");
  });

  it("should handle registration error", async () => {
    jest
      .spyOn(User.prototype, "save")
      .mockRejectedValue(new Error("Mocked error"));

    const response = await request(app).post("/api/v1/auth/register").send({});

    expect(response.status).toBe(500);
  });
});

//------------------------------------------------------------

describe("Login v1", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it("should login a user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: MOCK_USER_DATA.email, password: MOCK_USER_DATA.password });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
    expect(response.body.data).toBeDefined();
  });

  it("should not login a user with incorrect email", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "1" + MOCK_USER_DATA.email, password: MOCK_USER_DATA.password });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should not login a user with incorrect password", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: MOCK_USER_DATA.email, password: "1" + MOCK_USER_DATA.password });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should handle login error", async () => {
    // Mocking User.findOne() to throw an error
    jest.spyOn(User, "findOne").mockRejectedValue(new Error("Mocked error"));

    const response = await request(app).post("/api/v1/auth/login").send({});

    expect(response.status).toBe(500);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});

//------------------------------------------------------------

describe("Profile v1", () => {
  beforeAll(async () => {
    jest.resetAllMocks();
    await mongoose.connect(process.env.MONGO_URI!);
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: MOCK_USER_DATA.email, password: MOCK_USER_DATA.password });

    process.env.TEST_TOKEN = response.body.token;
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  it("should get profile", async () => {
    const response = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it("get profile should return 404 if user is not found", async () => {
    jest.spyOn(User, "findById").mockResolvedValueOnce(null);

    const response = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  });

  it("get profile should return error", async () => {
    jest.spyOn(User, "findById").mockRejectedValue(new Error("Mocked error"));

    const response = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(500);
  });

  it("should update profile", async () => {
    const response = await request(app)
      .put("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({ firstName: "Jane" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.firstName).toBe("Jane");
  });

  it("update profile should only contain allowed fields", async () => {
    const response = await request(app)
      .put("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({ firstName: "Jane", password: "Testpassword2@" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid field password");
  });

  it("should delete profile", async () => {
    const response = await request(app)
      .delete("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it("delete profile should return error", async () => {
    jest
      .spyOn(User, "findByIdAndDelete")
      .mockRejectedValue(new Error("Mocked error"));

    const response = await request(app)
      .delete("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(500);
  });

  afterAll(async () => {
    await User.deleteOne({ email: MOCK_USER_DATA.email });
    await mongoose.connection.close();
  });
});
