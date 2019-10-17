const mongoose = require("mongoose");

const dbURI = process.env.MONGODB_URI;

const dbConfig = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbURI, dbConfig);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("MongoDB connected to: " + dbURI);
});
