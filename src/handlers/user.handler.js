const User = require("../models/User");

module.exports.createUser = async (req, res) => {
  const { username, password } = req.body;

  const user = new User({
    username,
    password,
  });

  await user.save();
  res.json({
    username: user.username,
    jwt: user.generateJwt(),
  });
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  let isUser = false;

  if (user) {
    isUser = await user.comparePassword(password);
  }

  if (isUser) {
    return res.json({
      username: user.username,
      jwt: user.generateJwt(),
    });
  }
  res.sendStatus(401);
};
