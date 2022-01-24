require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "";
const StudentModel = require("../models/student");
const HeadmasterModel = require("../models/headmaster");
const ParentModel = require("../models/parent");
const TeacherModel = require("../models/teacher");

class AuthJWT {
  static authentication(req, res, next) {
    if (!req.headers.authorization) {
      throw { name: "Missing_Token" };
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.decoded = decoded;
    next();
  }
  static async authStudent(req, res, next) {
    const { id } = req.params;
    const temp_decoded = req.decoded;
    try {
      const hasil = await StudentModel.findById(temp_decoded.id);
      const hasil_akhir = hasil._id.toString();
      if (hasil_akhir === id && temp_decoded.role == "student") {
        next();
      } else {
        throw { name: "UNAUTHORIZED" };
      }
    } catch (error) {
      next(error);
    }
  }
  static async authParentAndHeadmaster(req, res, next) {
    const { id } = req.params; // Bisa id parent, ...
    const temp_decoded = req.decoded;
    let hasil_akhir;
    try {
      const hasil = await ParentModel.findById(temp_decoded.id);
      if (hasil) {
        hasil_akhir = hasil._id.toString();
      }

      if (hasil_akhir === id || temp_decoded.role == "headmaster") {
        next();
      } else {
        throw { name: "UNAUTHORIZED" };
      }
    } catch (error) {
      next(error);
    }
  }
  static async authParentAndStudentAndHeadmaster(req, res, next) {
    const { id } = req.params;
    const temp_decoded = req.decoded;
    let studentDataId1;
    let studentDataId2;
    try {
      const role = temp_decoded.role;
      if (role == "student") {
        const studentData = await StudentModel.findById(temp_decoded.id);
        studentDataId1 = studentData._id.toString();
      } else if (role == "parent") {
        const parentData = await ParentModel.findById(temp_decoded.id);
        const childArr = parentData.child;
        childArr.forEach((element) => {
          if (element.toString() == id) {
            studentDataId2 = element.toString();
          }
        });
      }

      if (
        (studentDataId1 === id && temp_decoded.role == "student") ||
        (studentDataId2 === id && temp_decoded.role == "parent")
      ) {
        next();
      } else if (temp_decoded.role == "headmaster") {
        next();
      } else {
        throw { name: "UNAUTHORIZED" };
      }
    } catch (error) {
      next(error);
    }
  }
  static async authHeadmaster(req, res, next) {
    const temp_decoded = req.decoded;
    try {
      const hasil = await HeadmasterModel.findById(temp_decoded.id);
      if (hasil && temp_decoded.role == "headmaster") {
        next();
      } else {
        throw { name: "UNAUTHORIZED" };
      }
    } catch (error) {
      next(error);
    }
  }
  static async authTeacher(req, res, next) {
    const { id } = req.params; // bisa id teacher bisa id dari subject
    const temp_decoded = req.decoded;
    try {
      const dataTeacher = await TeacherModel.findById(temp_decoded.id);
      // Case 1 (id = id Subject)
      const dataSubject = dataTeacher.Subject;
      let subjectIsPartOfTeacher = false;
      dataSubject.forEach((el) => {
        if (el.toString() == id) {
          subjectIsPartOfTeacher = true;
        }
      });

      // Case 2 (id = idTeacher)

      // Untuk Case 1
      if (dataTeacher && subjectIsPartOfTeacher) {
        console.log("next11");
        next();
      }
      // Untuk Case 2
      else if (temp_decoded.id == id) {
        console.log("next22");
        next();
      } else {
        throw { name: "UNAUTHORIZED" };
      }
    } catch (error) {
      next(error);
    }
  }
  static async authTeacherAndHeadmaster(req, res, next) {
    const { id } = req.params;
    const temp_decoded = req.decoded;

    try {
      if (temp_decoded.role == "teacher") {
        const dataTeacher = await TeacherModel.findById(temp_decoded.id);

        // Case 1 (id = id Subject)
        const dataSubject = dataTeacher.Subject;
        let subjectIsPartOfTeacher = false;
        dataSubject.forEach((el) => {
          if (el.toString() == id) {
            subjectIsPartOfTeacher = true;
          }
        });

        //  (id =id Class)
        const dataClass = dataTeacher.kelas;
        if (dataTeacher && dataClass.toString() == id) {
          next();
        } // id  = idSubject
        else if (dataTeacher && subjectIsPartOfTeacher) {
          console.log("next11");
          next();
        } else {
          console.log("UNAUTHORIZED");
          throw { name: "UNAUTHORIZED" };
        }
      } else if (temp_decoded.role == "headmaster") {
        console.log("next3");
        next();
      } else {
        throw { name: "UNAUTHORIZED" };
      }
    } catch (error) {
      next(error);
    }
  }
  static async authTeacherAndHeadmasterForGetAllSubject(req, res, next) {
    const temp_decoded = req.decoded;
    try {
      const hasil1 = await HeadmasterModel.findById(temp_decoded.id);
      const hasil2 = await TeacherModel.findById(temp_decoded.id);
      if (
        (hasil1 && temp_decoded.role == "headmaster") ||
        (hasil2 && temp_decoded.role == "teacher")
      ) {
        next();
      } else {
        throw { name: "UNAUTHORIZED" };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthJWT;
