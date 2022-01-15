const express = require("express");
const multer = require("multer");

const studentRoute = express.Router();
const StudentController = require("./../controllers/student");

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

studentRoute.post(
  "/register",
  uploadOptions.single("image"),
  StudentController.createNewStudent
);

// Buat Student
studentRoute.put(
  "/bystudent/:id",
  uploadOptions.single("image"),
  StudentController.editStudent
);

// Buat Headmaster
studentRoute.put(
  "/byheadmaster/:id",
  uploadOptions.single("image"),
  StudentController.editStudentByHeadmaster
);

studentRoute.get("/count", StudentController.studentCount);

studentRoute.get("/", StudentController.getAllStudentData);
studentRoute.get("/:id", StudentController.getStudentByID);

module.exports = studentRoute;
