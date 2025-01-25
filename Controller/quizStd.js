const Quiz=require('../Model/quiz');
// const { postQuizEdit } = require('./quizTchr');
const { getTokenFromCookies } = require('../config/tchr');
const jwt = require('jsonwebtoken');
const User=require('../Model/std');
const quizresult = require('../Model/QuizResult'); // Assuming your result model

async function getQuiz(req,res){
        const experiments = await Quiz.find({}, 'exp_no exp_title'); // Fetch experiment numbers and titles
        res.render('stdQuiz', { experiments, quizData: null, marksObtained: null });
      
}

async function postQuiz(req,res){
    const exp_no = req.body.exp_no; // Fetch the experiment number from the form
  console.log('Experiment number from form:', exp_no); // Log for debugging

  try {
      // Fetch all quiz documents with the same exp_no
      const quizData = await Quiz.find({ exp_no: exp_no }); // Returns an array of documents
      console.log({ quizData });

      // Fetch unique experiment numbers for the dropdown
      const experiments = await Quiz.find({}, 'exp_no').distinct('exp_no'); // Fetch unique exp_no

      res.render('stdQuiz', { experiments, quizData, marksObtained: null });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching quiz data');
  }
}
async function handleQuizSubmission(req, res) {
    const { exp_no, answers } = req.body;
    console.log('POST request received at /std/submit-quiz');
    console.log('Request body:', req.body); // Debug log
  
    try {
      // Extract and verify JWT token
      const tokenData = getTokenFromCookies(req); // Extract token from cookies
      if (!tokenData) {
        return res.status(401).send('User not authenticated'); // If no token, respond with an error
      }
  
      // Verify the JWT token
      const decodedToken = jwt.verify(tokenData, process.env.JWT_SECRET);
      const userId = decodedToken.id; // Assuming the token contains a user ID
      console.log('Decoded User ID:', userId);
  
      // Find the student by ID
      const student = await User.findById(userId);
      if (!student) {
        return res.status(404).send('Student not found');
      }
  
      // Fetch all questions for the experiment number
      const quizData = await Quiz.find({ exp_no });
      const optionMapping = ['A', 'B', 'C', 'D'];
  
      // Check if quizData is empty
      if (!quizData || quizData.length === 0) {
        return res.status(404).send('Quiz not found');
      }
  
      // Calculate marks
      let marksObtained = 0;
      const totalQuestions = quizData.length;
  
      quizData.forEach((question, index) => {
        const correctAnswer = question.Answer.toString().trim();
        const correctAnswerFirstLetter = correctAnswer.charAt(0).toUpperCase();
        const userAnswerLetter = answers[index]; // User-selected answer, e.g., 'option3'
        const userAnswer = optionMapping[parseInt(userAnswerLetter.replace('option', '')) - 1];
  
        if (correctAnswerFirstLetter === userAnswer.trim().toUpperCase()) {
          marksObtained += 5; // Increment marks for correct answer
        }
      });
  
      console.log('Marks obtained:', marksObtained);
  
      // Save the result in MongoDB
      const flattenedAnswers = answers.flat();
      const result = new quizresult({
        student_id: userId,
        exp_no,
        marks_obtained: marksObtained,
        total_questions: totalQuestions,
        answers_submitted: flattenedAnswers,
        fname: student.fname,
      });
  
      await result.save();
      console.log('Result saved successfully');
      res.redirect(`/std/quiz-results?exp_no=${exp_no}&marksObtained=${marksObtained}`);
    } catch (error) {
      console.error(error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).send('Invalid token');
      }
      res.status(500).send('Server error');
    }
  }

async function quizResult(req,res){
    const { exp_no, marksObtained } = req.query;
  
    try {
      const quizData = await Quiz.find({ exp_no });
      if (!quizData || quizData.length === 0) {
        return res.status(404).send('Quiz not found');
      }
  
      // Render the results EJS page
      res.render('quizResults', { quizData, marksObtained });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
}
module.exports={
    getQuiz,postQuiz,
    handleQuizSubmission,
    quizResult
}