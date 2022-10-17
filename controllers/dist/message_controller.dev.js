"use strict";

var Message = require("../models/message_schema");

var User = require("../models/user_schema");

var Group = require("../models/group_schema");

exports.message_list = function (req, res, next) {
  Message.find().exec(function (err, messages) {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred retrieving the messages from the database");
    }

    res.json(messages);
  });
};

exports.message_create_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Author create POST");
};