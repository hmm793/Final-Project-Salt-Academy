const mongoose = require("mongoose");

const headmasterSchema = mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    required: true,
  },
  date_of_birth: { type: Date, required: true },
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
  period: {
    type: String,
  },
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
});

headmasterSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
headmasterSchema.set("toJSON", {
  virtuals: true,
});
const headmasterModel = mongoose.model("Headmaster", headmasterSchema);
module.exports = headmasterModel;
