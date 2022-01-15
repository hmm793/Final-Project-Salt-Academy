const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
  subject_name: {
    type: String,
    required: true,
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
    default: "",
  },
  duration: {
    type: String,
    required: true,
  },
});

subjectSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
subjectSchema.set("toJSON", {
  virtuals: true,
});

const subjectModel = mongoose.model("Subject", scheduleSchema);
module.exports = subjectModel;
