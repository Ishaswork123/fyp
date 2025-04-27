const Quiz = require('../Model/quiz');
// const quizresult=require('../Model/QuizResult');
const User=require('../Model/std');
const  ExpResult=require('../Model/expResult.');
 // Import the Quiz model
 const mongoose=require('mongoose');
const Classroom=require('../Model/classroom')
const ObjectId = mongoose.Types.ObjectId; // Import ObjectId from mongoose
const QuizResult=require('../Model/QuizResult');

async function handleQuiz(req, res) {
    console.log("Received a request at handleQuiz function.");
    // Log the request body for debugging
    if (!req.body || Object.keys(req.body).length === 0) {
        console.error('Request body is empty. Please ensure the form submission is correct.');
        return res.status(400).send('No data submitted');
    }
    // Extract experiment details
    const expNo = req.body.exp_no;
    const expTitle = req.body.exp_title;
    const assignedTo=req.body.assignedTo;
    let classId=req.body.classId;
    console.log('Request Body:', req.body);
 let className = null; // Default null for "All Students"
        
        if (assignedTo === "class" && classId) {
          // Convert classId to ObjectId
          classId = new mongoose.Types.ObjectId(classId);
    
          // Fetch class details
          const classroom = await Classroom.findById(classId);
          if (classroom) {
            className = classroom.className; // Store className
          }}


    const totalQuestions = parseInt(req.body.total_questions);

    if (!expNo || !expTitle || isNaN(totalQuestions)) {
        console.error('Experiment details are missing or invalid.');
        return res.status(400).send('Invalid experiment details.');
    }

    console.log(`Extracted experiment number: ${expNo}, title: ${expTitle}, total questions: ${totalQuestions}`);

    // Prepare quiz data for insertion
    let quizData = [];
    for (let i = 1; i <= totalQuestions; i++) {
        quizData.push({
            exp_no: expNo,
            exp_title: expTitle,
            assignedTo, // "all" or "class"
          classId: assignedTo === "class" ? classId : null, // Store only if assigned to class
          className, // Store className if class is selected
            question_no: i,
            Question: req.body[`question${i}`],
            option1: req.body[`option1${i}`],
            option2: req.body[`option2${i}`],
            option3: req.body[`option3${i}`],
            option4: req.body[`option4${i}`],
            Answer: req.body[`answer${i}`],
        });
    }

    // Save to the database (or handle it as needed)
    try {
        await Quiz.insertMany(quizData); // Assumes you have a Quiz model set up
        console.log('Quiz data inserted successfully:', quizData);
        res.render('Quiz');
    } catch (error) {
        console.error('Error saving quiz data:', error);
        res.status(500).send('Error saving quiz data.');
    }
}

async function showQuiz(req,res){
    // app.get('/quiz/manage-quizzes', async (req, res) => {
        const quizData = await Quiz.find(); // Fetch quiz data from the database
      
        try {
          // Fetch all quizzes from the database
          if (quizData && quizData.length > 0) {
            res.render('showQuiz', { quizData: quizData });
         
        }else {
          res.render('showQuiz', { quizData: [] }); // Pass an empty array if no quiz data
        }
      
      } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
        }
    }

    async function getQuizEdit(req,res){
        const quizId = req.params.id;

        try {
          const quiz = await Quiz.findById(quizId); // Fetch quiz data by ID
          if (quiz) {
            res.render('editQuiz', { quiz }); // Render editQuiz.ejs with quiz data
          } else {
            res.status(404).send('Quiz not found');
          }
        } catch (error) {
          console.error(error);
          res.status(500).send('Server Error');
        }
    }
async function postQuizEdit(req,res){
    const quizId = req.params.id;
    const { exp_no,exp_title, question_no, Question, option1, option2, option3, option4, Answer } = req.body;
  
    try {
      // Update quiz in the database
      await Quiz.findByIdAndUpdate(quizId, {
        exp_no,
        exp_title,
        question_no,
        Question,
        option1,
        option2,
        option3,
        option4,
        Answer
      });
      res.redirect('/tchr/manage-quizzes'); // Redirect to the quiz management page
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
}
async function handledeleteQuiz(req, res) {
    const quizId = req.params.id;
  
    try {
        // Check if the ID is a valid ObjectId
        if (!ObjectId.isValid(quizId)) {
            return res.redirect('/tchr/manage-quizzes?error=Invalid Quiz ID.');
        }
  
        // Find and delete the student by ID
        const deletedfile = await Quiz.findByIdAndDelete(quizId);
  
        if (!deletedfile) {
            return res.redirect('/tchr/manage-quizzes?error=Data not found.');
        }
  
        // Redirect to manage student screen with a success message
        res.redirect('/tchr/manage-quizzes?success=Data deleted successfully.');
    } catch (error) {
        console.error(error);
        res.redirect('/tchr/manage-quizzes?error=An error occurred while deleting the data.');
    }
  }

  async function quizResult(req, res) {
    try {
      const { student_id, exp_no } = req.query;
    
      // Building dynamic filter object
      let filter = {};
      if (student_id) filter.student_id = student_id;
      if (exp_no) filter.exp_no = exp_no;
    
      // Fetch filtered quiz results from the database
      const quizResults = await QuizResult.find(filter);
    
      if (!quizResults || quizResults.length === 0) {
        return res.status(404).send('No quiz results found');
      }
    
      // ✅ Extract correctAnswers from QuizResult model
      const formattedCorrectAnswers = quizResults.map(result => ({
        exp_no: result.exp_no,
        correctAnswers: result.correctAnswers // Already stored in the database
      }));
    
      // Fetch unique student IDs for filters
      const students = await QuizResult.aggregate([
        {
          $group: {
            _id: "$student_id",
            fname: { $first: "$fname" }
          }
        }
      ]);
    
      // Get student details
      const studentDetails = await QuizResult.find({ student_id: { $in: students.map(s => s._id) } }, 'student_id fname');
      const expResults = await ExpResult.find(filter).populate('studentId teacherId'); // Assuming the teacherId and studentId need population for name

      // Get unique experiment numbers for filtering
      const expNumbers = await QuizResult.find().distinct('exp_no');
    
      // Render the EJS file and pass the correct data
      res.render('quizResults', {
        quizResults,
        students: studentDetails,
        expNumbers,
        correctAnswers: formattedCorrectAnswers,
        expResults  // Pass experiment results to the EJS template

      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }    
  
module.exports={handleQuiz,showQuiz,getQuizEdit,postQuizEdit,handledeleteQuiz,quizResult};