import request from "supertest";
import mongoose, { ObjectId } from "mongoose";
import app from "../../app";
import User from "../../models/User/User";
import Project from "../../models/Project/Project";
import { afterThis } from "jest-after-this";

import {
  MOCK_USER_DATA,
  MOCK_USER_2_DATA,
  MOCK_PROJECT_DATA,
  MOCK_PROJECT_2_DATA,
} from "../../test/mock";

describe("Project Functional Tests", () => {
  let TEST_USER_ID: ObjectId;
  let TEST_USER_2_ID: ObjectId;
  let TEST_TOKEN: string;
  let TEST_PROJECT_ID: ObjectId;
  let TEST_PROJECT_2_ID: ObjectId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(MOCK_USER_DATA);

    const response2 = await request(app)
      .post("/api/v1/auth/register")
      .send(MOCK_USER_2_DATA);

    // TODO: Probably a better way to do this
    const user = await User.findOne({ username: MOCK_USER_DATA.username });
    const user2 = await User.findOne({ username: MOCK_USER_2_DATA.username });

    TEST_USER_ID = user?._id;
    TEST_USER_2_ID = user2?._id;
    TEST_TOKEN = response.body.token;
  });

  beforeEach(async () => {
    let project = new Project(MOCK_PROJECT_DATA);
    await project.save();
    TEST_PROJECT_ID = project._id;
  });

  afterEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    User.deleteMany({
      username: { $in: [MOCK_USER_DATA.username, MOCK_USER_2_DATA.username] },
    });
    Project.deleteMany({
      id: { $in: [TEST_PROJECT_ID, TEST_PROJECT_2_ID] },
    });
    await mongoose.connection.close();
  });

  // Create Project -----------------------------------------------------------------------------------------------
  it("should create a new project", async () => {
    const response = await request(app)
      .post("/api/v1/projects/create")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send(MOCK_PROJECT_2_DATA);

      TEST_PROJECT_2_ID = response.body.data._id;

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe(MOCK_PROJECT_2_DATA.name);
    expect(response.body.data.description).toBe(
      MOCK_PROJECT_2_DATA.description
    );

    afterThis(() => {
      Project.deleteOne({ id: response.body.data._id });
    });
  });

  it("should throw error on project creation", async () => {
    jest.spyOn(Project.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .post("/api/v1/projects/create")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send();

    expect(response.status).toBe(500);
  });

  // Get Projects ------------------------------------------------------------------------------------------------
  it("should get all projects", async () => {
    const response = await request(app)
      .get("/api/v1/projects")
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

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
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(response.status).toBe(500);
  });

  it("should get a project", async () => {
    const response = await request(app)
      .get(`/api/v1/projects/${TEST_PROJECT_ID}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.name).toBe(MOCK_PROJECT_DATA.name);
    expect(response.body.data.description).toBe(MOCK_PROJECT_DATA.description);
  });

  it("should throw error on getting a project", async () => {
    jest.spyOn(Project, "findById").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .get(`/api/v1/projects/123456`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(response.status).toBe(500);
  });

  // Assign User -------------------------------------------------------------------------------------------------
  it("should assign a user to a project", async () => {
    const response = await request(app)
      .post(`/api/v1/projects/${TEST_PROJECT_ID}/assign/user`)
      .send({ userId: TEST_USER_2_ID })
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.body.data.assignedUsers.length).toBeGreaterThan(0);
    expect(response.body.data.assignedUsers[0]).toBe(String(TEST_USER_2_ID));
  });

  it("should throw error on assigning a user to a project", async () => {
    jest.spyOn(Project, "findByIdAndUpdate").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });

    const response = await request(app)
      .post(`/api/v1/projects/123456/assign/user`)
      .send({ userId: TEST_USER_2_ID })
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(response.status).toBe(500);
  });

  it("should not allow user to assign self to a project", async () => {
    const response = await request(app)
      .post(`/api/v1/projects/${TEST_PROJECT_ID}/assign/user`)
      .send({ userId: TEST_USER_ID })
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "You cannot assign yourself to a project"
    );
  });

  it("should not allow user to assign a user to a project more than once", async () => {
    await request(app)
      .post(`/api/v1/projects/${TEST_PROJECT_ID}/assign/user`)
      .send({ userId: TEST_USER_2_ID })
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    const response = await request(app)
      .post(`/api/v1/projects/${TEST_PROJECT_ID}/assign/user`)
      .send({ userId: TEST_USER_2_ID })
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "User is already assigned to this project"
    );
  });

  // Update Project ----------------------------------------------------------------------------------------------
  it("should update a project", async () => {
    const response = await request(app)
      .put(`/api/v1/projects/${TEST_PROJECT_ID}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
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
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({
        name: "Updated Project",
        description: "Updated Project Description",
      });

    expect(response.status).toBe(500);
  });

  // Delete Project ----------------------------------------------------------------------------------------------
  it("should delete a project", async () => {
    const response = await request(app)
      .delete(`/api/v1/projects/${TEST_PROJECT_ID}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

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
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(response.status).toBe(500);
  });
});
