import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import app from "../../app";
import User from "../../models/User";
import jwt from "jsonwebtoken";

const userData = {
  username: "testuser",
  firstName: "John",
  lastName: "Doe",
  email: "test@example.com",
  password: "Testpassword2@",
};

describe("User Model", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });

  afterEach(async () => {
    await User.deleteOne({ email: userData.email });
  });

  it("should return error on bcrypt hash pre save hook", async () => {
    // Mocking bcrypt.hash() to throw an error
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const user = new User(userData);
    await expect(user.save()).rejects.toThrow("Mocked error");
  });

  it("should hash password", async () => {
    const user = new User(userData);
    await user.save();
    expect(user.password).not.toBe(userData.password);
  });
});

//------------------------------------------------------------

describe("Registration v1", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });

  it("should register a new user", async () => {
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
      .send({ email: userData.email, password: userData.password });
          
      process.env.TEST_TOKEN = response.body.token;
  });

  it("should get profile", async () => {
    const response = await request(app)
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
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

      
      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("Invalid field password")
  });


  it("should delete profile", async () => {
    const response = await request(app)
      .delete("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  afterAll(async () => {
    await User.deleteOne({ email: userData.email })
    await mongoose.connection.close();
  });
});
