const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_TOKEN;

module.exports.generateJwt = user => {
  return jwt.sign(
    {
      sub: user.id,
      iat: new Date().getTime(),
      user: user.username,
    },
    jwtSecret,
    {
      expiresIn: "1h",
    },
  );
};

module.exports.getUserNameFromToken = token => {
  try {
    const userInfo = jwt.verify(token, jwtSecret);
    return userInfo.user;
  } catch (error) {
    throw new Error("invalid token");
  }
};
