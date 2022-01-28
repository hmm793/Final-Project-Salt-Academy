const scheduleModel = require("../models/schedule");
const subjectModel = require("../models/subject");
const TeacherModel = require("../models/teacher");
const StudentModel = require("../models/student");
class ScheduleController {
  // Only By Headmaster
  static async createNewSchedule(req, res, next) {
    const {
      kelas,
      title,
      daysOfWeek,
      start,
      startTime,
      endTime,
      end,
      color,
      allDay,
    } = req.body;
    let result;

    const convertHHMMToSec = (time) => {
      const tt = time.split(":");
      if (tt[2]) {
        return tt[0] * 3600 + tt[1] * 60 + parseInt(tt[2]);
      } else {
        return tt[0] * 3600 + tt[1] * 60;
      }
    };
    try {
      if (start && end) {
        ///cek apakah berupa event atau bukan
        // Semua ini event
        const validator1 = await scheduleModel.find();
        let isTabrakan = false;
        validator1.forEach((element) => {
          if (element.start) {
            // klo true artinya ada event karena cuman event yang punya start
            const startInMili = new Date(start).getTime(); // (s2)
            const startInMiliValidator1 = new Date(element.start).getTime(); // (s1)

            const endInMili = new Date(end).getTime(); // (e2)
            const endInMiliValidator1 = new Date(element.end).getTime(); //(e1)
            if (
              startInMiliValidator1 <= startInMili &&
              startInMili < endInMiliValidator1 &&
              endInMili <= endInMiliValidator1
            ) {
              // return res.json({ error: "Jadwal Event Bertabrakan" });
              isTabrakan = true;
            }

            if (
              startInMiliValidator1 <= startInMili &&
              startInMili < endInMiliValidator1 &&
              endInMiliValidator1 <= endInMili
            ) {
              // return res.json({ error: "Jadwal Event Bertabrakan" });
              isTabrakan = true;
            }

            if (
              startInMili <= startInMiliValidator1 &&
              startInMiliValidator1 < endInMili &&
              endInMili <= endInMiliValidator1
            ) {
              // return res.json({ error: "Jadwal Event Bertabrakan" });
              isTabrakan = true;
            }
            if (
              startInMili <= startInMiliValidator1 &&
              startInMiliValidator1 < endInMili &&
              endInMiliValidator1 <= endInMili
            ) {
              // return res.json({ error: "Jadwal Event Bertabrakan" });
              isTabrakan = true;
            }
          }
        });

        if (isTabrakan) {
          return res.json({ error: "Jadwal Event Bertabrakan" });
        } else {
          result = await scheduleModel.create({
            title,
            daysOfWeek: null,
            start,
            end,
            color,
            allDay,
          });

          if (!result) {
            return res.status(404).send("the schedule cannot be created");
          }
          res.send(result);
        }
      } else {
        // Bukan Event
        // Semua Data Jadwal Kelas Sama (A) dan di hari yang sama (Senin) []
        const dataJadwal = await scheduleModel.find({
          $and: [
            {
              kelas,
            },
            { daysOfWeek: { $in: daysOfWeek } },
          ],
        });

        if (dataJadwal) {
          let isCrash = false;
          dataJadwal.forEach((element) => {
            // Cek Apakah ada jam yang sama ?
            let startTimeInSecondValidator = convertHHMMToSec(
              element.startTime
            ); // s1
            let endTimeInSecondValidator = convertHHMMToSec(element.endTime); //e1
            let startTimeNewInput = convertHHMMToSec(startTime); //s2
            let endTimeNewInput = convertHHMMToSec(endTime); //e2

            if (startTimeNewInput < startTimeInSecondValidator) {
              if (
                !(
                  startTimeNewInput < startTimeInSecondValidator &&
                  endTimeNewInput <= startTimeInSecondValidator
                )
              ) {
                isCrash = true;
              }
            } else if (startTimeNewInput >= endTimeInSecondValidator) {
              if (
                !(
                  startTimeNewInput >= endTimeInSecondValidator &&
                  endTimeNewInput > endTimeInSecondValidator
                )
              ) {
                isCrash = true;
              }
            } else {
              isCrash = true;
            }
          });

          if (isCrash) {
            console.log("1");
            return res.json({
              error: "Jadwal Bentrok",
            });
          } else {
            console.log("2");
            // Artinya Setelah pengecekan hari kelas, jam tidak bentrok dan perlu pengecekan guru sebelum pembuatan
            const guruSaatIni = await subjectModel.find({
              subject_name: title,
            });
            const idGuruSaatIni = guruSaatIni[0].teacher_id; // pasti ada

            const scheduleForAllClass = await scheduleModel
              .find({ kelas: { $exists: true } })
              .populate({
                path: "kelas",
                select: ["class_name", "teacher"],
                populate: {
                  path: "teacher",
                  select: [
                    "first_name",
                    "last_name",
                    "email",
                    "phone",
                    "short_bio",
                  ],
                },
              });

            const tempData = await subjectModel
              .find({
                teacher_id: idGuruSaatIni,
              })
              .select("subject_name");

            // Mata pelajaran yang diampu oleh guru ybs
            const SubjectsName = tempData.map((el) => {
              return el.subject_name;
            });

            let newSchedule = scheduleForAllClass.filter(
              (el) =>
                SubjectsName.includes(el.title) &&
                el.daysOfWeek.includes(daysOfWeek[0])
            );

            if (newSchedule.length !== 0) {
              newSchedule.forEach((jadwal) => {
                const startTimeInSecondValidator = convertHHMMToSec(
                  jadwal.startTime
                ); // s1
                const endTimeInSecondValidator = convertHHMMToSec(
                  jadwal.endTime
                ); //e1
                const startTimeNewInput = convertHHMMToSec(startTime); //s2
                const endTimeNewInput = convertHHMMToSec(endTime); //e2

                if (startTimeNewInput < startTimeInSecondValidator) {
                  if (
                    !(
                      startTimeNewInput < startTimeInSecondValidator &&
                      endTimeNewInput <= startTimeInSecondValidator
                    )
                  ) {
                    isCrash = true;
                  }
                } else if (startTimeNewInput >= endTimeInSecondValidator) {
                  if (
                    !(
                      startTimeNewInput >= endTimeInSecondValidator &&
                      endTimeNewInput > endTimeInSecondValidator
                    )
                  ) {
                    isCrash = true;
                  }
                } else {
                  isCrash = true;
                }
              });

              if (isCrash) {
                return res.json({
                  error: "Jadwal Bentrok",
                });
              } else {
                result = await scheduleModel.create({
                  kelas,
                  title,
                  daysOfWeek,
                  startTime,
                  endTime,
                  color,
                  allDay,
                });

                if (!result) {
                  return res.status(404).send("the schedule cannot be created");
                }

                return res.send(result);
              }
            } else {
              result = await scheduleModel.create({
                kelas,
                title,
                daysOfWeek,
                startTime,
                endTime,
                color,
                allDay,
              });

              if (!result) {
                return res.status(404).send("the schedule cannot be created");
              }

              return res.send(result);
            }
          }
        } else {
          // Cek Guru YBS BISA ?
          let isCrash2 = false;

          const guruSaatIni = await subjectModel.find({
            subject_name: title,
          });
          const idGuruSaatIni = guruSaatIni[0].teacher_id; // pasti ada

          const scheduleForAllClass = await scheduleModel
            .find({ kelas: { $exists: true } })
            .populate({
              path: "kelas",
              select: ["class_name", "teacher"],
              populate: {
                path: "teacher",
                select: [
                  "first_name",
                  "last_name",
                  "email",
                  "phone",
                  "short_bio",
                ],
              },
            });

          const tempData = await subjectModel
            .find({
              teacher_id: idGuruSaatIni,
            })
            .select("subject_name");

          // Mata pelajaran yang diampu oleh guru ybs
          const SubjectsName = tempData.map((el) => {
            return el.subject_name;
          });

          let newSchedule = scheduleForAllClass.filter(
            (el) =>
              SubjectsName.includes(el.title) &&
              el.daysOfWeek.includes(daysOfWeek[0])
          );

          if (newSchedule.length !== 0) {
            newSchedule.forEach((jadwal) => {
              const startTimeInSecondValidator = convertHHMMToSec(
                jadwal.startTime
              ); // s1
              const endTimeInSecondValidator = convertHHMMToSec(jadwal.endTime); //e1
              const startTimeNewInput = convertHHMMToSec(startTime); //s2
              const endTimeNewInput = convertHHMMToSec(endTime); //e2

              if (startTimeNewInput < startTimeInSecondValidator) {
                if (
                  !(
                    startTimeNewInput < startTimeInSecondValidator &&
                    endTimeNewInput <= startTimeInSecondValidator
                  )
                ) {
                  isCrash2 = true;
                }
              } else if (startTimeNewInput >= endTimeInSecondValidator) {
                if (
                  !(
                    startTimeNewInput >= endTimeInSecondValidator &&
                    endTimeNewInput > endTimeInSecondValidator
                  )
                ) {
                  isCrash2 = true;
                }
              } else {
                isCrash2 = true;
              }
            });

            if (isCrash2) {
              return res.json({
                error: "Jadwal Bentrok",
              });
            } else {
              result = await scheduleModel.create({
                kelas,
                title,
                daysOfWeek,
                startTime,
                endTime,
                color,
                allDay,
              });

              if (!result) {
                return res.status(404).send("the schedule cannot be created");
              }

              return res.send(result);
            }
          } else {
            result = await scheduleModel.create({
              kelas,
              title,
              daysOfWeek,
              startTime,
              endTime,
              color,
              allDay,
            });

            if (!result) {
              return res.status(404).send("the schedule cannot be created");
            }

            return res.send(result);
          }
        }
      }
    } catch (error) {
      next(error);
    }
  }

