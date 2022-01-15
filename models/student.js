const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    required: true,
  },
  father_name: { type: String },
  mother_name: { type: String },
  date_of_birth: { type: Date, required: true },
  father_occupation: { type: String },
  roll: { type: String, unique: true },
  blood_group: {
    type: String,
    enum: ["A-", "B+", "B-", "O+", "O-"],
    required: true,
  },
  religion: {
    type: String,
    enum: ["Islam", "Hindu", "Christian", "Buddhist", "Others"],
    required: true,
  },
  email: { type: String, unique: true },
  addmission_date: { type: Date },
  kelas: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  section: { type: String, required: true },
  addmission_id: { type: String },
  address: { type: String },
  phone: { type: String },
  password: { type: String },
  short_bio: { type: String },
  image: { type: String, default: "" },
  role: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
  status: {
    type: String,
    enum: ["active", "non-active", "teacher", "parent"],
    default: "active",
  },
  resetLink:{type: String}
});

studentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

studentSchema.set("toJSON", {
  virtuals: true,
});

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;
