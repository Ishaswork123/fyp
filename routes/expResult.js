const express=require('express');
const router=express.Router();
const penExp=require('../Model/penExp');
const SpringExp=require('../Model/springExp');
const Result=require('../Model/expResult.');
const { getTokenFromCookies } = require('../config/tchr');  
const Resonance=require('../Model/resonance');
const meterRod=require('../Model/meterRod');
const grav=require('../Model/grav');
const resonance = require('../Model/resonance');

const Arch=require('../Model/archimedesPrinciple');

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





router.get('/experiments', isAuthenticated, async (req, res) => {
    try {
        const penExperiments = await penExp.find({});
        const springExperiments = await SpringExp.find({});
        const meterrod= await meterRod.find({});
        const resonance= await Resonance.find({});
        const force_exp= await grav.find();
const Archs=await Arch.find();
        res.render('experiments', {
            penExperiments,
            springExperiments,
            meterrod,
            resonance,
            force_exp,
            Archs,
            showStudentModal: false,
            showGradeSection: false,
            exp_no: null,
            students: [],
            studentData: [],
            selectedStudent: null
        });
    } catch (error) {
        console.error('Error fetching experiments:', error);
        res.status(500).send('Error loading experiments');
    }
});router.post('/select-exp', isAuthenticated, async (req, res) => {
    const { exp_no } = req.body;

    try {
        let students = [];
        if (exp_no === '1') {
            students = await penExp.find().distinct('studentName');
        } else if (exp_no === '2') {
            students = await SpringExp.find().distinct('studentName');
        } else if (exp_no === '3') {
            students = await meterRod.find().distinct('studentName');
        } else if (exp_no === '4') {
            students = await grav.find().distinct('studentName');
        } else if (exp_no === '5') {
            students = await resonance.find().distinct('studentName');
        }
        else if (exp_no === '6') {
            students = await Arch.find().distinct('studentName');
        }

        res.render('experiments', {
            penExperiments: [],
            springExperiments: [],
            meterrod:[],
            resonance :[],
            force_exp : [],
            Archs:[],

            showStudentModal: true,
            showGradeSection: false,
            exp_no,
            students,
            studentData: [],
            selectedStudent: null
        });
    } catch (error) {
        console.error('Error loading students:', error);
        res.status(500).send('Error loading students');
    }
});
router.post('/select-student', isAuthenticated, async (req, res) => {
    const { exp_no, studentName } = req.body;

    try {
        let studentData = [];
        if (exp_no === '1') {
            studentData = await penExp.find({ studentName });
        } else if (exp_no === '2') {
            studentData = await SpringExp.find({ studentName });
        } else if (exp_no === '3') {
            studentData = await meterRod.find({ studentName });
        } else if (exp_no === '4') {
            studentData = await grav.find({ studentName });
        } else if (exp_no === '5') {
            studentData = await resonance.find({ studentName });
        }
          else if (exp_no === '6') {
            studentData = await Arch.find({ studentName });
        }

        res.render('experiments', {
            penExperiments: [],
            springExperiments: [],
            meterrod: [],
            resonance: [],
            force_exp: [],
            Archs:[],
            showStudentModal: false,
            showGradeSection: true,
            exp_no,
            students: [],
            studentData,
            selectedStudent: studentName
        });
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).send('Error fetching student data');
    }
});

router.post('/grade', isAuthenticated, async (req, res) => {
    try {
        const { exp_no, exp_title, grade, studentId } = req.body;

        if (grade < 0 || grade > 15) {
            return res.status(400).send('Invalid grade. Must be between 0 and 15.');
        }

        const teacherId = req.user.id;

        const result = new Result({
            studentId,
            exp_no,
            exp_title,
            grade,
            teacherId,
        });

        await result.save();
        res.redirect('/tchr/quiz-results');
    } catch (error) {
        console.error('Error submitting grade:', error);
        res.status(500).send('Error submitting grade');
    }
}); 


module.exports = router;