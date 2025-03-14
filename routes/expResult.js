const express=require('express');
const router=express.Router();
const penExp=require('../Model/penExp');
const SpringExp=require('../Model/springExp');
const Result=require('../Model/expResult.');
const { getTokenFromCookies } = require('../config/tchr');  



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






// Route to display experiments
router.get('/experiments', isAuthenticated, async (req, res) => {
    try {
        const penExperiments = await penExp.find({});
        const springExperiments = await SpringExp.find({});

        res.render('experiments', { penExperiments, springExperiments });
    } catch (error) {
        console.error('Error fetching experiments:', error);
        res.status(500).send('Error loading experiments');
    }
});

// Route to submit grade
router.post('/grade', isAuthenticated, async (req, res) => {
    try {
        const { exp_no, exp_title, grade } = req.body;
const  studentId=req.user.id;
        // Check if the grade is valid
        if (grade < 0 || grade > 5) {
            return res.status(400).send('Invalid grade. Must be between 0 and 5.');
        }

        // Extract teacher's ID and email from the JWT (outside the saving logic)
        const teacherId = req.user.id;

        // Log teacher's id and email for debugging purposes
       

        // Create a new result instance with the extracted teacher's data
        const result = new Result({
            studentId,
            exp_no,
            exp_title,
            grade,
            teacherId,  // Store teacher's ID
        });

        // Save the result
        await result.save();

        // Redirect to experiments page after successful grade submission
        res.redirect('/tchr/experiments');
    } catch (error) {
        console.error('Error submitting grade:', error);
        res.status(500).send('Error submitting grade');
    }
});


module.exports = router;