const subjectModel = require("../models/subject");
const TeacherModel = require("../models/teacher");
class SubjectController {
  // Only By Headmaster
  static async createNewSubject(req, res, next) {
    const { subject_name, teacher_id, duration, link } = req.body;

    try {
      const result = await subjectModel.create({
        subject_name,
        teacher_id,
        duration,
        link,
      });
      await TeacherModel.findByIdAndUpdate(teacher_id, {
        $push: { Subject: result._id },
      });
      if (!result) {
        return res
          .status(404)
          .send({ message: "The subject cannot be created" });
      }
      res.status(200).send({ message: "Create Subject Success" });
    } catch (error) {
      next(error);
    }
  }

  // Only By Headmaster
  static async editSubject(req, res, next) {
    const { id } = req.params;
    const { subject_name, teacher_id, duration, link } = req.body;

    const result = await subjectModel.findByIdAndUpdate(
      id,
      { subject_name, teacher_id, duration, link },
      { new: true }
    );

    if (!result) {
      return res.status(404).send({ message: "The subject cannot be updated" });
    }
    res.status(200).send({ message: "The subject has been updated" });
  }

  // Teacher, ??
  // Student Dan Parent !
  static async getAllSubject(req, res, next) {
    const subjectList = await subjectModel.find().populate({
      path: "teacher_id",
      select: ["first_name", "last_name", "email", "phone", "short_bio"],
    });
    if (!subjectList) {
      res.status(5000).json({ success: false });
    }
    res.send(subjectList);
  }

  // Teacher, ??
  // Student Dan Parent !
  static async getSubjectByID(req, res, next) {
    const { id } = req.params;
    console.log("SUBECJA  : ", id);

    const subject = await subjectModel.findById(id).populate({
      path: "teacher_id",
      select: ["first_name", "last_name", "email", "phone", "short_bio"],
    });

    if (!subject) {
      return res.status(500).json({ success: false });
    }
    res.send(subject);
  }

  // Only By Headmaster
  static async deleteSubject(req, res, next) {
    const { id } = req.params;
    try {
      const result = await subjectModel.findByIdAndDelete(id);
      if (!result) {
        return res
          .status(404)
          .send({ message: "The subject cannot be deleted" });
      }
      res.send({ message: "The subject has been deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SubjectController;
