const express=require('express');
const router=express.Router();
const {getQuiz,postQuiz,handleQuizSubmission,quizResult}=require('../Controller/quizStd');
const { getTokenFromCookies } = require('../config/tchr');  


function isAuthenticated(req, res, next) {
  const tokenData = getTokenFromCookies(req);  // Extract the token from cookies

  if (!tokenData) {
      // Token is missing or invalid, redirect to the home page
      return res.redirect('/');
  }
}
router.get('/get-quiz',getQuiz);
router.post('/get-quiz',postQuiz);
router.post('/submit-quiz',isAuthenticated,handleQuizSubmission)
router.get('/std/quiz-results', isAuthenticated, quizResult);

postQuiz
module.exports=router;