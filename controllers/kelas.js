const classModel = require("../models/kelas");

class ClassController {
  static async createNewClass(req, res, next) {
    const { class_name, teacher, subject } = req.body;
    try {
      const result = await classModel.create({ class_name, teacher, subject });
      if (!result) {
        return res.status(404).send("the class cannot be created");
      }
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
  static async editClass(req, res, next) {
    const { id } = req.params;
    const { class_name, teacher, subject } = req.body;
    try {
      const result = await classModel.findByIdAndUpdate(id, {
        class_name,
        teacher,
        subject,
      });
      if (!result) {
        return res.status(404).send("the class cannot be updated");
      }
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
  static async getAllClass(req, res, next) {
    try {
      const result = await classModel
        .find()
        .populate({
          path: "subject",
          populate: {
            path: "teacher_id",
            select: ["first_name", "last_name", "email", "phone", "short_bio"],
          },
        })
        .populate({
          path: "teacher",
          select: ["first_name", "last_name", "email", "phone", "short_bio"],
        });
      if (!result) {
        return res.status(404).send("the class cannot be showed");
      }
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
  static async getClassByID(req, res, next) {
    const { id } = req.params;
    try {
      const result = await classModel
        .findById(id)
        .populate({
          path: "subject",
          populate: {
            path: "teacher_id",
            select: ["first_name", "last_name", "email", "phone", "short_bio"],
          },
        })
        .populate({
          path: "teacher",
          select: ["first_name", "last_name", "email", "phone", "short_bio"],
        });
      if (!result) {
        return res.status(404).send("the class cannot be showed");
      }
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ClassController;
