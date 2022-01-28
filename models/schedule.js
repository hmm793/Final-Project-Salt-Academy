const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
  kelas: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  title: {
    type: String,
  },
  daysOfWeek: {
    type: Array,
  },
  start: {
    type: Date,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  end: {
    type: Date,
  },
  color: {
    type: String,
    default: "3238a8",
  },
  allDay: {
    type: Boolean,
    required: true,
  },
});
scheduleSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
scheduleSchema.set("toJSON", {
  virtuals: true,
});
const scheduleModel = mongoose.model("Schedule", scheduleSchema);
module.exports = scheduleModel;
