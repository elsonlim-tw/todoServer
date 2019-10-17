const request = require("supertest");
const app = require("../app");

describe("user router", () => {
  it("/users", async () => {
    const response = await request(app).get("/users");
    expect(response.text).toBe("OK");
  });
});
