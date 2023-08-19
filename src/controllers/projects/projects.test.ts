import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import User from "../../models/User/User";
import Project from "../../models/Project/Project";

import { mockUserData, mockProjectData } from "../../test/mock";

describe("Project Functional Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(mockUserData);

    process.env.TEST_TOKEN = response.body.token;
  });

  it("should create a new project", async () => {
    const response = await request(app)
      .post("/api/v1/projects/create")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(mockProjectData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe(mockProjectData.name);
    expect(response.body.data.description).toBe(mockProjectData.description);
  });

  it("should throw error on project creation", async () => {
    jest.spyOn(Project.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .post("/api/v1/projects/create")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send();

    expect(response.status).toBe(500);
  });

  it("should get all projects", async () => {
    const response = await request(app)
      .get("/api/v1/projects")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("should throw error on getting all projects", async () => {
    jest.spyOn(Project, "find").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .get("/api/v1/projects")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(500);
  });

  it("should get a project", async () => {
    const project = await Project.findOne({ name: mockProjectData.name });

    const response = await request(app)
      .get(`/api/v1/projects/${project?._id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe(mockProjectData.name);
    expect(response.body.data.description).toBe(mockProjectData.description);
  });

  it("should throw error on getting a project", async () => {
    jest.spyOn(Project, "findById").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .get(`/api/v1/projects/123456`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(500);
  });

  it("should update a project", async () => {
    const project = await Project.findOne({ name: mockProjectData.name });

    const response = await request(app)
      .put(`/api/v1/projects/${project?._id}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        name: "Updated Project",
        description: "Updated Project Description",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe("Updated Project");
    expect(response.body.data.description).toBe("Updated Project Description");
  });

  afterAll(async () => {
    await User.deleteOne({ username: mockUserData.username });
    await Project.deleteOne({ name: mockProjectData.name });
    await mongoose.connection.close();
  });
});
