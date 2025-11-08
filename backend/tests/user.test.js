import mongoose from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import app from "../server.js";
import User from "../models/user.js";

dotenv.config({ path: ".env.test" });

describe("User routes", () => {
  let testUser;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  // Create a new user for tests
  beforeEach(async () => {
    testUser = await User.create({
      userName: "TestUser",
      email: "test@example.com",
      address: "123 Test St",
    });
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it("should create a new user", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        userName: "NewUser",
        email: "new@example.com",
        address: "456 Another St",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.userName).toBe("NewUser");
    expect(res.body.email).toBe("new@example.com");
  });

    it("should not allow a user to select a pre-existing username", async () => {
        const res = await request(app)
        .post("/users")
        .send({
            userName: "TestUser",
            email: "new@example.com",
            address: "456 Another St",
        });

        expect(res.statusCode).toBe(400);
    });

  it("should get a user by ID", async () => {
    const res = await request(app).get(`/users/${testUser._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.userName).toBe("TestUser");
    expect(res.body.email).toBe("test@example.com");
  });

  it("should update a user's email and address", async () => {
    const res = await request(app)
      .put(`/users/${testUser._id}`)
      .send({
        email: "updated@example.com",
        address: "789 Updated St",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("updated@example.com");
    expect(res.body.address).toBe("789 Updated St");
    expect(res.body.userName).toBe("TestUser"); // unchanged
  });

  it("should soft delete a user", async () => {
    const res = await request(app).delete(`/users/${testUser._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User soft-deleted");

    const deletedUser = await User.findById(testUser._id);
    expect(deletedUser.dateDeleted).not.toBeNull();
  });
});
