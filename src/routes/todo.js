const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/new", async (req, res) => {
  const { title } = req.body;
  const user = await User.findOne({ username: req.username });

  user.todoLists.push({ title });
  await user.save();

  res.json({ todoLists: user.todoLists });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ username: req.username });

  user.todoLists.id(id).remove();
  await user.save();

  res.sendStatus(204);
});

module.exports = router;
