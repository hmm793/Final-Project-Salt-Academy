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
studentRoute.put("/status/:id", StudentController.editStatus);

// Buat Student
studentRoute.put("/bystudent/:id", StudentController.editStudent);

// Buat Headmaster
studentRoute.put(
  "/byheadmaster/image/:id",
  uploadOptions.single("image"),
  StudentController.editStudentImageByHeadmaster
);

// Buat Headmaster
studentRoute.put(
  "/byheadmaster/:id",
  StudentController.editStudentByHeadmaster
);

// Buat Student
studentRoute.get("/login", StudentController.studentLogin);

studentRoute.get("/count", StudentController.studentCount);
studentRoute.get("/totalMale", StudentController.getMaleStudent);
studentRoute.get("/totalFemale", StudentController.getFemaleStudent);

studentRoute.get("/", StudentController.getAllStudentData);
studentRoute.get("/:id", StudentController.getStudentByID);
studentRoute.get(
  "/getAllStudentRelatedToTheSubject/:id",
  StudentController.getAllStudentBySubject
);
studentRoute.get(
  "/getAllStudentRelatedToTheClass/:id",
  StudentController.getStudentsByClass
);

module.exports = studentRoute;
