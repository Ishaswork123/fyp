const express = require('express');
const router = express.Router();
const QuizResult = require('../Model/QuizResult'); // Adjust path if needed
const ExpResult = require('../Model/expResult.'); // Adjust path if needed

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
router.get('/results', isAuthenticated, async (req, res) => {
  try {
    const studentId = req.user.id;

    const quizResults = await QuizResult.find({ student_id: studentId }).lean();
    const expResults = await ExpResult.find({ student_id: studentId }).lean();

    res.render('stdResultss', { quizResults, expResults });
} catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
