const express = require("express");
const app = express();
const mainRoute = require("./routes/main");
var cors = require("cors");
const morgan = require("morgan");

const errorHandler = require("./helper/error-handler");
// Connect To DB
require("./database/connectDB");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.use(cors());
app.use(morgan("tiny"));
app.use("/api", mainRoute);
app.use(errorHandler);

// Handle Unspecific Route
app.get("/", (req, res) => {
  res.send("<h3>404</h3>");
});

module.exports = app;
