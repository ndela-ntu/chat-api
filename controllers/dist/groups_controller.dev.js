"use strict";

var Message = require("../models/message_schema");

var User = require("../models/user_schema");

var Group = require("../models/group_schema");

exports.group_list = function (req, res, next) {
  Group.find().exec(function (err, groups) {
    if (err) {
      console.error(err);
      return next(err);
    }

    res.json(groups);
  });
};

exports.group_create_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Author create POST");
};