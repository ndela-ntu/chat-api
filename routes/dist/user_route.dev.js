"use strict";

var express = require("express");

var user_controller = require("../controllers/user_controller");

var userRouter = express.Router(); //userRouter.post('/login', user_controller.user_login_post);

userRouter.get("/:id", user_controller.user_details_get);
userRouter.get('/:id/messages', user_controller.user_messages_get); //userRouter.post('/', user_controller.user_create_post);

userRouter["delete"]('/:id', user_controller.user_delete);
userRouter.patch('/:id', user_controller.user_update_patch);
module.exports = userRouter;