const express = require("express");
const multer = require("multer");

const headmasterRoute = express.Router();
const HeadmasterController = require("./../controllers/headmaster");

// Image Input
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

headmasterRoute.post(
  "/register",
  uploadOptions.single("image"),
  HeadmasterController.createNewHeadmaster
);
headmasterRoute.post("/login", HeadmasterController.headmasterLogin);

module.exports = headmasterRoute;
