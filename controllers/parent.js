const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const ParentModel = require("../models/parent");
const StudentModel = require("../models/student");
class ParentController {
  // Only By Headmaster
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
      child,
    } = req.body;

    // Validasi Email
    const userExist2 = await ParentModel.find();
    const isEmailAlreadyExist = userExist2.filter((el) => {
      if (el.email == email) {
        return true;
      }
    });

    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    try {
      if (isEmailAlreadyExist.length !== 0) {
        res
          .status(400)
          .json({ message: "Email Sudah Ada, Gunakan Email Lain" });
      } else {
        let arrId = [];
        JSON.parse(req.body.child).forEach(async (element) => {
          const fullName = element.split(" ");
          const first_name = fullName[0];
          const last_name = fullName[1];
          const idChild = (
            await StudentModel.findOne({
              $and: [
                {
                  first_name: first_name,
                },
                { last_name: last_name },
              ],
            })
          )._id;

          arrId.push(idChild);
        });

        setTimeout(async () => {
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
            role: "parent",
            child: arrId,
            password: bcrypt.hashSync(user_password, 10),
            image: `${basePath}${fileName}`,
          });

          if (!result) {
            return res
              .status(404)
              .send({ message: "the parent cannot be created" });
          }

          const output = `
        <p>Your account has been created by the admin</p>
        <h3>Account Details</h3>
        <ul>
          <li>Name: ${first_name} ${last_name}</li>
          <li>Password: ${user_password}</li>
          <li>Role: Parent</li>
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
              pass: "IndraMambuju2",
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
              console.log(
                "Preview URL: %s",
                nodemailer.getTestMessageUrl(info)
              );
            }
          );

          res.status(200).send({ message: "Berhasil Buat Data Parent" });
        }, 500);
      }
    } catch (error) {
      next(error);
    }
  }

  // Only By Parent
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
    } = req.body;

    // Validasi Email
    const userExist = await ParentModel.findById(id);
    const oldEmail = userExist.email;
    const newEmail = email;

    const userExist2 = await ParentModel.find();
    const isEmailAlreadyExist = userExist2.filter((el) => {
      if (el.email == email) {
        return true;
      }
    });
    if (oldEmail !== newEmail && isEmailAlreadyExist.length !== 0) {
      res.status(200).json({ message: "Email Sudah Ada, Gunakan Email Lain" });
    } else {
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
        },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .send({ message: "the parent data cannot be updated" });
      }
      res.status(200).json({ message: "Berhasil Ubah Data" });
    }
  }

  // Only By Parent
  static async editParentImageByParent(req, res, next) {
    const { id } = req.params;
    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const user = await ParentModel.findByIdAndUpdate(
      id,
      {
        image: `${basePath}${fileName}`,
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .send({ message: "the parent image cannot be updated" });
    }
    res.status(200).json({ message: "Berhasil Ubah Gambar" });
  }

  // Only By HeadMaster
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
      status,
      child,
    } = req.body;

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
        status,
        child,
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .send({ message: "the parent data cannot be updated" });
    }
    res.send(user);
  }

  // Only By HeadMaster
  static async editParentImageByHeadMaster(req, res, next) {
    const { id } = req.params;
    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const user = await ParentModel.findByIdAndUpdate(
      id,
      {
        image: `${basePath}${fileName}`,
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .send({ message: "the parent image cannot be updated" });
    }
    res.send(user);
  }

  // Only By Headmaster
  static async editStatus(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;
    const user = await ParentModel.findByIdAndUpdate(
      id,
      {
        status,
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .send({ message: "the parent status cannot be updated" });
    }
    res.send(user);
  }

  // Only By Headmaster
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
      return res
        .status(500)
        .json({ message: "the parent data cannot be showed" });
    }
    res.send(parentList);
  }

  // Parent ??
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
      return res.status(500).json({ message: "Invalid Id" });
    }
    res.send(parent);
  }

  // Only By Headmaster
  static async parentCount(req, res, next) {
    const totalParent = await ParentModel.countDocuments();
    if (!totalParent) {
      return res
        .status(500)
        .json({ message: "the parent total cannot be counted" });
    }
    res.send({ totalParent });
  }

  // Only By Parent
  static async parentLogin(req, res, next) {
    try {
      const user = await ParentModel.findOne({ email: req.body.email });

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

  static async resetPassword(req, res, next) {
    const { email } = req.body;
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

    try {
      const user_password = randomPassword();
      const result = await ParentModel.findOneAndUpdate(
        { email },
        {
          password: bcrypt.hashSync(user_password, 10),
        }
      );

      if (!result) {
        return res
          .status(404)
          .send({ message: "the parent cannot be created" });
      }

      const output = `
      <p>Your password has been reset</p>
      <ul>
      <li>Email: ${email}</li> 
      <li>Password: ${user_password}</li>
      </ul>
      `;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "luarbiasaandika@gmail.com",
          pass: "IndraMambuju2",
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

      res
        .status(200)
        .send({ message: "New password has been sent to your email" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ParentController;
