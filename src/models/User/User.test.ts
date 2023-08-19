import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./User";
import dotenv from "dotenv";

dotenv.config();

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
    jest.clearAllMocks();
    await User.deleteOne({ username: userData.username });
  });

  it("should return error on bcrypt hash pre save hook", async () => {
    // Mocking bcrypt.hash() to throw an error
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(() => {
      throw new Error("Mocked error");
    });
    const user = new User(userData);
    await expect(user.save()).rejects.toThrow("Mocked error");
  });

  it("should hash password user password on save", async () => {
    const user = new User(userData);
    await user.save();
    expect(user.password).not.toBe(userData.password);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
