const jwtHelper = require("../utils/jwtHelper");

module.exports.verifyJwt = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    req.username = jwtHelper.getUserNameFromToken(token);
    next();
  } catch (e) {
    return res.sendStatus(401);
  }
};
