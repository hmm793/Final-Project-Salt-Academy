const express = require("express");
const multer = require("multer");

const parentRoute = express.Router();
const ParentController = require("./../controllers/parent");

// Auth Autho
const AuthJWT = require("../helper/authJWT");

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
// Headmaster
parentRoute.post(
  "/register",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  uploadOptions.single("image"),
  ParentController.createNewParent
);

// Buat Parent
parentRoute.put(
  "/byparent/:id",
  AuthJWT.authentication,
  AuthJWT.authParentAndHeadmaster,
  ParentController.editByParent
);

// Buat Headmaster
parentRoute.put(
  "/status/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  ParentController.editStatus
);

// Buat Parent
parentRoute.put(
  "/byparent/image/:id",
  AuthJWT.authentication,
  AuthJWT.authParentAndHeadmaster,
  uploadOptions.single("image"),
  ParentController.editParentImageByParent
);

// Headmaster
parentRoute.put(
  "/byheadmaster/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  ParentController.editByHeadmaster
);

// Headmaster
parentRoute.put(
  "/byheadmaster/image/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  ParentController.editParentImageByHeadMaster
);

// By Headmaster
parentRoute.get(
  "/count",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  ParentController.parentCount
);

// By Headmaster
parentRoute.get(
  "/",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  ParentController.getAllParentData
);

// Parent dan Headmaster
parentRoute.get(
  "/:id",
  AuthJWT.authentication,
  AuthJWT.authParentAndHeadmaster,
  ParentController.getParentByID
);

// Only By Parent
parentRoute.post("/login", ParentController.parentLogin);
// Only By Parent
parentRoute.put("/reset-password", ParentController.resetPassword);

module.exports = parentRoute;
