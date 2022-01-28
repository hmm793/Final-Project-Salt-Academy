const mongoose = require("mongoose");

const parentSchema = mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
  },
  date_of_birth: { type: Date },
  occupation: { type: String },
  blood_group: {
    type: String,
    enum: ["A-", "A+", "B+", "B-", "O+", "O-", "AB-", "AB+"],
  },
  religion: {
    type: String,
    enum: ["Islam", "Hindu", "Christian", "Buddish", "Others"],
  },
  email: { type: String },
  address: { type: String },
  phone: { type: String },
  password: { type: String },
  image: { type: String, default: "" },
  role: {
    type: String,
    enum: ["student", "headmaster", "teacher", "parent"],
  },
  status: {
    type: String,
    enum: ["active", "non-active", "teacher", "parent"],
    default: "active",
  },
  child: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: [],
    },
  ],
});

parentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

parentSchema.set("toJSON", {
  virtuals: true,
});

const ParentModel = mongoose.model("Parent", parentSchema);
module.exports = ParentModel;
