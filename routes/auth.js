const express = require("express");
const authRoute = express.Router();
const AuthController = require("./../controllers/auth");

authRoute.post("/login/teacher", AuthController.loginTeacher);
authRoute.post("/login/headmaster", AuthController.loginHeadmaster);
authRoute.post("/login/student", AuthController.loginStudent);
authRoute.post("/login/parent", AuthController.loginParent);
authRoute.post("/logout", AuthController.logout);
authRoute.put("/reset-password", AuthController.resetPassword);
authRoute.put("/new-password", AuthController.newPassword);
authRoute.put("/valid-password-token", AuthController.validPasswordToken);


module.exports = authRoute;