const mongoose = require("mongoose");

const roleSchema = mongoose.model("Role",   
new mongoose.Schema({
    name: String
})
);

module.exports = roleSchema;