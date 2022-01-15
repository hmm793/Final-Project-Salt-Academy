const bcrypt = require("bcrypt");

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
}

module.exports = HeadmasterController;
