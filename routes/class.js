const express = require("express");
const classRoute = express.Router();
const ClassController = require("./../controllers/kelas");

// Auth Autho
const AuthJWT = require("../helper/authJWT");

classRoute.post(
  "/",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  ClassController.createNewClass
);
classRoute.put(
  "/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  ClassController.editClass
);

classRoute.get("/", ClassController.getAllClass);
classRoute.get("/:id", ClassController.getClassByID);
classRoute.get("/getClassBySubject/:id", ClassController.getClassBySubject);

module.exports = classRoute;
