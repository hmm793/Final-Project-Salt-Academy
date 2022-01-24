const express = require("express");
const multer = require("multer");

const studentRoute = express.Router();
const StudentController = require("./../controllers/student");

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
studentRoute.post(
  "/register",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  uploadOptions.single("image"),
  StudentController.createNewStudent
);

// Only By Student
studentRoute.put(
  "/bystudent/image/:id",

  uploadOptions.single("image"),
  StudentController.editStudentImageByStudent
);

// Buat Headmaster
studentRoute.put(
  "/status/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  StudentController.editStatus
);

// Buat Student
studentRoute.put(
  "/bystudent/:id",
  AuthJWT.authentication,
  AuthJWT.authStudent,
  StudentController.editStudent
);

// Buat Headmaster
studentRoute.put(
  "/byheadmaster/image/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  uploadOptions.single("image"),
  StudentController.editStudentImageByHeadmaster
);

// Buat Headmaster
studentRoute.put(
  "/byheadmaster/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  StudentController.editStudentByHeadmaster
);

// Buat Student
studentRoute.post("/login", StudentController.studentLogin);

// Buat Headmaster
studentRoute.get(
  "/count",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  StudentController.studentCount
);

// Buat Headmaster
studentRoute.get(
  "/totalMale",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  StudentController.getMaleStudent
);

// Buat Headmaster
studentRoute.get(
  "/totalFemale",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  StudentController.getFemaleStudent
);

// HEadmaster
// !student, !parent, !teacher
studentRoute.get(
  "/",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  StudentController.getAllStudentData
);

// Buat Student, Parent, Headmaster
// !Teacher
studentRoute.get(
  "/:id",
  AuthJWT.authentication,
  AuthJWT.authParentAndStudentAndHeadmaster,
  StudentController.getStudentByID
);

// Buat Teacher
studentRoute.get(
  "/getAllStudentRelatedToTheSubject/:id",
  AuthJWT.authentication,
  AuthJWT.authTeacher,
  StudentController.getAllStudentBySubject
);

// Buat Teacher && Headmaster
studentRoute.get(
  "/getAllStudentRelatedToTheClass/:id",
  AuthJWT.authentication,
  AuthJWT.authTeacherAndHeadmaster,
  StudentController.getStudentsByClass
);
// Only By Student
studentRoute.put("/reset-password", StudentController.resetPassword);

module.exports = studentRoute;
