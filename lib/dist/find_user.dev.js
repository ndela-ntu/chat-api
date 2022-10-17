"use strict";

require("dotenv").config();

var jwt = require("jsonwebtoken");

var findUserByToken = function findUserByToken(token) {
  var decoded = jwt.verify(token, process.env.TOKEN_KEY);
  return decoded;
};

module.exports = findUserByToken;