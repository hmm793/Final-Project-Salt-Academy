const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const TeacherModel = require("../models/teacher");
class TeacherController {
  static async createNewTeacher(req, res, next) {
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
      blood_group,
      religion,
      addmission_date,
      email,
      address,
      phone,
      short_bio,
      role,
    } = req.body;

    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    try {
      const user_password = randomPassword();

      const result = await TeacherModel.create({
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
        short_bio,
        role,
        password: bcrypt.hashSync(user_password, 10),
        image: `${basePath}${fileName}`,
      });

      if (!result) {
        return res.status(404).send("the teacher cannot be created");
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
        <li>Blood Group: ${blood_group}</li>
        <li>Religion: ${religion}</li>
        <li>Email: ${email}</li>
        <li>Addmission Date: ${addmission_date}</li>
        <li>Address: ${address}</li>
        <li>Phone: ${phone}</li>
        <li>Short Bio: ${short_bio}</li>
        <li>Image: ${basePath}${fileName}</li>
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
  static async updateTeacher(req, res, next) {
    const userExist = await TeacherModel.findById(req.params.id);
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
      short_bio,
      password,
    } = req.body;

    let newPassword;
    if (password) {
      newPassword = bcrypt.hashSync(password, 10);
    } else {
      newPassword = userExist.password;
    }

    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const user = await TeacherModel.findByIdAndUpdate(
      req.params.id,
      {
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
        short_bio,
        password: newPassword,
        image: `${basePath}${fileName}`,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("the teacher data cannot be updated");
    }
    res.send(user);
  }
  static async getAllTeacher(req, res, next) {
    const teacherList = await TeacherModel.find();
    if (!teacherList) {
      return res.status(500).json({ success: false });
    }
    res.send(teacherList);
  }
  static async teacherCount(req, res, next) {
    const totalTeacher = await TeacherModel.countDocuments();
    if (!totalTeacher) {
      return res.status(500).json({ success: false });
    }
    res.send({ totalTeacher });
  }
  static async getTeacherByID(req, res, next) {
    const { id } = req.params;
    const teacher = await TeacherModel.findById(id);
    if (!teacher) {
      return res.status(500).json({ success: false });
    }
    res.send(teacher);
  }
}

module.exports = TeacherController;
