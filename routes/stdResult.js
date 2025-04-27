const express = require('express');
const router = express.Router();
const QuizResult = require('../Model/QuizResult'); // Adjust path if needed
const ExpResult = require('../Model/expResult.'); // Adjust path if needed
const { getTokenFromCookies } = require('../config/tchr');  

const mongoose=require('mongoose');
function isAuthenticated(req, res, next) {
  console.log('Cookies in request:', req.cookies);

  // Extract student token
  const student = getTokenFromCookies(req, 'student_token');

  if (student) {
    console.log('Student authenticated:', student);
    req.user = student; // Attach user info to the request
    return next(); // Allow access to the intended route
  } else {
    console.log('No valid token found. Redirecting to login.');
    res.clearCookie('student_token'); // Clear the student token if invalid
    return res.redirect('/std/login'); // Redirect to the login page
  }
}

// Route to get results
// router.get('/results', isAuthenticated, async (req, res) => {
//   try {
//     const studentId = req.user.id;

//     const quizResults = await QuizResult.find({ student_id: studentId }).lean();
//     const expResults = await ExpResult.find({ student_id: studentId }).lean();

//     res.render('stdResultss', { quizResults, expResults });
// } catch (error) {
//     console.error('Error fetching results:', error);
//     res.status(500).send('Server Error');
//   }
// });
router.get('/results', isAuthenticated, async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student_id from JWT token

    // **Step 1: Fetch all quiz results for the student**
    const quizResults = await QuizResult.find({ student_id: studentId }).lean();

    // **Step 2: Extract unique experiment numbers (exp_no) for the student**
    const expNumbers = [...new Set(quizResults.map(result => result.exp_no))];

    // **Step 3: Extract correct answers from quizResults**
    const formattedCorrectAnswers = quizResults.map(result => ({
      exp_no: result.exp_no,
      correctAnswers: result.correctAnswers // Already an array in the result
    }));

    // **Step 4: Fetch additional experiment results from ExpResult**
    const expResults = await ExpResult.find({ studentId: new mongoose.Types.ObjectId(studentId) }).lean();

    // **Render EJS page with quiz results, experiment numbers, and correct answers**
    res.render('stdResultss', { 
      quizResults, 
      expNumbers, 
      correctAnswers: formattedCorrectAnswers,
      expResults
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
