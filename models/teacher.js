const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  date_of_birth: { type: Date },
  blood_group: {
    type: String,
    enum: ["A-", "A+", "B+", "B-", "O+", "O-", "AB-", "AB+"],
  },
  religion: {
    type: String,
    enum: ["Islam", "Hindu", "Christian", "Buddish", "Others"],
  },
  addmission_date: { type: Date },
  email: { type: String },
  address: { type: String },
  phone: { type: String },
  password: { type: String },
  short_bio: { type: String },
  image: { type: String, default: "" },
  role: {
    type: String,
    enum: ["student", "headmaster", "teacher", "parent"],
  },
  // Kelas yang di walikan
  kelas: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  // mapel yang diajar
  Subject: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
});

teacherSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
teacherSchema.set("toJSON", {
  virtuals: true,
});
const TeacherModel = mongoose.model("Teacher", teacherSchema);
module.exports = TeacherModel;
