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

    const user = await User.findOne({ username: mockUserData.username });

    process.env.TEST_USER_ID = user?._id;
    process.env.TEST_TOKEN = response.body.token;
    process.env.TEST_PROJECT_ID;
  });

  // Create Project -----------------------------------------------------------------------------------------------
  it("should create a new project", async () => {
    const response = await request(app)
      .post("/api/v1/projects/create")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(mockProjectData);

    process.env.TEST_PROJECT_ID = response.body.data._id;
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

  // Get Projects ------------------------------------------------------------------------------------------------
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
    const response = await request(app)
      .get(`/api/v1/projects/${process.env.TEST_PROJECT_ID}`)
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

  // Assign User -------------------------------------------------------------------------------------------------
  it("should assign a user to a project", async () => {
    const response = await request(app)
      .post(`/api/v1/projects/${process.env.TEST_PROJECT_ID}/assign/user`)
      .send({ userId: process.env.TEST_USER_ID })
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body.data.users.length).toBeGreaterThan(0);
    expect(response.body.data.users[0]).toBe(process.env.TEST_USER_ID);
  });

  // Update Project ----------------------------------------------------------------------------------------------
  it("should update a project", async () => {
    const response = await request(app)
      .put(`/api/v1/projects/${process.env.TEST_PROJECT_ID}`)
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

  it("should throw error on updating a project", async () => {
    jest.spyOn(Project, "findByIdAndUpdate").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .put(`/api/v1/projects/123456`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        name: "Updated Project",
        description: "Updated Project Description",
      });

    expect(response.status).toBe(500);
  });

  // Delete Project ----------------------------------------------------------------------------------------------
  it("should delete a project", async () => {
    const response = await request(app)
      .delete(`/api/v1/projects/${process.env.TEST_PROJECT_ID}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe(undefined);
    expect(response.body.data.description).toBe(undefined);
  });

  it("should throw error on deleting a project", async () => {
    jest.spyOn(Project, "findByIdAndDelete").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .delete(`/api/v1/projects/123456`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(response.status).toBe(500);
  });

  afterAll(async () => {
    await User.deleteOne({ username: mockUserData.username });
    await mongoose.connection.close();
  });
});
