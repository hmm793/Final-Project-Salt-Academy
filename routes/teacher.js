const express = require("express");
const multer = require("multer");

const teacherRoute = express.Router();
const TeacherController = require("./../controllers/teacher");

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

// Only By Headmaster
teacherRoute.post(
  "/register",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  uploadOptions.single("image"),
  TeacherController.createNewTeacher
);

// Only By Teacher
teacherRoute.put(
  "/byteacher/image/:id",
  AuthJWT.authentication,
  AuthJWT.authTeacher,
  uploadOptions.single("image"),
  TeacherController.editTeacherImageByTeacher
);

// Only By Teacher
teacherRoute.put(
  "/byteacher/:id",
  AuthJWT.authentication,
  AuthJWT.authTeacher,
  TeacherController.updateTeacherByTeacher
);

// Only By Headmaster
teacherRoute.put(
  "/byheadmaster/image/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  uploadOptions.single("image"),
  TeacherController.editTeacherImageByHeadmaster
);

// Only By Headmaster
teacherRoute.put(
  "/byheadmaster/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  TeacherController.updateTeacherByHeadmaster
);

// Only By Headmaster
teacherRoute.get(
  "/count",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  TeacherController.teacherCount
);

// Only By Teacher
teacherRoute.post("/login", TeacherController.teacherLogin);

// Only By Headmaster
teacherRoute.get(
  "/",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  TeacherController.getAllTeacher
);

// By Headmaster and Teacher
teacherRoute.get(
  "/:id",
  AuthJWT.authentication,
  AuthJWT.authTeacher,
  TeacherController.getTeacherByID
);

// Only By Teacher
teacherRoute.post(
  "/scorring/:id",
  AuthJWT.authentication,
  AuthJWT.authTeacher,
  TeacherController.setScoreBySubjectID
);

// Only By Teacher
teacherRoute.put("/reset-password", TeacherController.resetPassword);

module.exports = teacherRoute;
