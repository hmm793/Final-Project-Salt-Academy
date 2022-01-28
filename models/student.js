const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  father_name: { type: String },
  mother_name: { type: String },
  date_of_birth: { type: Date },
  father_occupation: { type: String },
  blood_group: {
    type: String,
    enum: ["A-", "A+", "B+", "B-", "O+", "O-", "AB-", "AB+"],
  },
  religion: {
    type: String,
    enum: ["Islam", "Hindu", "Christian", "Buddish", "Others"],
  },
  email: { type: String },
  year_academic: {
    type: String,
  },
  addmission_date: { type: Date },
  kelas: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  address: { type: String },
  phone: { type: String },
  password: { type: String },
  short_bio: { type: String },
  image: { type: String, default: "" },
  role: {
    type: String,
    enum: ["student", "headmaster", "teacher", "parent"],
  },
  status: {
    type: String,
    enum: ["active", "non-active"],
    default: "active",
  },
  subject: [
    {
      subject_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
      score_subject: {
        type: String,
        default: "",
      },
    },
  ],
  totalScore: {
    type: String,
  },
});

studentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

studentSchema.set("toJSON", {
  virtuals: true,
});

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;
