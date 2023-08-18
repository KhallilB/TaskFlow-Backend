import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import Project from "../../models/Project/Project";

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

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it("should create a new project", async () => {
    console.log(token)
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

  it("should throw error on project creation", async () => {
    jest.spyOn(Project.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .post("/api/v1/projects/create")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(500);
  });

  afterAll(async () => {
    await Project.deleteOne({ name: projectData.name });
    await mongoose.connection.close();
  })
});
