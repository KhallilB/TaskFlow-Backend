import request from "supertest";
import mongoose, { ObjectId } from "mongoose";
import app from "../../app";
import Task from "../../models/Task/Task";
import User from "../../models/User/User";

import { MOCK_USER_DATA, MOCK_TASK_DATA } from "../../test/mock";

describe("Task Functional Tests", () => {
    let TEST_TOKEN: string;
    let TASK_ID: ObjectId;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI!);

        const response = await request(app)
            .post("/api/v1/auth/register")
            .send(MOCK_USER_DATA);
            
        TEST_TOKEN = response.body.token;
    });

    afterEach(async () => {
        jest.resetAllMocks();
    });

    afterAll(async () => {
        Task.deleteMany({ id: { $in: [TASK_ID] } });
        User.deleteMany({ username: { $in: [MOCK_USER_DATA.username] } });
        await mongoose.connection.close();
    });

    it("should create a new task", async () => {
        const response = await request(app)
            .post("/api/v1/tasks/create")
            .set("Authorization", `Bearer ${TEST_TOKEN}`)
            .send(MOCK_TASK_DATA);

        TASK_ID = response.body.data._id;

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe(MOCK_TASK_DATA.name);
        expect(response.body.data.description).toBe(MOCK_TASK_DATA.description);
    });

    it("should throw error on task create", async () => {
        const response = await request(app)
            .post("/api/v1/tasks/create")
            .set("Authorization", `Bearer ${TEST_TOKEN}`)
            .send({});

        expect(response.status).toBe(500);
    });
});