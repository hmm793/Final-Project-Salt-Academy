const express = require("express");
const mainRoute = express.Router();
const studentRoute = require("./student");
const teacherRoute = require("./teacher");
const headmasterRoute = require("./headmaster");
const subjectRoute = require("./subject");
const classRoute = require("./class");
const parentRoute = require("./parent");
const scheduleRoute = require("./schedule");

mainRoute.use("/headmaster", headmasterRoute);
mainRoute.use("/student", studentRoute);
mainRoute.use("/teacher", teacherRoute);
mainRoute.use("/subject", subjectRoute);
mainRoute.use("/class", classRoute);
mainRoute.use("/parent", parentRoute);
mainRoute.use("/schedule", scheduleRoute);

module.exports = mainRoute;
