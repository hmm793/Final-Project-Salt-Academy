const subjectModel = require("../models/subject");

class SubjectController {
  static async createNewSubject(req, res, next) {
    const { subject_name, teacher_id, duration } = req.body;
    try {
      const result = await subjectModel.create({
        subject_name,
        teacher_id,
        duration,
      });
      if (!result) {
        return res.status(404).send("the subject cannot be created");
      }
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
  static async editSubject(req, res, next) {
    const { id } = req.params;
    const { subject_name, teacher_id, duration } = req.body;

    const result = await subjectModel.findByIdAndUpdate(
      id,
      { subject_name, teacher_id, duration },
      { new: true }
    );

    if (!result) {
      return res.status(404).send("The subject cannot be updated");
    }
    res.send(result);
  }
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

  static async getSubjectByID(req, res, next) {
    const { id } = req.params;
    const subject = await subjectModel.findById(id).populate({
      path: "teacher_id",
      select: ["first_name", "last_name", "email", "phone", "short_bio"],
    });
    if (!subject) {
      return res.status(500).json({ success: false });
    }
    res.send(subject);
  }
}

module.exports = SubjectController;
