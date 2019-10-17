const request = require("supertest");
const app = require("../app");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

describe("user router", () => {
  let connection;
  let db;
  let usersCollection;
  const createUser = async user => {
    return await request(app)
      .post("/users/create")
      .set("Content-Type", "application/json")
      .send(user);
  };

  const loginUser = async user => {
    return await request(app)
      .post("/users/login")
      .set("Content-Type", "application/json")
      .send(user);
  };

  beforeAll(async () => {
    const dbParams = global.__MONGO_URI__.split("/");
    const dbName = dbParams[dbParams.length - 1];
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
    });
    db = await connection.db(dbName);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await connection.close();
    await db.close();
  });

  beforeEach(async () => {
    await db.dropDatabase();
    usersCollection = await db.collection("users");
  });

  it("/users", async () => {
    const response = await request(app).get("/users");
    expect(response.text).toBe("OK");
  });

  describe("/users/create", () => {
    it("POST should create a user with password as bcrypt digest", async () => {
      const user = {
        username: "john",
        password: "password",
      };
      await createUser(user);

      const userFmDB = await usersCollection.findOne({
        username: user.username,
      });
      expect(userFmDB.username).toBe(user.username);
      expect(userFmDB.password).not.toBe(user.password);
      expect(userFmDB.password).toMatch(/\$2b\$10\$.+/);
      expect(userFmDB.password).toHaveLength(60);
    });

    it("POST, different user with same password should have different digest", async () => {
      const password = "password";
      const userOne = { username: "john", password };
      const userTwo = { username: "mary", password };

      await createUser(userOne);
      await createUser(userTwo);

      const userOneFmDb = await usersCollection.findOne({
        username: userOne.username,
      });
      const userTwoFmDb = await usersCollection.findOne({
        username: userTwo.username,
      });

      expect(userOneFmDb.password).toHaveLength(60);
      expect(userTwoFmDb.password).toHaveLength(60);
      expect(userOneFmDb.password).not.toBe(userTwoFmDb.password);
    });
  });

  describe("/users/login", () => {
    it("should return 401 if user does not exist", async () => {
      const user = {
        username: "john",
        password: "password",
      };
      const response = await loginUser(user);
      expect(response.status).toBe(401);
    });

    it("should return 401 if user password does not match", async () => {
      const user = {
        username: "john",
        password: "password",
      };

      await createUser(user);
      const response = await loginUser({
        username: user.username,
        password: "wrong password",
      });

      expect(response.status).toBe(401);
    });

    it("should return 200 if password match", async () => {
      const user = {
        username: "john",
        password: "password",
      };

      await createUser(user);
      const response = await loginUser(user);

      expect(response.status).toBe(200);
    });
  });
});
