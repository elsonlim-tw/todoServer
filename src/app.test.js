const request = require("supertest");
const app = require("./app");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

describe("app", () => {
  let connection;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await connection.close();
  });

  describe("health", () => {
    it("should return status up", async () => {
      const response = await request(app).get("/health");
      expect(response.body).toMatchObject({ status: "up" });
    });
  });
});
