import { jest } from "@jest/globals";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const mockVerifyIdToken = jest.fn();

jest.unstable_mockModule("google-auth-library", () => ({
  OAuth2Client: jest.fn(() => ({
    verifyIdToken: mockVerifyIdToken,
  })),
}));

const { default: request } = await import("supertest");
const { default: app } = await import("../app.js");
const { default: User } = await import("../models/user.js");

describe("Google Auth image update", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("creates a new user with Google photo", async () => {
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        name: "Alice",
        email: "alice@example.com",
        picture: "http://example.com/photo1.jpg",
      }),
    });

    const res = await request(app)
      .post("/auth/google")
      .send({ token: "fake-google-token" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.image).toBe("http://example.com/photo1.jpg");
  });

  it("updates the photo if Google photo changed", async () => {
    const user = await User.create({
      userName: "Alice1",
      email: "alice1@example.com",
      image: "http://example.com/oldphoto.jpg",
      address: "",
    });

    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        name: "Alice1",
        email: "alice1@example.com",
        picture: "http://example.com/newphoto.jpg",
      }),
    });

    const res = await request(app)
      .post("/auth/google")
      .send({ token: "fake-google-token" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.image).toBe("http://example.com/newphoto.jpg");

    const updatedUser = await User.findById(user._id);
    expect(updatedUser.image).toBe("http://example.com/newphoto.jpg");
  });

  it("does not change photo if Google photo is the same", async () => {
    const user = await User.create({
      userName: "Bob",
      email: "bob@example.com",
      image: "http://example.com/photo2.jpg",
      address: "",
    });

    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        name: "Bob",
        email: "bob@example.com",
        picture: "http://example.com/photo2.jpg",
      }),
    });

    const res = await request(app)
      .post("/auth/google")
      .send({ token: "fake-google-token" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.image).toBe("http://example.com/photo2.jpg");
  });
});
