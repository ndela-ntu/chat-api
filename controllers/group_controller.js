const Message = require("../models/message_schema");
const User = require("../models/user_schema");
const Group = require("../models/group_schema");

const findUserByToken = require("../lib/find_user");

exports.group_list = function (req, res, next) {
  Group.find().exec((err, groups) => {
    if (err) {
      return next(err);
    }

    res.json(groups);
  });
};

exports.group_create_post = function (req, res, next) {
  const body = req.body;
  const group = new Group(body);

  group.save((err) => {
    if (err) {
      return next(err);
    }
    res.status(201);
    res.json(group);
  });
};

exports.group_update_patch = function (req, res, next) {
  const body = req.body;
  const groupId = req.params.id;

  Group.findByIdAndUpdate(groupId, { name: body.name }, (err, group) => {
    if (err) {
      return next(err);
    }

    if (group) {
      res.json(group);
    } else {
      var err = new Error("Group not found");
      err.status = 404;
      return next(err);
    }
  });
};

exports.group_delete = function (req, res, next) {
  const body = req.body;
  const groupId = req.params.id;

  Group.findByIdAndDelete(groupId, (err, group) => {
    if (err) {
      return next(err);
    }

    if (group) {
      res.json(group);
    } else {
      var err = new Error("Group not found");
      err.status = 404;
      return next(err);
    }
  });
};

exports.group_details_get = function (req, res, next) {
  const id = req.params.id;

  Group.findById(id).exec((err, group) => {
    if (err) {
      return next(err);
    }

    if (group) {
      res.json(group);
    } else {
      var err = new Error("Group not found");
      err.status = 404;
      return next(err);
    }
  });
};

exports.group_messages_get = function (req, res, next) {
  const id = req.params.id;

  Group.findById(id, "messages").exec((err, group) => {
    if (err) {
      return next(err);
    }

    if (group) {
      res.json(group.messages);
    } else {
      var err = new Error("Group not found");
      err.status = 404;
      return next(err);
    }
  });
};

exports.group_users_get = function (req, res, next) {
  const id = req.params.id;

  Group.findById(id, "users").exec((err, group) => {
    if (err) {
      return next(err);
    }

    if (group) {
      res.json(group.users);
    } else {
      var err = new Error("Group not found");
      err.status = 404;
      return next(err);
    }
  });
};

exports.group_new_message_post = function (req, res, next) {
  const body = req.body;
  const groupId = req.params.id;
  const userId = findUserByToken(
    req.headers["authorization"].split(" ")[1]
  ).user_id;

  Group.findById(groupId).exec((err, group) => {
    if (err) {
      return next(err);
    }

    if (!group) {
      var err = new Error("Group not found");
      err.status = 404;
      return next(err);
    }

    if (group.users.some((user) => user.id == userId)) {
      const newMessage = new Message({
        message: body.message,
        groupId: groupId,
        userId: userId,
      });

      newMessage.save((err) => {
        if (err) {
          console.error(err);
          return next(err);
        }

        group
          .updateOne(
            { $push: { messages: newMessage } },
            { new: true, upsert: true }
          )
          .exec((err, grp) => {
            if (err) {
              return next(err);
            }

            res.json(newMessage);
          });
      });
    } else {
      var error = new Error("User is not a part of the Group");
      error.status = 404;
      return next(error);
    }
  });
};

exports.group_new_user_post = function (req, res, next) {
  const body = req.body;
  const groupId = req.params.id;
  const userId = findUserByToken(
    req.headers["authorization"].split(" ")[1]
  ).user_id;

  User.findById(userId).exec((err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      Group.findByIdAndUpdate(
        groupId,
        { $push: { users: user } },
        { new: true, upsert: true }
      ).exec((err, group) => {
        if (err) {
          return next(err);
        }

        if (group) {
          res.json(user);
        } else {
          var err = new Error("Group not found");
          err.status = 404;
          return next(err);
        }
      });
    } else {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
  });
};
