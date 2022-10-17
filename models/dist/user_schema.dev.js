"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  isAdmin: {
    type: Boolean,
    "default": false
  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model("User", UserSchema);