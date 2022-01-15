const mongoose = require("mongoose");

const parentSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    required: true,
  },
  date_of_birth: { type: Date, required: true },
  occupation: { type: String },
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
  address: { type: String },
  phone: { type: String },
  password: { type: String },
  image: { type: String, default: "" },
  role:[
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
  child: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      default: [],
    },
  ],
  resetLink:{type: String}
});

parentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

parentSchema.set("toJSON", {
  virtuals: true,
});

const ParentModel = mongoose.model("Parent", parentSchema);
module.exports = ParentModel;
