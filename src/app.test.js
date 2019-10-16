const request = require("supertest");
const app = require("./app");

describe("app", () => {
  describe("health", () => {
    it("should return status up", async () => {
      const response = await request(app).get("/health");
      expect(response.body).toMatchObject({ status: "up" });
    });
  });
});
