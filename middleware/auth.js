require("dotenv").config();

const jwt = require("jsonwebtoken");

const findUserByToken = require('../lib/find_user');

const tokenAuth = (req, res, next) => {
  const bearerToken = req.headers["authorization"];

  if (!bearerToken) {
    return res.status(403).send("A bearer token is required for authentication");
  }

  try {
    const [type, token] = bearerToken.split(' ');

    if (type === "Bearer") {
      req.user = findUserByToken(token);

      return next();
    }

    return res.status(403).send(`${type} authentication type is not allowed`);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = tokenAuth;
