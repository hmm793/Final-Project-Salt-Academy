const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.headmaster = require("./headmaster");
db.parent = require("./parent");
db.student = require("./student");
db.teacher = require("./teacher");
db.role = require("./role");

db.ROLES = ["headmaster", "parent", "student", "teacher"];

module.exports = db;