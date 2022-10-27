require("dotenv").config();

const Message = require("../models/message_schema");
const User = require("../models/user_schema");
const Group = require("../models/group_schema");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.user_list =  (req, res, next) => {
  User.find().exec((err, user) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    return res.json(user);
  });
};

exports.user_login_post = (req, res, next) => {
  try {
    const { email, password } = req.body;

    User.findOne({ email }).exec(async (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(404).send("User not found");
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(404).send("Email or Password is wrong");
      }

      const token = jwt.sign(
        { user_id: user._id, email: email },
        process.env.TOKEN_KEY,
        { expiresIn: "1h" }
      );

      return res.json({
        username: user.username,
        email: user.email,
        token: token,
      });
    });
  } catch (err) {
    return next(err);
  }
};

exports.user_create_post = (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!(email && password && username)) {
      res.status(400).send("All fields are required");
    }

    User.findOne({ email }).exec(async (err, user) => {
      if (err) {
        return next(err);
      }

      if (user) {
        return res.status(409).send("User already exits");
      }

      const hashedPassowrd = await bcrypt.hash(password, 10);

      const newUser = new User({
        username: username,
        password: hashedPassowrd,
        email: email,
      });

      newUser.save((err) => {
        if (err) {
          console.error(err);
          return next(err);
        }

        const token = jwt.sign(
          { user_id: newUser._id, email: email },
          process.env.TOKEN_KEY,
          { expiresIn: "1h" }
        );

        return res.json({
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          createdAt: newUser.createdAt,
          token: token,
        });
      });
    });
  } catch (err) {
    return next(err);
  }
};

exports.user_update_patch =  (req, res, next) => {
  const body = req.body;
  const userId = req.params.id;
  const newUser = new User({ _id: userId, name: body.name });

  User.findByIdAndUpdate(userId, newUser, (err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json(user);
    } else {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
  });
};

exports.user_delete =  (req, res, next) => {
  const body = req.body;
  const userId = req.params.id;

  User.findByIdAndDelete(userId, (err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json(user);
    } else {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
  });
};

exports.user_details_get =  (req, res, next) =>  {
  const id = req.params.id;

  User.findById(id).exec((err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      return res.json(user);
    } else {
      var err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
  });
};

exports.user_messages_get =  (req, res, next) => {
  const userId = req.params.id;
  const groupId = req.query.group_id;

  User.findById(userId).exec((err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      Group.findById(groupId).exec((err, group) => {
        if (err) {
          return next(err);
        }

        if (group) {
          return res.json(
            group.messages.filter((message) => message.userId == userId)
          );
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
