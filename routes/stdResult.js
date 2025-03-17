const express = require('express');
const router = express.Router();
const QuizResult = require('../Model/QuizResult'); // Adjust path if needed
const ExpResult = require('../Model/expResult.'); // Adjust path if needed
const Quiz=require('../Model/quiz');
const { getTokenFromCookies } = require('../config/tchr');  


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

    // **Step 1: Fetch all unique experiment numbers (exp_no) for the student**
    const expNumbers = await QuizResult.find({ student_id: studentId }).distinct('exp_no');

    // **Step 2: Fetch correct answers from `Quiz` based on `exp_no`**
    // const correctAnswers = await Quiz.find({ exp_no }, 'question_no Answer');
    const correctAnswers = await Quiz.find({ exp_no: { $in: expNumbers } }, 'exp_no question_no Answer').lean();

    // **Step 3: Format correct answers into a structured array**
    const formattedCorrectAnswers = correctAnswers.map(q => ({
      question_no: q.question_no,
      answer: q.Answer  // Handle possible lowercase
  }));

    // **Step 4: Fetch all quiz results from `QuizResult`**
    const quizResults = await QuizResult.find({ student_id: studentId }).lean();
    const expResults = await ExpResult.find({ student_id: studentId }).lean();

    // **Render EJS page with required data**
    res.render('stdResultss', { 
      quizResults, 
      expNumbers, 
      correctAnswers:formattedCorrectAnswers ,
      expResults
    });

  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
