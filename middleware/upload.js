const dotenv = require("dotenv");

const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
const { mongoose } = require("mongoose");
const path = require("path");
const crypto = require('crypto');

dotenv.config();

const url = process.env.DB_CONNECT;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => {
    console.log("Connected to database: GridApp");
  },
  (err) => console.log(err)
);

const storage = new GridFsStorage({
  url: process.env.DB_CONNECT,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          fileName: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });
module.exports = upload;
