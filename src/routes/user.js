const express = require("express");
const router = express.Router();
const { createUser, login, getUserName } = require("../handlers/user.handler");
const { verifyJwt } = require("../middleware/verifyJwt");

router.post("/create", createUser);
router.post("/login", login);
router.get("/", verifyJwt, getUserName);

module.exports = router;
