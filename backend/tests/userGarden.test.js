import mongoose from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import app from "../server.js";
import User from "../models/user.js";
import Plant from "../models/plant.js";

dotenv.config({ path: ".env.test" });

describe("User garden routes", () => {
  let testUser;
  let testPlant;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Create a user and a plant for each test
    testUser = await User.create({
      userName: "TestUser",
      email: "test@example.com",
      address: "123 Test St",
    });

    testPlant = await Plant.create({
      name: "Tomato",
      image: "tomato.png",
    });
  });

  afterEach(async () => {
    await User.deleteMany();
    await Plant.deleteMany();
  });

  it("should add a plant to the user's garden", async () => {
    const res = await request(app)
      .post(`/users/${testUser._id}/garden`)
      .send({ plantId: testPlant._id });

    expect(res.statusCode).toBe(200);
    expect(res.body.garden).toHaveLength(1);
    expect(String(res.body.garden[0].plantId)).toBe(String(testPlant._id));
  });

it("should toggle forTrade for a plant in the user's garden", async () => {
  // Add plant to user's garden first
  await request(app)
    .post(`/users/${testUser._id}/garden`)
    .send({ plantId: testPlant._id });

  // Toggle forTrade to true
  const res = await request(app)
    .put(`/users/${testUser._id}/garden/${testPlant._id}`)
    .send({ forTrade: true });

  expect(res.statusCode).toBe(200);
  const plantInGarden = res.body.garden.find(
    (p) => String(p.plantId) === String(testPlant._id)
  );
  expect(plantInGarden.forTrade).toBe(true);
});

  it("should remove a plant from the user's garden", async () => {
    // First add plant to garden
    await request(app)
      .post(`/users/${testUser._id}/garden`)
      .send({ plantId: testPlant._id });

    const res = await request(app)
      .delete(`/users/${testUser._id}/garden/${testPlant._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.garden.find(p => String(p.plantId) === String(testPlant._id)))
      .toBeUndefined();
  });
});
