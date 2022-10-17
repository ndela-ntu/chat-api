"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var chatMessageSchema = new Schema({
  message: String,
  group: {
    type: Schema.Types.ObjectId,
    ref: "ChatGroup"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "ChatUser"
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var chatGroupSchema = new Schema({
  name: String,
  messages: [{
    type: Schema.Types.ObjectId,
    ref: "ChatMessage"
  }],
  users: [{
    type: Schema.Types.ObjectId,
    ref: "ChatUser"
  }],
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
var ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
var ChatGroup = mongoose.model("ChatGroup", chatGroupSchema);
module.exports = {
  ChatMessage: ChatMessage,
  ChatGroup: ChatGroup,
  ChatUser: ChatUser
};