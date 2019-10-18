const express = require("express");
const router = express.Router();
const { createUser, login, getUserInfo } = require("../handlers/user.handler");
const { verifyJwt } = require("../middleware/verifyJwt");
const todoRouter = require("./todo");

const verifyUsername = (req, res, next) => {
  const { username } = req.params;
  if (username !== req.username) {
    return res.sendStatus(403);
  }

  next();
};

router.post("/create", createUser);
router.post("/login", login);
router.get("/me", verifyJwt, getUserInfo);
router.use("/:username/todolists", verifyJwt, verifyUsername, todoRouter);

module.exports = router;
