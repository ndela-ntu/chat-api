"use strict";

require("dotenv").config();

var Message = require("../models/message_schema");

var User = require("../models/user_schema");

var Group = require("../models/group_schema");

var bcrypt = require("bcrypt");

var jwt = require("jsonwebtoken");

exports.user_list = function (req, res, next) {
  User.find().exec(function (err, user) {
    if (err) {
      console.error(err);
      return next(err);
    }

    res.json(user);
  });
};

exports.user_login_post = function (req, res, next) {
  try {
    var _req$body = req.body,
        email = _req$body.email,
        password = _req$body.password;
    User.findOne({
      email: email
    }).exec(function _callee(err, user) {
      var validPassword, token;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!err) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", next(err));

            case 2:
              if (user) {
                _context.next = 4;
                break;
              }

              return _context.abrupt("return", res.status(404).send("User not found"));

            case 4:
              _context.next = 6;
              return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

            case 6:
              validPassword = _context.sent;

              if (validPassword) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("return", res.status(404).send("Email or Password is wrong"));

            case 9:
              token = jwt.sign({
                user_id: user._id,
                email: email
              }, process.env.TOKEN_KEY, {
                expiresIn: "1h"
              });
              res.json({
                username: user.username,
                email: user.email,
                token: token
              });

            case 11:
            case "end":
              return _context.stop();
          }
        }
      });
    });
  } catch (err) {
    return next(err);
  }
};

exports.user_create_post = function (req, res, next) {
  try {
    var _req$body2 = req.body,
        username = _req$body2.username,
        email = _req$body2.email,
        password = _req$body2.password;

    if (!(email && password && username)) {
      res.status(400).send("All fields are required");
    }

    User.findOne({
      email: email
    }).exec(function _callee2(err, user) {
      var hashedPassowrd, newUser;
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!err) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", next(err));

            case 2:
              if (!user) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return", res.status(409).send("User already exits"));

            case 4:
              _context2.next = 6;
              return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

            case 6:
              hashedPassowrd = _context2.sent;
              newUser = new User({
                username: username,
                password: hashedPassowrd,
                email: email
              });
              newUser.save(function (err) {
                if (err) {
                  console.error(err);
                  return next(err);
                }

                var token = jwt.sign({
                  user_id: newUser._id,
                  email: email
                }, process.env.TOKEN_KEY, {
                  expiresIn: "1h"
                });
                res.json({
                  _id: newUser._id,
                  username: newUser.username,
                  email: newUser.email,
                  isAdmin: newUser.isAdmin,
                  createdAt: newUser.createdAt,
                  token: token
                });
              });

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
  } catch (err) {
    return next(err);
  }
};

exports.user_update_patch = function (req, res, next) {
  var body = req.body;
  var userId = req.params.id;
  var newUser = new User({
    _id: userId,
    name: body.name
  });
  User.findByIdAndUpdate(userId, newUser, function (err, user) {
    if (err) {
      return next(err);
    }

    if (user) {
      res.json(user);
    } else {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
  });
};

exports.user_delete = function (req, res, next) {
  var body = req.body;
  var userId = req.params.id;
  User.findByIdAndDelete(userId, function (err, user) {
    if (err) {
      return next(err);
    }

    if (user) {
      res.json(user);
    } else {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
  });
};

exports.user_details_get = function (req, res, next) {
  var id = req.params.id;
  User.findById(id).exec(function (err, user) {
    if (err) {
      return next(err);
    }

    if (user) {
      res.json(user);
    } else {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
  });
};

exports.user_messages_get = function (req, res, next) {
  var userId = req.params.id;
  var groupId = req.query.group_id;
  User.findById(userId).exec(function (err, user) {
    if (err) {
      return next(err);
    }

    if (user) {
      Group.findById(groupId).exec(function (err, group) {
        if (err) {
          return next(err);
        }

        if (group) {
          res.json(group.messages.filter(function (message) {
            return message.userId == userId;
          }));
        } else {
          var err = new Error("Group not found");
          err.status = 404;
          return next(err);
        }
      });
    } else {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
  });
};