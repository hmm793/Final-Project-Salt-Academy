const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const ParentModel = require("../models/parent");
class ParentController {
  static async createNewParent(req, res, next) {
    // Random Password Handler
    const randomPassword = () => {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 5; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    };

    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      occupation,
      blood_group,
      religion,
      email,
      address,
      phone,
      role,
      child,
    } = req.body;

    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    try {
      const user_password = randomPassword();

      const result = await ParentModel.create({
        first_name,
        last_name,
        gender,
        date_of_birth,
        occupation,
        blood_group,
        religion,
        email,
        address,
        phone,
        role,
        child,
        password: bcrypt.hashSync(user_password, 10),
        image: `${basePath}${fileName}`,
      });

      if (!result) {
        return res.status(404).send("the parent cannot be created");
      }

      const output = `
      <p>Your account has been created by the admin</p>
      <h3>Account Details</h3>
      <ul>
        <li>Name: ${first_name} ${last_name}</li>
        <li>Password: ${user_password}</li>
        <li>Role: ${role}</li>
        <li>Gender: ${gender}</li>
        <li>Date of Birth: ${date_of_birth}</li>
        <li>Occupation: ${occupation}</li>
        <li>Blood Group: ${blood_group}</li>
        <li>Religion: ${religion}</li>
        <li>Email: ${email}</li>
        <li>Address: ${address}</li>
        <li>Phone: ${phone}</li>
        <li>Image: ${basePath}${fileName}</li>
        <li>Child: ${child}</li>
        <li>Status: Active</li>
      </ul>
      `;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "luarbiasaandika@gmail.com",
          pass: "IndraMambuju1",
        },
      });

      transporter.sendMail(
        {
          from: '"Headmaster 👻" <luarbiasaandika@gmail.com>',
          to: `${email}`,
          subject: "Your Account Information✔",
          text: "Hello world?",
          html: output,
        },
        (err, info) => {
          if (err) {
            console.log(err);
          }
          console.log("Message sent: %s", info.messageId);
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
      );

      res.send(result);
    } catch (error) {
      next(error);
    }
  }
  //   Buat Parent
  static async editByParent(req, res, next) {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      occupation,
      blood_group,
      religion,
      email,
      address,
      phone,
      role,
      password,
    } = req.body;

    const userExist = await ParentModel.findById(id);

    let newPassword;
    if (password) {
      newPassword = bcrypt.hashSync(password, 10);
    } else {
      newPassword = userExist.password;
    }

    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const user = await ParentModel.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        gender,
        date_of_birth,
        occupation,
        blood_group,
        religion,
        email,
        address,
        phone,
        role,

        password: newPassword,
        image: `${basePath}${fileName}`,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("the parent data cannot be updated");
    }
    res.send(user);
  }

  //   Buat HeadMaster
  static async editByHeadmaster(req, res, next) {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      occupation,
      blood_group,
      religion,
      email,
      address,
      phone,
      role,
      status,
      child,
    } = req.body;

    console.log(req.body);

    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const user = await ParentModel.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        gender,
        date_of_birth,
        occupation,
        blood_group,
        religion,
        email,
        address,
        phone,
        role,
        image: `${basePath}${fileName}`,
        status,
        child,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("the parent data cannot be updated");
    }
    res.send(user);
  }

  static async getAllParentData(req, res, next) {
    const parentList = await ParentModel.find().populate({
      path: "child",
      populate: {
        path: "kelas",
        populate: [
          {
            path: "teacher",
            select: ["first_name", "last_name", "email", "phone", "short_bio"],
          },
          {
            path: "subject",
            populate: {
              path: "teacher_id",
              select: [
                "first_name",
                "last_name",
                "email",
                "phone",
                "short_bio",
              ],
            },
          },
        ],
      },
    });
    if (!parentList) {
      return res.status(500).json({ success: false });
    }
    res.send(parentList);
  }

  static async getParentByID(req, res, next) {
    const { id } = req.params;

    const parent = await ParentModel.findById(id).populate({
      path: "child",
      populate: {
        path: "kelas",
        populate: [
          {
            path: "teacher",
            select: ["first_name", "last_name", "email", "phone", "short_bio"],
          },
          {
            path: "subject",
            populate: {
              path: "teacher_id",
              select: [
                "first_name",
                "last_name",
                "email",
                "phone",
                "short_bio",
              ],
            },
          },
        ],
      },
    });
    if (!parent) {
      return res.status(500).json({ success: false });
    }
    res.send(parent);
  }
}

module.exports = ParentController;
