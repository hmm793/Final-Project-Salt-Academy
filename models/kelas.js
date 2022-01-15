const mongoose = require("mongoose");

const classSchema = mongoose.Schema({
  class_name: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  subject: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  ],
});

const classModel = mongoose.model("Class", classSchema);
module.exports = classModel;
