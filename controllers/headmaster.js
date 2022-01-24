const bcrypt = require("bcrypt");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const jwt = require("jsonwebtoken");
const HeadmasterModel = require("../models/headmaster");
class HeadmasterController {
  static async createNewHeadmaster(req, res, next) {
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      blood_group,
      religion,
      addmission_date,
      email,
      address,
      phone,
      password,
      short_bio,
      role,
    } = req.body;

    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    try {
      const result = await HeadmasterModel.create({
        first_name,
        last_name,
        gender,
        date_of_birth,
        blood_group,
        religion,
        addmission_date,
        email,
        address,
        phone,
        password,
        short_bio,
        role,
        password: bcrypt.hashSync(password, 10),
        image: `${basePath}${fileName}`,
      });

      if (!result) {
        return res.status(404).send("the Headmaster cannot be created");
      }

      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  // Only By Headmaster
  static async headmasterLogin(req, res, next) {
    console.log("YES");
    try {
      const user = await HeadmasterModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send({ message: "The user not found" });
      }
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );
        res.status(200).send({ user: user.email, token });
      } else {
        res.status(400).send({ message: "password is wrong!" });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = HeadmasterController;
