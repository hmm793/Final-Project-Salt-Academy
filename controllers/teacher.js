const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const TeacherModel = require("../models/teacher");
const StudentModel = require("../models/student");
class TeacherController {
  // Only By Headmaster
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
      gender, //
      date_of_birth,
      blood_group,
      religion,
      addmission_date,
      email,
      address,
      phone,
      short_bio,
    } = req.body;

    // Validasi Email
    const userExist2 = await TeacherModel.find();
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
          .status(404)
          .json({ message: "Email Sudah Ada, Gunakan Email Lain" });
      } else {
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
          role: "teacher",
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
        <li>Role: Teacher</li>
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

        res.status(200).send({ message: "Berhasil Buat Data Guru" });
      }
    } catch (error) {
      next(error);
    }
  }

  // Only By Teacher
  static async updateTeacherByTeacher(req, res, next) {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      blood_group,
      religion,
      email,
      address,
      phone,
      short_bio,
    } = req.body;

    // Validasi Email
    const userExist = await TeacherModel.findById(id);
    const oldEmail = userExist.email;
    const newEmail = email;

    const userExist2 = await TeacherModel.find();
    const isEmailAlreadyExist = userExist2.filter((el) => {
      if (el.email == email) {
        return true;
      }
    });
    if (oldEmail !== newEmail && isEmailAlreadyExist.length !== 0) {
      res.status(200).json({ message: "Email Sudah Ada, Gunakan Email Lain" });
    } else {
      const user = await TeacherModel.findByIdAndUpdate(
        id,
        {
          first_name,
          last_name,
          gender,
          date_of_birth,
          blood_group,
          religion,
          email,
          address,
          phone,
          short_bio,
        },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .send({ message: "the teacher data cannot be updated" });
      }
      res.status(200).json({ message: "Berhasil Ubah Data" });
    }
  }
  // Only By Teacher
  static async editTeacherImageByTeacher(req, res, next) {
    const { id } = req.params;
    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const user = await TeacherModel.findByIdAndUpdate(
      id,
      {
        image: `${basePath}${fileName}`,
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .send({ message: "the teacher image cannot be updated" });
    }
    res.status(200).json({ message: "Berhasil Ubah Gambar" });
  }

  // Only By Headmaster
  static async updateTeacherByHeadmaster(req, res, next) {
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
    } = req.body;

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

  // Only By Headmaster
  static async editTeacherImageByHeadmaster(req, res, next) {
    const { id } = req.params;
    console.log("id : ", req.params);
    console.log("filename", req.file);
    // Image Handler
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const user = await TeacherModel.findByIdAndUpdate(
      id,
      {
        image: `${basePath}${fileName}`,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("the teacher image cannot be updated");
    }
    res.send(user);
  }

  // Only By Headmaster
  static async getAllTeacher(req, res, next) {
    const teacherList = await TeacherModel.find()
      .populate("kelas")
      .populate("Subject");
    if (!teacherList) {
      return res.status(500).json({ success: false });
    }
    res.send(teacherList);
  }

  // Only By Headmaster
  static async teacherCount(req, res, next) {
    const totalTeacher = await TeacherModel.countDocuments();
    if (!totalTeacher) {
      return res.status(500).json({ success: false });
    }
    res.send({ totalTeacher });
  }

  // By Headmaster and Teacher
  static async getTeacherByID(req, res, next) {
    const { id } = req.params;
    const teacher = await TeacherModel.findById(id)
      .populate("kelas")
      .populate("Subject");
    if (!teacher) {
      return res.status(500).json({ success: false });
    }
    res.send(teacher);
  }

  // Only By Teacher
  static async setScoreBySubjectID(req, res, next) {
    const { id } = req.params;
    console.log(req.params);
    console.log(req.body);
    let isSuccess = true;
    req.body.forEach(async (el) => {
      const hasil = await StudentModel.findOneAndUpdate(
        {
          _id: el.id,
          "subject.subject_name": id,
        },
        { $set: { "subject.$.score_subject": el.nilai } }
      );
      if (!hasil) {
        isSuccess = false;
      }
    });

    const allStudent = await StudentModel.find().populate({
      path: "kelas",
      populate: [
        {
          path: "subject",
          populate: {
            path: "teacher_id",
            select: ["first_name", "last_name", "email", "phone", "short_bio"],
          },
        },
      ],
    });

    allStudent.forEach(async (el) => {
      // el => data siswa satu2
      let subjectList = el.subject; // array
      let totalScore = 0;
      subjectList.forEach((subj) => {
        totalScore += parseInt(subj.score_subject);
      });
      await StudentModel.findByIdAndUpdate(el._id, { totalScore });
    });

    if (isSuccess) {
      res.status(200).send({ pesan: "Berhasil Scorring" });
    } else {
      res.status(404).send({ error: "Gagal Input Nilai" });
    }
  }

  // Only By Teacher
  static async teacherLogin(req, res, next) {
    try {
      const user = await TeacherModel.findOne({ email: req.body.email });
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

  // Only By Teacher
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
      const result = await TeacherModel.findOneAndUpdate(
        { email },
        {
          password: bcrypt.hashSync(user_password, 10),
        }
      );

      if (!result) {
        return res
          .status(404)
          .send({ message: "the teacher cannot be created" });
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

module.exports = TeacherController;
