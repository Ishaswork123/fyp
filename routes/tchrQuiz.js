const express=require('express');
// const router = require('./tchr');
const router=express.Router();
const mongoose=require('mongoose');
const {handleQuiz,showQuiz,getQuizEdit,postQuizEdit,handledeleteQuiz,quizResult}=require('../Controller/quizTchr');
const Classroom=require('../Model/classroom');

const { getTokenFromCookies } = require('../config/tchr');  


const ExperimentResult=require('../Model/expResult.');
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
router.get('/submit-quiz', isAuthenticated,async(req, res) => {
    const expNo = req.query.exp_no || ''; // Default value if not provided
    const expTitle = req.query.exp_title || '';
    const teacherId=req.user.id;
    const classes = await Classroom.find({ teacher: new mongoose.Types.ObjectId(teacherId) });
        
    const totalQuestions = req.query.total_questions || 0;
    console.log("extracted exp-title ,exp_no",{ expNo, expTitle, totalQuestions});

    res.render('createQuiz', { expNo, expTitle, totalQuestions ,classes});
});
router.get('/quizedit/:id', getQuizEdit);
router.post('/quizedit/:id', postQuizEdit);
router.post('/quizdelete/:id',handledeleteQuiz);
async function handledeleteExperiment(req, res) {
 
}
router.get('/delete-experiment/:id',async (req,res)=>{


   const expId = req.params.id;

  try {
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(expId)) {
      return res.redirect('/tchr/quiz-results?error=Invalid Experiment ID.');
    }

    // Find and delete the experiment by ID
    const deletedExperiment = await ExperimentResult.findByIdAndDelete(expId);

    if (!deletedExperiment) {
      return res.redirect('/tchr/quiz-results?error=Experiment not found.');
    }

    // Redirect with success message
    res.redirect('/tchr/quiz-results?success=Experiment deleted successfully.');
  } catch (error) {
    console.error(error);
    res.redirect('/tchr/quiz-results?error=An error occurred while deleting the experiment.');
  }});
router.get('/manage-quizzes',showQuiz);
router.post('/submit-quiz', handleQuiz);
router.get('/quiz-results',isAuthenticated,quizResult),

module.exports=router;