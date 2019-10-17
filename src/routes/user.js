const express = require("express");
const router = express.Router();
const { createUser, login } = require("../handlers/user.handler");

router.get("/", (req, res) => {
  res.sendStatus(200);
});

router.post("/create", createUser);
router.post("/login", login);

module.exports = router;
