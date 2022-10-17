"use strict";

var express = require("express");

var _require = require("../model/chat_schema"),
    ChatMessage = _require.ChatMessage,
    ChatGroup = _require.ChatGroup,
    ChatUser = _require.ChatUser;

var chatRouter = express.Router();
chatRouter.route("/groups").get(function (req, res) {
  ChatGroup.find().exec(function (err, groups) {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred retrieving the groups from the database");
    }

    res.json(groups);
  });
}).post(function (req, res) {});
chatRouter.route("/messages/:id").get(function (req, res) {
  ChatMessage.find().exec(function (err, messages) {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred retrieving the messages from the database");
    }

    res.json(messages);
  });
}).post(function (req, res) {
  var message = new ChatMessage({
    message: req.body.message
  });
  message.save(function (err) {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred saving the message to the database");
    }

    res.json(message);
  });
});
module.exports = chatRouter;