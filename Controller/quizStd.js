const Quiz = require('../Model/quiz');
// const { postQuizEdit } = require('./quizTchr');
const { getTokenFromCookies } = require('../config/tchr');
const jwt = require('jsonwebtoken');
const User=require('../Model/std');
const quizresult = require('../Model/QuizResult'); // Assuming your result model

const titles = {
  1: 'Pendulum',
  2: 'Mass Spring System',
  3: 'Meter Rod Method',
  4: 'Force Table',
  5: 'Resonance Exp'
};

async function getQuiz(req, res) {
  try {
      // Fetch unique experiment numbers from the database
      const expNumbers = await Quiz.distinct('exp_no');

      // Map the numbers to titles using the `titles` object
      const experiments = expNumbers.map(exp_no => ({
          exp_no,
          exp_title: titles[exp_no]
      }));

      // Render the page with unique experiments
      res.render('stdQuiz', { experiments, quizData: null, marksObtained: null });
  } catch (err) {
      console.error('Error fetching experiments:', err);
      res.status(500).send('Error loading quiz page');
  }
}

async function postQuiz(req, res) {
  const exp_no = req.body.exp_no; // Fetch the selected experiment number

  try {
      // Fetch quiz data for the selected experiment
      const quizData = await Quiz.find({ exp_no });

      // Fetch unique experiment numbers from the database
      const expNumbers = await Quiz.distinct('exp_no');

      // Map the numbers to titles using the `titles` object
      const experiments = expNumbers.map(exp_no => ({
          exp_no,
          exp_title: titles[exp_no]
      }));

      res.render('stdQuiz', { experiments, quizData, marksObtained: null });
  } catch (err) {
      console.error('Error fetching quiz data:', err);
      res.status(500).send('Error fetching quiz data');
  }
}

async function handleQuizSubmission(req, res) {
  const { exp_no, answers} = req.body;
  console.log('POST request received at /std/submit-quiz');
  console.log('Request body:', req.body); // Debug log


const exp_title = titles[exp_no];

// Save or use the exp_title
console.log(`Experiment Title: ${exp_title}`);
  try {
    // Extract and verify the student JWT token
    const tokenData = getTokenFromCookies(req, 'student_token'); // Decoded payload
    if (!tokenData) {
      return res.status(401).send('User not authenticated'); // If no token, respond with an error
    }

    const userId = tokenData.id; // Use the decoded token payload
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
      exp_title,
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