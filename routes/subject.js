const express = require("express");
const subjectRoute = express.Router();
const SubjectController = require("./../controllers/subject");
// Auth Autho
const AuthJWT = require("../helper/authJWT");

// Only By Headmaster
subjectRoute.post(
  "/",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  SubjectController.createNewSubject
);

// Teacher, Headmaster
// Student Dan Parent !
subjectRoute.get(
  "/",
  AuthJWT.authentication,
  AuthJWT.authTeacherAndHeadmasterForGetAllSubject,
  SubjectController.getAllSubject
);

// Only By Headmaster
subjectRoute.put(
  "/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  SubjectController.editSubject
);

// Teacher, Headmaster
// Student Dan Parent !
subjectRoute.get(
  "/:id",
  AuthJWT.authentication,
  AuthJWT.authTeacherAndHeadmaster,
  SubjectController.getSubjectByID
);

// Only By Headmaster
subjectRoute.delete(
  "/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  SubjectController.deleteSubject
);

module.exports = subjectRoute;
