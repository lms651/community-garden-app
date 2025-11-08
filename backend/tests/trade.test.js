import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.js";
import Plant from "../models/plant.js";
import Trade from "../models/trade.js";

dotenv.config({ path: ".env.test" });

describe("Trade routes", () => {
  let initiatorUser;
  let recipientUser;
  let plant1;
  let plant2;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);

    initiatorUser = await User.create({
      userName: "initiator",
      email: "init@example.com",
      address: "123 Test St",
    });

    recipientUser = await User.create({
      userName: "recipient",
      email: "rec@example.com",
      address: "125 Test St",
    });

    plant1 = await Plant.create({
      name: "Aloe Vera",
      image: "/fakepath/aloe.jpg",
    });

    plant2 = await Plant.create({
      name: "Spider Plant",
      image: "/fakepath/spider.jpg",
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should create a new trade", async () => {
    const res = await request(app)
      .post("/trades")
      .send({
        initiator: initiatorUser._id,
        recipient: recipientUser._id,
        initiatorPlants: [plant1._id],
        recipientPlants: [plant2._id],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.initiator).toBe(String(initiatorUser._id));
  });

it("should not allow two active trades between the same users", async () => {
    const initiatorDup = await User.create({
        userName: "initiatorDup",
        email: "initDup@example.com",
        address: "100 Test St",
    });

    const recipientDup = await User.create({
        userName: "recipientDup",
        email: "recDup@example.com",
        address: "101 Test St",
    });

    // First trade
    const firstRes = await request(app)
    .post("/trades")
    .send({
        initiator: initiatorDup._id,
        recipient: recipientDup._id,
        initiatorPlants: [plant1._id],
        recipientPlants: [plant2._id],
    });

    expect(firstRes.statusCode).toBe(201);

    // Attempt duplicate trade between the same users
    const duplicateRes = await request(app)
    .post("/trades")
    .send({
        initiator: initiatorDup._id,
        recipient: recipientDup._id,
        initiatorPlants: [plant1._id],
        recipientPlants: [plant2._id],
    });

    expect(duplicateRes.statusCode).toBe(400);
    expect(duplicateRes.body.message).toBe("A trade already exists between these users.");
    });


  it("should get all trades for a user", async () => {
    const res = await request(app).get(`/trades/user/${initiatorUser._id}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a trade’s status", async () => {
    const trade = await Trade.create({
        initiator: initiatorUser._id,
        recipient: recipientUser._id,
        initiatorPlants: [plant1._id],
        recipientPlants: [plant2._id],
    });

    const res = await request(app)
        .put(`/trades/${trade._id}/status`)
        .send({ status: "accepted" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("accepted");
  });

  it("should cancel (soft delete) a trade", async () => {
    const trade = await Trade.create({
        initiator: initiatorUser._id,
        recipient: recipientUser._id,
        initiatorPlants: [plant1._id],
        recipientPlants: [plant2._id],
    });

    const res = await request(app).delete(`/trades/${trade._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.trade.status).toBe("canceled");
  });
});
