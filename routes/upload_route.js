const express = require("express");
const dotenv = require("dotenv");
const { mongoose } = require("mongoose");
const upload_controller = require("../controllers/upload_controller");
const uploadRouter = express.Router();

dotenv.config();

module.exports = (upload) => {
  const connect = mongoose.createConnection(process.env.DB_CONNECT, {
    useNewUrlParseR: true,
    useUnifiedTopology: true,
  });
  let gfs;

  connect.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(connect.db, {
      bucketName: process.env.IMG_BUCKET,
    });
  });

  uploadRouter.post(
    "/",
    upload.single("file"),
    upload_controller.upload_file_post
  );

  uploadRouter.get(
    "/",
    upload.single("file"),
    upload_controller.upload_file_get
  );

  uploadRouter.delete("/delete/:id", upload_controller.upload_file_delete);

  uploadRouter.get("/recent", upload_controller.upload_recent_get);

  return uploadRouter;
};
