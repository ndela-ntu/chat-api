const express = require("express");
const app = express();

const { startDatabase } = require("./database/mongo");
const error_handler = require('./lib/error_handler');
const token_auth = require('./middleware/auth');

const groupRouter = require("./routes/group_route");
var group_controller = require("./controllers/group_controller");

const userRouter = require('./routes/user_route');
var user_controller = require('./controllers/user_controller');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/chat/user/login', user_controller.user_login_post);
app.post('/chat/user', user_controller.user_create_post);

app.use(token_auth)
app.get('/chat/users', user_controller.user_list);
app.use('/chat/user', userRouter);

app.get("/chat/groups", group_controller.group_list);
app.use('/chat/group', groupRouter);

app.use(error_handler);

startDatabase().then(async () => {
  app.listen(3000, () => {
    console.log("Server running in PORT 3000");
  });
});
