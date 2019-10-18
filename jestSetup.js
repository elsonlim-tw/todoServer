process.env.MONGODB_URI = global.__MONGO_URI__;

const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

let connection, db;

beforeAll(async () => {
  const dbParams = global.__MONGO_URI__.split("/");
  const dbName = dbParams[dbParams.length - 1];
  connection = await MongoClient.connect(global.__MONGO_URI__, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  db = await connection.db(dbName);
  global.db = db;
});

afterAll(async () => {
  await mongoose.disconnect();
  await connection.close();
});

afterEach(async () => {
  await db.dropDatabase();
});