  // Only By Headmaster
  static async getAllSchedule(req, res, next) {
    try {
      const result = await scheduleModel.find().populate({
        path: "kelas",
        select: ["class_name", "teacher"],
        populate: {
          path: "teacher",
          select: ["first_name", "last_name", "email", "phone", "short_bio"],
        },
      });

      if (!result) {
        return res.status(404).send("the schedule cannot be showed");
      }
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  // Semua Make
  static async getScheduleByID(req, res, next) {
    const { id } = req.params;
    try {
      const schedule = await scheduleModel.findById(id).populate({
        path: "kelas",
        select: ["class_name", "teacher"],
        populate: {
          path: "teacher",
          select: ["first_name", "last_name", "email", "phone", "short_bio"],
        },
      });
      if (!schedule) {
        return res.status(500).json({ success: false });
      }
      res.send(schedule);
    } catch (error) {
      next(error);
    }
  }

  // Only By Headmaster
  static async deleteSchedule(req, res, next) {
    const { id } = req.params;
    try {
      const result = await scheduleModel.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).send("the schedule cannot be deleted");
      }
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  // For Event (Tidak Di perlukan lagi)
  static async updateDragDropSchedule(req, res, next) {
    try {
      const arrSchedule = req.body;
      arrSchedule.forEach(async (element) => {
        await scheduleModel.findOneAndUpdate(
          { _id: element.id },
          {
            title: element.title,
            start: element.start,
            end: element.end,
            color: element.color,
          }
        );
      });
      res.send(req.body);
    } catch (error) {
      next(error);
    }
  }

  // Only for headmaster (Tidak Di perlukan lagi)
  static async editScheduleByID(req, res, next) {
    const { id } = req.params;
    const { title, color } = req.body;

    try {
      const result = await scheduleModel.findOneAndUpdate(
        { _id: id },
        {
          title,
          color,
        },
        {
          new: true,
        }
      );
      if (!result) {
        return res.status(404).send("the schedule cannot be edited");
      }
      res.send(result);
    } catch (error) {
      next(error);
    }
  }

  // Only By Headmaster
  static async getTempSchedule(req, res, next) {
    try {
      let filter1 = {};
      let filter2 = {};
      if (req.query.schedule) {
        filter1 = { kelas: req.query.schedule.split(",") };
        filter2 = { kelas: { $exists: false } };
      }
      const scheduleList = await scheduleModel.find({
        $or: [filter1, filter2],
      });
      if (!scheduleList) {
        res.status(500).json({ success: false });
      }
      res.status(201).json(scheduleList);
    } catch (error) {}
  }

  // Only By Teacher
  static async getScheduleByTeacher(req, res, next) {
    const { id } = req.params;
    try {
      const dataTeacher = await TeacherModel.findById(id)
        .populate("kelas")
        .populate("Subject");

      const relatedSubject = dataTeacher.Subject.map((el) => {
        return el.subject_name;
      });

      const allSchedule = await scheduleModel
        .find({ kelas: { $exists: true } })
        .populate({
          path: "kelas",
          select: ["class_name", "teacher"],
          populate: {
            path: "teacher",
            select: ["first_name", "last_name", "email", "phone", "short_bio"],
          },
        });

      const filteredSchedule = allSchedule.filter((el) => {
        const isExist = relatedSubject.includes(el.title);
        if (isExist) {
          return el;
        }
      });
      if (!filteredSchedule) {
        return res.status(500).json({ success: false });
      }
      res.send(filteredSchedule);
    } catch (error) {
      next(error);
    }
  }

  // Only By Student
  static async getScheduleByStudent(req, res, next) {
    const { id } = req.params;
    try {
      const dataStudent = await StudentModel.findById(id)
        .populate({
          path: "kelas",
          populate: [
            {
              path: "teacher",
              select: [
                "first_name",
                "last_name",
                "email",
                "phone",
                "short_bio",
              ],
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
        })
        .populate({
          path: "subject",
          populate: {
            path: "subject_name",
          },
        });

      // console.log("DATA STUDENT : ", dataStudent.kelas.subject);

      const relatedSubject = dataStudent.kelas.subject.map((el) => {
        return el.subject_name;
      });

      const allSchedule = await scheduleModel
        .find({ kelas: { $exists: true } })
        .populate({
          path: "kelas",
          select: ["class_name", "teacher"],
          populate: {
            path: "teacher",
            select: ["first_name", "last_name", "email", "phone", "short_bio"],
          },
        });

      const filteredSchedule = allSchedule.filter((el) => {
        const isExist = relatedSubject.includes(el.title);
        if (isExist) {
          return el;
        }
      });
      if (!filteredSchedule) {
        return res.status(500).json({ success: false });
      }
      res.send(filteredSchedule);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ScheduleController;
