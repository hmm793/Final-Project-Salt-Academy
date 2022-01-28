const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema({
  subject_name: {
    type: String,
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  duration: {
    type: String,
  },
  link: {
    type: String,
  },
});

subjectSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
subjectSchema.set("toJSON", {
  virtuals: true,
});

const subjectModel = mongoose.model("Subject", subjectSchema);
module.exports = subjectModel;
