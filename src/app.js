require("dotenv").config();
require("./utils/db");
const express = require("express");
const userRouter = require("./routes/user");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

app.use("/users", userRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "up",
  });
});

module.exports = app;
