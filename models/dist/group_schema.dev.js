"use strict";

var mongoose = require("mongoose");

var Message = require("../models/message_schema");

var User = require('../models/user_schema');

var Schema = mongoose.Schema;
var GroupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  messages: [Message.schema],
  users: [User.schema],
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model("Group", GroupSchema);