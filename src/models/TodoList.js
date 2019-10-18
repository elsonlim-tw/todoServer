const { Schema } = require("mongoose");

const Todo = new Schema({
  item: {
    type: String,
    required: true,
  },
  isDone: Boolean,
});

const TodoList = new Schema({
  title: {
    type: String,
    required: true,
  },
  todos: [Todo],
});

module.exports.TodoList = TodoList;
