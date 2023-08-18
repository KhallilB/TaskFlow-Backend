import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./User";

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
  