function errorHandler(err, req, res, next) {
  console.log("MASUK : ", err.name);
  if (err.name === "UNAUTHORIZED") {
    // jwt authentication error
    return res.status(401).json({ message: "The user is not authorized" });
  }

  if (err.name === "Missing_Token") {
    // jwt authentication error
    return res.status(401).json({ message: "You Have To Loggin First" });
  }

  if (err.name === "ValidationError") {
    //  validation error
    return res.status(401).json({ message: err });
  }

  // default to 500 server error
  return res.status(500).json(err);
}

module.exports = errorHandler;
