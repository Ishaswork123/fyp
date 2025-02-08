const express = require("express");
const router = express.Router();
const Classroom = require("../Model/classroom");
const Teacher = require("../Model/tchr");
const Student = require("../Model/std");
const { createClass,getUpdate,postUpdate,deleteClass}=require('../Controller/classroom');

const {getTokenFromCookies
} =require('../config/tchr');

router.get('/class',(req,res)=>{
  res.render('class');
})
function isAuthenticated(req, res, next) {
  console.log('Cookies in request:', req.cookies);

  // Extract student token
  const Teacher = getTokenFromCookies(req, 'teacher_token');

  if (Teacher) {
    console.log('Teacher authenticated:', Teacher);
    req.user = Teacher; // Attach user info to the request
    return next(); // Allow access to the intended route
  } else {
    console.log('No valid token found. Redirecting to login.');
    res.clearCookie('teacher_token'); // Clear the student token if invalid
    return res.redirect('/tchr/login'); // Redirect to the login page
  }
}
// Show create classroom form
router.get("/create", isAuthenticated, async (req, res) => {
    try {
        // Fetch all students
        const students = await Student.find();
        
        // Get teacherId from req.user (set by the JWT token in isAuthenticated middleware)
        const teacherId = req.user.id; // Assuming teacher's ID is stored in req.user.id

        // Pass teacherId and students to EJS template
        res.render("createClassroom", { students, teacherId,error :{},success:{} });
    } catch (err) {
        res.status(500).send("Error loading students");
    }
});
// Handle classroom creation
router.post("/create", isAuthenticated,  createClass);
router.post('/delete-classroom/:id',deleteClass);
// GET: Render Update Classroom Page
router.get('/update-classroom/:id', getUpdate);

// POST: Update Classroom Details
router.post('/update-classroom/:id', postUpdate);




router.get("/list",isAuthenticated, async (req, res) => {
    try {
        const teacherId = req.user.id;
        console.log('teacher id ',teacherId)
        const classrooms = await Classroom.find({ teacher: teacherId }).populate("students");

        res.render("classroom", { classrooms,success:{} ,teacherId});
    } catch (err) {
        res.status(500).send("Error fetching classrooms");
    }
});
module.exports = router;
