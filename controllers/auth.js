require("dotenv").config();
const db = require("../models");
const Headmaster = db.headmaster;
const Parent = db.parent;
const Student = db.student;
const Teacher = db.teacher;
const Role = db.role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class AuthController {
  static async loginTeacher(req, res, next) {
    console.log(req.body);
    Teacher.findOne({
      email: req.body.email,
    })
      .populate("role", "-__v")
      .exec((err, teacher) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!teacher) {
          return res.status(404).send({ message: "Email Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          teacher.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({ message: "Invalid Password!" });
        }

        const token = jwt.sign({ id: teacher.id }, process.env.secret, {
          expiresIn: 86400, // 24 hours
        });
        //req.session.token = token;
        // console.log(req.session.token);
        const authorities = [];

        // for (let i = 0; i < teacher.role.length; i++) {
        //   authorities.push("ROLE_" + teacher.role[i].name.toUpperCase());
        // }

        res.status(200).send({
          id: teacher._id,
          email: teacher.email,
          // roles: authorities,
          token: token,
        });
      });
  }

  static async loginHeadmaster(req, res, next) {
    console.log(req.body);
    Headmaster.findOne({
      email: req.body.email,
    })
      .populate("role", "-__v")
      .exec((err, headmaster) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!headmaster) {
          return res.status(404).send({ message: "Email Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          headmaster.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({ message: "Invalid Password!" });
        }

        const token = jwt.sign({ id: parent.id }, process.env.secret, {
          expiresIn: 86400, // 24 hours
        });
        //req.session.token = token;
        // console.log(req.session.token);
        const authorities = [];

        // for (let i = 0; i < teacher.role.length; i++) {
        //   authorities.push("ROLE_" + teacher.role[i].name.toUpperCase());
        // }

        res.status(200).send({
          id: headmaster._id,
          email: headmaster.email,
          // roles: authorities,
          token: token,
        });
      });
  }

  static async loginStudent(req, res, next) {
    console.log(req.body);
    Student.findOne({
      email: req.body.email,
    })
      .populate("role", "-__v")
      .exec((err, student) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!student) {
          return res.status(404).send({ message: "Email Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          student.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({ message: "Invalid Password!" });
        }

        const token = jwt.sign({ id: student.id }, process.env.secret, {
          expiresIn: 86400, // 24 hours
        });
        //req.session.token = token;
        // console.log(req.session.token);
        const authorities = [];

        // for (let i = 0; i < teacher.role.length; i++) {
        //   authorities.push("ROLE_" + teacher.role[i].name.toUpperCase());
        // }

        res.status(200).send({
          id: student._id,
          email: student.email,
          // roles: authorities,
          token: token,
        });
      });
  }

  static async loginParent(req, res, next) {
    console.log(req.body);
    Parent.findOne({
      email: req.body.email,
    })
      .populate("role", "-__v")
      .exec((err, parent) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (!parent) {
          return res.status(404).send({ message: "Email Not found." });
        }

        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          parent.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({ message: "Invalid Password!" });
        }

        const token = jwt.sign({ id: parent.id }, process.env.secret, {
          expiresIn: 86400, // 24 hours
        });
        //req.session.token = token;
        // console.log(req.session.token);
        const authorities = [];

        // for (let i = 0; i < teacher.role.length; i++) {
        //   authorities.push("ROLE_" + teacher.role[i].name.toUpperCase());
        // }

        res.status(200).send({
          id: parent._id,
          email: parent.email,
          // roles: authorities,
          token: token,
        });
      });
  }
  static async logout(req, res, next) {
    try {
      req.session = null;
      return res.status(200).send({ message: "You've been signed out!" });
    } catch (err) {
      this.next(err);
    }
  }

  static async resetPassword(req, res) {
    if (!req.body.email) {
      return res.status(500).json({ message: "Email is required" });
    }
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(409).json({ message: "Email does not exist" });
    }
    var resettoken = new passwordResetToken({
      _userId: user._id,
      resettoken: crypto.randomBytes(16).toString("hex"),
    });
    resettoken.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      passwordResetToken
        .find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } })
        .remove()
        .exec();
      res.status(200).json({ message: "Reset Password successfully." });
      var transporter = nodemailer.createTransport({
        service: "Gmail",
        port: 465,
        auth: {
          user: "user",
          pass: "password",
        },
      });
      var mailOptions = {
        to: user.email,
        from: "your email",
        subject: "Node.js Password Reset",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          "http://localhost:4200/response-reset-password/" +
          resettoken.resettoken +
          "\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };
      transporter.sendMail(mailOptions, (err, info) => {});
    });
  }

  static async validPasswordToken(req, res) {
    if (!req.body.resettoken) {
      return res.status(500).json({ message: "Token is required" });
    }
    const user = await passwordResetToken.findOne({
      resettoken: req.body.resettoken,
    });
    if (!user) {
      return res.status(409).json({ message: "Invalid URL" });
    }
    User.findOneAndUpdate({ _id: user._userId })
      .then(() => {
        res.status(200).json({ message: "Token verified successfully." });
      })
      .catch((err) => {
        return res.status(500).send({ msg: err.message });
      });
  }

  static async newPassword(req, res) {
    passwordResetToken.findOne(
      { resettoken: req.body.resettoken },
      function (err, userToken, next) {
        if (!userToken) {
          return res.status(409).json({ message: "Token has expired" });
        }

        User.findOne(
          {
            _id: userToken._userId,
          },
          function (err, userEmail, next) {
            if (!userEmail) {
              return res.status(409).json({ message: "User does not exist" });
            }
            return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
              if (err) {
                return res
                  .status(400)
                  .json({ message: "Error hashing password" });
              }
              userEmail.password = hash;
              userEmail.save(function (err) {
                if (err) {
                  return res
                    .status(400)
                    .json({ message: "Password can not reset." });
                } else {
                  userToken.remove();
                  return res
                    .status(201)
                    .json({ message: "Password reset successfully" });
                }
              });
            });
          }
        );
      }
    );
  }
}

module.exports = AuthController;
