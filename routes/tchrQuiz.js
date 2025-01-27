const express=require('express');
const router = require('./tchr');
const Router=express.Router();
const {handleQuiz,showQuiz,getQuizEdit,postQuizEdit,handledeleteQuiz,quizResult}=require('../Controller/quizTchr');

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


router.get('/quiz',(req,res)=>{
  res.render('Quiz');
})
router.get('/submit-quiz',(req, res) => {
    const expNo = req.query.exp_no || ''; // Default value if not provided
    const expTitle = req.query.exp_title || '';
    const totalQuestions = req.query.total_questions || 0;
    console.log("extracted exp-title ,exp_no",{ expNo, expTitle, totalQuestions });

    res.render('createQuiz', { expNo, expTitle, totalQuestions });
});
router.get('/quizedit/:id', getQuizEdit);
router.post('/quizedit/:id', postQuizEdit);
router.post('/quizdelete/:id',handledeleteQuiz);


router.get('/manage-quizzes',showQuiz);
router.post('/submit-quiz', handleQuiz);
router.get('/quiz-results',isAuthenticated,quizResult),

module.exports=router;