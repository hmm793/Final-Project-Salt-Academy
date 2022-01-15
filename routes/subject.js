const express = require("express");
const subjectRoute = express.Router();
const SubjectController = require("./../controllers/subject");

subjectRoute.post("/", SubjectController.createNewSubject);
subjectRoute.get("/", SubjectController.getAllSubject);
subjectRoute.put("/:id", SubjectController.editSubject);
subjectRoute.get("/:id", SubjectController.getSubjectByID);

module.exports = subjectRoute;
