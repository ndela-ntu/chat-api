const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const app = express();
const database = require("./lib/database");

const error_handler = require("./lib/error_handler");
const token_auth = require("./middleware/auth");

const groupRouter = require("./routes/group_route");
const group_controller = require("./controllers/group_controller");
const userRouter = require("./routes/user_route");
const user_controller = require("./controllers/user_controller");
const uploadRouter = require("./routes/upload_route");
const upload = require("./middleware/upload");

dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
  res.send("<p>Welcome, this is the CHAT-API. Use routes to /chat...</p>");
});

app.post("/chat/user/login", user_controller.user_login_post);
app.post("/chat/user", user_controller.user_create_post);

app.use(token_auth);
app.get("/chat/users", user_controller.user_list);
app.use("/chat/user", userRouter);

app.get("/chat/groups", group_controller.group_list);
app.use("/chat/group", groupRouter);

app.use("/upload", uploadRouter(upload));

app.use(error_handler);

app.listen(PORT, () => {
  database.startDatabase();
  console.warn(`Server running in PORT: ${PORT}`);
});
