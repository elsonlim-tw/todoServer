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

router.post("/:id/todos", async (req, res) => {
  const { id } = req.params;
  const { item } = req.body;

  const user = await User.findOne({ username: req.username });
  user.todoLists.id(id).todos.push({
    item,
    isDone: false,
  });
  await user.save();

  res.sendStatus(201);
});

router.delete("/:listId/todos/:todoId", async (req, res) => {
  const { listId, todoId } = req.params;

  const user = await User.findOne({ username: req.username });
  user.todoLists
    .id(listId)
    .todos.id(todoId)
    .remove();
  await user.save();

  res.send(204);
});

router.patch("/:listId/todos/:todoId", async (req, res) => {
  const { listId, todoId } = req.params;
  const { item, isDone } = req.body;

  const user = await User.findOne({ username: req.username });
  const todo = user.todoLists.id(listId).todos.id(todoId);
  todo.item = item;
  todo.isDone = isDone;

  await user.save();

  res.send(204);
});

module.exports = router;
