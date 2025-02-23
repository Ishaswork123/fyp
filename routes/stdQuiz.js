const express=require('express');
const router=express.Router();
const {getQuiz,postQuiz,handleQuizSubmission,quizResult}=require('../Controller/quizStd');
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




router.post('/submit-quiz',isAuthenticated,handleQuizSubmission)
router.get('/quiz-results', isAuthenticated, quizResult);
router.get('/get-quiz',isAuthenticated,getQuiz);
router.post('/get-quiz',isAuthenticated,postQuiz);
// postQuiz
module.exports=router;