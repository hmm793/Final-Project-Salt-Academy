const mongoose = require("mongoose");
require("dotenv").config();
console.log(process.env.CONNECT_DB);
module.exports = mongoose
  .connect(process.env.CONNECT_DB)
  .then(() => console.log("Database connected successfully"))
  .catch(() => {
    console.log("Database is not connected");
  });
