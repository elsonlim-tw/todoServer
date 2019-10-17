const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

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
});

const SALT_ROUND = 10;
UserSchema.pre("save", async function(next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const digest = await bcrypt.hash(user.password, SALT_ROUND);
  user.password = digest;
  next();
});

UserSchema.methods.comparePassword = async function(inputPassword) {
  const user = this;
  return await bcrypt.compare(inputPassword, user.password);
};

const userModel = model("user", UserSchema);
module.exports = userModel;
