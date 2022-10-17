require("dotenv").config();

const jwt = require("jsonwebtoken");

const findUserByToken = (token) => {
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  return decoded;
};

module.exports = findUserByToken;
