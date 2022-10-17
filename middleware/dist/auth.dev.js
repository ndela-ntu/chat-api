"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

require("dotenv").config();

var jwt = require("jsonwebtoken");

var findUserByToken = require('../lib/find_user');

var tokenAuth = function tokenAuth(req, res, next) {
  var bearerToken = req.headers["authorization"];

  if (!bearerToken) {
    return res.status(403).send("A bearer token is required for authentication");
  }

  try {
    var _bearerToken$split = bearerToken.split(' '),
        _bearerToken$split2 = _slicedToArray(_bearerToken$split, 2),
        type = _bearerToken$split2[0],
        token = _bearerToken$split2[1];

    if (type === "Bearer") {
      req.user = findUserByToken(token);
      return next();
    }

    return res.status(403).send("".concat(type, " authentication type is not allowed"));
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = tokenAuth;