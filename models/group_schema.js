const mongoose = require("mongoose");
const Message = require("../models/message_schema");
const User = require('../models/user_schema');

var Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: { type: String, required: true },
  messages: [Message.schema],
  users: [User.schema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Group", GroupSchema);