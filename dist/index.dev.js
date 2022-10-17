"use strict";

var express = require("express");

var app = express();

var _require = require("./database/mongo"),
    startDatabase = _require.startDatabase;

var error_handler = require('./lib/error_handler');

var token_auth = require('./middleware/auth');

var groupRouter = require("./routes/group_route");

var group_controller = require("./controllers/group_controller");

var userRouter = require('./routes/user_route');

var user_controller = require('./controllers/user_controller');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.post('/chat/user/login', user_controller.user_login_post);
app.post('/chat/user', user_controller.user_create_post);
app.use(token_auth);
app.get('/chat/users', user_controller.user_list);
app.use('/chat/user', userRouter);
app.get("/chat/groups", group_controller.group_list);
app.use('/chat/group', groupRouter);
app.use(error_handler);
startDatabase().then(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          app.listen(3000, function () {
            console.log("Server running in PORT 3000");
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});