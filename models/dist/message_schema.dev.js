"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var MessageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model("Message", MessageSchema);