const request = require("supertest");
const app = require("../app");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

describe("user router", () => {
  let usersCollection;
  let db;

  beforeEach(() => {
    db = global.db;
  });

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

  beforeEach(async () => {
    usersCollection = await db.collection("users");
  });

  describe("/users/create", () => {
    describe("POST", () => {
      it("should create a user with password as bcrypt digest", async () => {
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

      it("different user with same password should have different digest", async () => {
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

      it("should return jwt token", async () => {
        const userOne = { username: "john", password: "password" };
        const response = await createUser(userOne);
        expect(response.status).toBe(200);
        expect(response.body.jwt).toEqual(expect.any(String));
      });
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

    it("should return 200 with jwt if password match", async () => {
      const user = {
        username: "john",
        password: "password",
      };

      await createUser(user);
      const response = await loginUser(user);

      expect(response.status).toBe(200);
      expect(response.body.jwt).toEqual(expect.any(String));
    });
  });

  describe("/users/me", () => {
    it("/should return 401 when no jwt passed in", async () => {
      const response = await request(app).get("/users/me");
      expect(response.status).toBe(401);
    });

    it("Get should return 401 if pass in invalidJwt", async () => {
      const user = {
        username: "john",
        password: "password",
      };

      const createRes = await createUser(user);
      const getUserRes = await request(app)
        .get("/users/me")
        .set("authorization", `Bearer ${createRes.body.jwt + 1}`);

      expect(getUserRes.status).toBe(401);
    });

    it("Get should return user name if have the right jwt token", async () => {
      const user = {
        username: "john",
        password: "password",
      };

      const createRes = await createUser(user);
      const getUserRes = await request(app)
        .get("/users/me")
        .set("authorization", `Bearer ${createRes.body.jwt}`);

      expect(getUserRes.status).toBe(200);
      expect(getUserRes.body.username).toBe(user.username);
    });
  });
});
