const express=require('express');
const router = require('./tchr');
const Router=express.Router();
const {handleQuiz,showQuiz,getQuizEdit,postQuizEdit,handledeleteQuiz}=require('../Controller/quizTchr');

const { getTokenFromCookies } = require('../config/tchr');  


function isAuthenticated(req, res, next) {
  const tokenData = getTokenFromCookies(req);  // Extract the token from cookies

  if (!tokenData) {
      // Token is missing or invalid, redirect to the home page
      return res.redirect('/');
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


module.exports=router;