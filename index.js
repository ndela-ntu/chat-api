const express = require("express");
const dotenv = require("dotenv");

const app = express();

const mongoose = require("mongoose");

const error_handler = require("./lib/error_handler");
const token_auth = require("./middleware/auth");

const groupRouter = require("./routes/group_route");
var group_controller = require("./controllers/group_controller");

const userRouter = require("./routes/user_route");
var user_controller = require("./controllers/user_controller");

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

add.get('/', function(req, res) {
  res.send("<p>Welcome, this is the CHAT-API. Use routes to /chat...</p>");
});

app.post("/chat/user/login", user_controller.user_login_post);
app.post("/chat/user", user_controller.user_create_post);

app.use(token_auth);
app.get("/chat/users", user_controller.user_list);
app.use("/chat/user", userRouter);

app.get("/chat/groups", group_controller.group_list);
app.use("/chat/group", groupRouter);

app.use(error_handler);

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, function (err, db) {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT, () => {
      console.warn(`Server running in PORT: ${PORT}`);
    });
  }
});
