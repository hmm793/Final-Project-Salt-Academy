const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Headmaster = db.headmaster;
const Parent = db.parent;
const Student = db.student;
const Teacher = db.teacher;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.headmasterId = decoded.id;
    req.parentId = decoded.id;
    req.studentId = decoded.id;
    req.teacherId = decoded.id;
    next();
  });
};

isHeadmaster = (req, res, next) => {
  Headmaster.findById(req.headmasterId).exec((err, headmaster) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: headmaster.role }
      },
      (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < role.length; i++) {
          if (role[i].name === "headmaster") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Headmaster Role!" });
        return;
      }
    );
  });
};

isParent = (req, res, next) => {
  Parent.findById(req.parentId).exec((err, parent) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: parent.role }
      },
      (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < role.length; i++) {
          if (role[i].name === "parent") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Parent Role!" });
        return;
      }
    );
  });
};

isStudent = (req, res, next) => {
  Student.findById(req.studentId).exec((err, student) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: student.role }
      },
      (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < role.length; i++) {
          if (role[i].name === "student") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Student Role!" });
        return;
      }
    );
  });
};

isTeacher = (req, res, next) => {
  Teacher.findById(req.teacherId).exec((err, teacher) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: teacher.role }
      },
      (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < role.length; i++) {
          if (role[i].name === "teacher") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Teacher Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isHeadmaster,
  isParent,
  isStudent,
  isTeacher
};

module.exports = authJwt;