import mongoose from "mongoose";
import request from "supertest";
import app from "../server.js";
import Plant from "../models/plant.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

describe("Plant routes", () => {
  let testPlant;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);

    // Seed test plant
    testPlant = await Plant.create({
      name: "Basil",
      image: "/images/basil.jpg",
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  // GET /plants
  it("should get all plants", async () => {
    const res = await request(app).get("/plants");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("name");
  });

  // GET /plants/:id
  it("should get a plant by ID", async () => {
    const res = await request(app).get(`/plants/${testPlant._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", testPlant._id.toString());
    expect(res.body.name).toBe("Basil");
  });

  // GET /plants/:id with non-existent ID
  it("should return 404 for a non-existent plant ID", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/plants/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Plant not found");
  });
});