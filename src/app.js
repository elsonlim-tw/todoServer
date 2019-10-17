const express = require("express");
const userRouter = require("./routes/user");

const app = express();

app.use("/users", userRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "up",
  });
});

module.exports = app;
