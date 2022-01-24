const express = require("express");
const scheduleRoute = express.Router();
const ScheduleController = require("./../controllers/schedule");
// Auth Autho
const AuthJWT = require("../helper/authJWT");

scheduleRoute.get("/tempSchedule", ScheduleController.getTempSchedule);
scheduleRoute.get("/byTeacher/:id", ScheduleController.getScheduleByTeacher);
scheduleRoute.get("/byStudent/:id", ScheduleController.getScheduleByStudent);
scheduleRoute.get("/", ScheduleController.getAllSchedule);
scheduleRoute.get("/:id", ScheduleController.getScheduleByID);

// DI BAWAH INI KHUSUS UNTUK HEADMASTER
scheduleRoute.post(
  "/",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  ScheduleController.createNewSchedule
);
scheduleRoute.put(
  "/editEvent/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  ScheduleController.editScheduleByID
);
scheduleRoute.delete(
  "/:id",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  ScheduleController.deleteSchedule
);
scheduleRoute.put(
  "/",
  AuthJWT.authentication,
  AuthJWT.authHeadmaster,
  ScheduleController.updateDragDropSchedule
);

module.exports = scheduleRoute;
