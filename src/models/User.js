const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwtHelper = require("../utils/jwtHelper");
const { TodoList } = require("./TodoList");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  todoLists: [TodoList],
});

const SALT_ROUND = 10;
UserSchema.pre("save", async function(next) {
  const user = this;

  /* istanbul ignore next */
  if (!user.isModified("password")) return next();

  const digest = await bcrypt.hash(user.password, SALT_ROUND);
  user.password = digest;
  next();
});

UserSchema.methods.comparePassword = async function(inputPassword) {
  const user = this;
  return await bcrypt.compare(inputPassword, user.password);
};

UserSchema.methods.generateJwt = function() {
  const user = this;
  return jwtHelper.generateJwt(user);
};

const userModel = model("user", UserSchema);
module.exports = userModel;
