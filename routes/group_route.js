const express = require("express");

var groups_controller = require("../controllers/group_controller");

const groupRouter = express.Router();

groupRouter.get("/:id", groups_controller.group_details_get);

groupRouter.post('/:id/new-message', groups_controller.group_new_message_post);

groupRouter.post('/:id/new-user', groups_controller.group_new_user_post);

groupRouter.get('/:id/messages', groups_controller.group_messages_get);

groupRouter.get('/:id/users', groups_controller.group_users_get);

groupRouter.post('/', groups_controller.group_create_post);

groupRouter.delete('/:id', groups_controller.group_delete);

groupRouter.patch('/:id', groups_controller.group_update_patch);

module.exports = groupRouter;
