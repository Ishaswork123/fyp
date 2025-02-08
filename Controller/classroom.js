

const Classroom = require("../Model/classroom");
const Teacher = require("../Model/tchr");
const Student = require("../Model/std");

const {sendWelcomeEmail_room }=require('../middlewares/Email');


const generateClassCode = () => Math.random().toString(36).substr(2, 6).toUpperCase();


async function createClass(req, res) {
    let error = {};
    const { className, teacherId, studentIds, About } = req.body;
    const teacherID = teacherId || req.user.id;
  
    try
    
    {
    //   const teacherClasses = await Classroom.find({ teacher: teacherID });
  
    //   if (teacherClasses.length >= 3) {
    //     return res.render("createClassroom", {
    //       error: "You can only create up to 3 classes.",
    //       students: await Student.find(),
    //       teacherId: teacherID
    //     });
    //   }
  
      const existingClass = await Classroom.findOne({ teacher: teacherID, className });
  
      if (existingClass) {
        return res.render("createClassroom", {
          error: "A class with this name already exists.",
          students: await Student.find(),
          teacherId: teacherID
        });
      }
  
      const classCode = generateClassCode();
  
      const newClassroom = new Classroom({
        className,
        classDescription: About,
        teacher: teacherID,
        students: studentIds,
        classCode
      });
  
      await newClassroom.save();
  
      // Fetch teacher name
      const teacher = await Teacher.findById(teacherID).select("fname");
  
      // Fetch students' emails and names
      const students = await Student.find({ _id: { $in: studentIds } }).select("email fname");
  
      // Send welcome email to each student
      for (const student of students) {
        await sendWelcomeEmail_room(student.email, className, teacher.fname, classCode);
      }
  
      const classrooms = await Classroom.find({ teacher: teacherID }).populate('students', 'fname email').exec();
  
      res.render("classroom", {
        success: `Classroom "${className}" created successfully!`,
        students: await Student.find(),
        classrooms
      });
  
    } catch (err) {
      console.error("Error creating class:", err);
      return res.render("createClassroom", {
        error: "An unexpected error occurred. Please try again.",
        students: await Student.find(),
      });
    }
  }


  async function getUpdate(req,res){
    try {
      const { id } = req.params;

      // Fetch a single classroom
      const classroom = await Classroom.findById(id).lean();
      if (!classroom) {
          return res.status(404).send("Classroom not found");
      }

      // Fetch all students from the Student model
      const students = await Student.find().lean();

      res.render('updateClass', { classroom, students }); // Render view with data
  } catch (error) {
      console.error("Error fetching classroom:", error);
      res.status(500).send("Error fetching classroom");
  }
  }

  async function postUpdate(req,res){
    try {
      const { id } = req.params;
      let { className, classDescription, teacher, students, newStudent } = req.body;

      if (!Array.isArray(students)) {
          students = students ? students.split(',') : []; // Convert to array if string
      }

      if (newStudent && newStudent !== "") {
          students.push(newStudent); // Add new student if selected
      }

      // Ensure there are no duplicate students
      students = [...new Set(students)];

      // Update classroom in the database
      await Classroom.findByIdAndUpdate(id, {
          className,
          classDescription,
          teacher,
          students
      });

      res.redirect('/classroom/list'); 
  } catch (error) {
      console.error("Error updating classroom:", error);
      res.status(500).send("Error updating classroom");
  }
  }

  async function deleteClass(req,res){
    try {
      const { id } = req.params;
      await Classroom.findByIdAndDelete(id);
      const classrooms = await Classroom.find(); // Fetch all classrooms from the database

      // res.status(200).json({ message: 'Classroom deleted successfully' });
      res.render('classroom',{classrooms});
  } catch (error) {
      res.status(500).json({ message: 'Error deleting classroom', error: error.message });
  }
  }
module.exports={
    createClass,getUpdate,postUpdate,deleteClass
}