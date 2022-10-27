const dotenv = require("dotenv");
const upload = require("../middleware/upload");

dotenv.config();

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const Image = require("../models/image_schema");

const url = process.env.DB_CONNECT;

const baseUrl = "https://chat-api-ver1.herokuapp.com/files";

const mongoClient = new MongoClient(url);

exports.upload_file_post = async (req, res, next) => {
  Image.findOne({ caption: req.body.caption }).exec((err, image) => {
    if (err) {
      return next(err);
    }

    if (image) {
      return res.status(200).json({
        success: false,
        message: "Image already exists",
      });
    }

    const newImage = new Image({
      caption: req.body.caption,
      filename: req.file.filename,
      fileId: req.file.id,
    });

    newImage.save((err) => {
      if (err) {
        return next(err);
      }
      return res.json({
        sucess: true,
        newImage,
      });
    });
  });
};

exports.upload_file_get = (req, res, next) => {
  Image.find({}).exec((err, images) => {
    if (err) {
      return next(err);
    }

    return res.json({ success: true, images });
  });
};

exports.upload_file_delete = (req, res, next) => {
  Image.findByIdAndDelete(req.params.id).exec((err, image) => {
    if (err) {
      return next(err);
    }

    if (image) {
      return res.json(image);
    }

    var err = new Error("File not found");
    err.status = 404;
    return next(err);
  });
};

exports.upload_recent_get = (req, res, next) => {
  Image.findOne({}, {}, { sort: { _id: -1 } }).exec((err, image) => {
    if (err) {
      return next(err);
    }

    return res.json(image);
  });
};

exports.upload_multiple_get = (req, res, next) => {
  console.log(req.files);
  return res.json({
    success: true,
    message: `${req.files.length} files uploaded successfully`,
  });
};

exports.upload_files_get = gfs = (req, res, next) => {
  console.log(gfs);
  gfs.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.json({
        files: [],
      });
    }

    files.map((file) => {
      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png" ||
        file.contentType === "image/svg"
      ) {
        file.isImage = true;
      } else {
        file.isImage = false;
      }
    });

    res.json({
      files,
    });
  });
};

exports.download_get =  (req, res, next) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return son({
        message: 'No files available',
      });

      
    }
    return 
  });
};
