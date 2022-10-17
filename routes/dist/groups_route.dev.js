"use strict";

var express = require("express");

var groups_controller = require("../controllers/group_controller");

var message_controller = require("../controllers/message_controller");

var user_controller = require("../controllers/user_controller");

var groupRouter = express.Router();
groupRouter.get("/", groups_controller.group_list);
module.exports = groupRouter;