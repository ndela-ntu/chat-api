"use strict";

var Message = require("../models/message_schema");

var User = require("../models/user_schema");

var Group = require("../models/group_schema");

var findUserByToken = require('../lib/find_user');

exports.group_list = function (req, res, next) {
  Group.find().exec(function (err, groups) {
    if (err) {
      return next(err);
    }

    res.json(groups);
  });
};

exports.group_create_post = function (req, res, next) {
  var body = req.body;
  var group = new Group(body);
  group.save(function (err) {
    if (err) {
      return next(err);
    }

    res.status(201);
    res.json(group);
  });
};

exports.group_update_patch = function (req, res, next) {
  var body = req.body;
  var groupId = req.params.id;
  Group.findByIdAndUpdate(groupId, {
    name: body.name
  }, function (err, group) {
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
  var body = req.body;
  var groupId = req.params.id;
  Group.findByIdAndDelete(groupId, function (err, group) {
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
  var id = req.params.id;
  Group.findById(id).exec(function (err, group) {
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
  var id = req.params.id;
  Group.findById(id, "messages").exec(function (err, group) {
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
  var id = req.params.id;
  Group.findById(id, "users").exec(function (err, group) {
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
  var body = req.body;
  var groupId = req.params.id;
  var userId = findUserByToken(req.headers["authorization"].split(' ')[1]).user_id; //const userId = req.query.user_id;

  User.findById(userId).exec(function (err, user) {
    if (err) {
      return next(err);
    }

    if (user) {
      Group.findById(groupId).exec(function (err, group) {
        if (err) {
          return next(err);
        }

        if (!group) {
          var err = new Error("Group not found");
          err.status = 404;
          return next(err);
        }

        if (group.users) {}
      });
      var newMessage = new Message({
        message: body.message,
        groupId: groupId,
        userId: userId
      });
      Group.findByIdAndUpdate(groupId, {
        $push: {
          messages: newMessage
        }
      }, {
        "new": true,
        upsert: true
      }).exec(function (err, group) {
        if (err) {
          return next(err);
        }

        if (group) {
          newMessage.save(function (err) {
            if (err) {
              console.error(err);
              return next(err);
            }

            res.json(newMessage);
          });
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

exports.group_new_user_post = function (req, res, next) {
  var body = req.body;
  var groupId = req.params.id;
  var userId = req.query.user_id;
  User.findById(userId).exec(function (err, user) {
    if (err) {
      return next(err);
    }

    if (user) {
      Group.findByIdAndUpdate(groupId, {
        $push: {
          users: user
        }
      }, {
        "new": true,
        upsert: true
      }).exec(function (err, group) {
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
      var err = new Error("Group not found");
      err.status = 404;
      return next(err);
    }
  });
};