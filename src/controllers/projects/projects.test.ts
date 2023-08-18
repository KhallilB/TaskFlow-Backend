import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";

const userData = {
  username: "testuser",
  firstName: "John",
  lastName: "Doe",
  email: "test@example.com",
  password: "Testpassword2@",
};

const projectData = {
  name: "Test Project",
  description: "Test Project Description",
};

describe("Project Functional Tests", () => {
  let token: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(userData);

    token = response.body.token;
  });

  it("should create a new project", async () => {
    const response = await request(app)
      .post("/api/v1/projects/create")
      .set("Authorization", `Bearer ${token}`)
      .send(projectData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe(projectData.name);
    expect(response.body.data.description).toBe(projectData.description);
  });
});
