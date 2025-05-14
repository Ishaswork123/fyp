const Quiz = require('../Model/quiz');
const Classroom = require('../Model/classroom'); // Import Classroom model

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
  5: 'Resonance Exp',
  6:'Archimedes’ Principle'
};

async function getQuiz(req, res) {
  try {
      // Check if the user is authenticated
      if (!req.user) {
          return res.status(401).send('Unauthorized');
      }

      // Fetch unique experiment numbers from the database
      const expNumbers = await Quiz.distinct('exp_no');

      // Map the experiment numbers to their titles
      const experiments = expNumbers.map(exp_no => ({
        exp_no,
        exp_title: titles[exp_no]
    }));

      // Render the selection page with experiment numbers
      res.render('stdQuiz', { experiments, quizData: null , marksObtained: null });

  } catch (err) {
      console.error('Error fetching experiment numbers:', err);
      res.status(500).send('Error loading quiz page');
  }
}
async function postQuiz(req, res) {
  const exp_no = req.body.exp_no

  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized")
    }

    const studentId = req.user.id
    console.log("enter 1")

    const quizzes = await Quiz.find({ exp_no })
    console.log("quizzes", quizzes)

    const quizClassIds = [...new Set(quizzes.map((q) => q.classId).filter((id) => id))]
    const classrooms = await Classroom.find({ _id: { $in: quizClassIds }, students: studentId })
    const enrolledClassIds = classrooms.map((c) => c._id.toString())

    const filteredQuizzes = quizzes.filter(
      (q) => q.assignedTo === "all" || (q.classId && enrolledClassIds.includes(q.classId.toString())),
    )

    // Fetch quiz ids
    const quizIds = filteredQuizzes.map((q) => q._id)

    // Check if the student has already submitted the quiz for this exp_no
    const existingResult = await quizresult.findOne({
      student_id: studentId,
      exp_no: exp_no,
      quiz_ids: { $all: quizIds }, // Check if these quiz IDs already performed
    })

    if (existingResult) {
      console.log("Student already submitted this quiz")
      return res.send(
        `<script>alert('You have already performed this quiz earlier. You cannot attempt it again.'); window.location.href='/stdConsole';</script>`,
      )
    }

    const expNumbers = await Quiz.distinct("exp_no")
    const experiments = await Quiz.find({ exp_no: { $in: expNumbers } })
      .select("exp_no exp_title")
      .then((quizzes) => {
        return [...new Map(quizzes.map((q) => [q.exp_no, q.exp_title])).values()].map((exp_title, index) => ({
          exp_no: expNumbers[index],
          exp_title: exp_title || "Unknown",
        }))
      })

    res.render("stdQuiz", { experiments, quizData: filteredQuizzes, marksObtained: null })
  } catch (err) {
    console.error("Error fetching quiz data:", err)
    res.status(500).send("Error fetching quiz data")
  }
}

async function handleQuizSubmission(req, res) {
  const { exp_no, answers, correctAnswers, timeout } = req.body
  // We need to handle multiple quiz IDs, not just a single one
  // const quizId = req.body.quiz_id; // This is incorrect

  console.log("POST request received at /std/submit-quiz")
  console.log("Request body:", req.body)

  const exp_title = titles[exp_no]
  const optionMapping = ["A", "B", "C", "D"]

  try {
    const tokenData = getTokenFromCookies(req, "student_token")
    if (!tokenData) {
      return res.status(401).send("User not authenticated")
    }

    const userId = tokenData.id
    console.log("Decoded User ID:", userId)

    const student = await User.findById(userId)
    if (!student) {
      return res.status(404).send("Student not found")
    }

    const quizData = await Quiz.find({ exp_no })

    if (!quizData || quizData.length === 0) {
      return res.status(404).send("Quiz not found")
    }

    // Fetch quiz IDs to save in result
    const quizIds = quizData.map((q) => q._id)

    let marksObtained = 0
    const totalQuestions = quizData.length
    const submittedAnswers = []
    const correctAnswersArray = []

    if (timeout === "true") {
      marksObtained = 0
      submittedAnswers.push(...Array(totalQuestions).fill(""))
      correctAnswersArray.push(...quizData.map((q) => q.Answer))
    } else {
      quizData.forEach((question, index) => {
        const correctAnswer = question.Answer.toString().trim()
        const correctAnswerFirstLetter = correctAnswer.charAt(0).toUpperCase()
        const userAnswerLetter = answers[index]
        const userAnswer = optionMapping[Number.parseInt(userAnswerLetter.replace("option", "")) - 1]

        correctAnswersArray.push(correctAnswer)
        submittedAnswers.push(userAnswer)

        if (correctAnswerFirstLetter === userAnswer.trim().toUpperCase()) {
          marksObtained += 5
        }
      })
    }

    console.log("Marks obtained:", marksObtained)

    const flattenedAnswers = submittedAnswers.flat()

    const result = new quizresult({
      student_id: userId,
      // Store the array of quiz IDs instead of a single ID
      quiz_ids: quizIds, // 👈 Save all quiz ids here as an array

      exp_no,
      exp_title,
      marks_obtained: marksObtained,
      total_questions: totalQuestions,
      answers_submitted: flattenedAnswers,
      correctAnswers: correctAnswersArray,
      fname: student.fname,
    })

    await result.save()
    console.log("Result saved successfully")
    res.redirect(
      `/std/quiz-results?exp_no=${encodeURIComponent(exp_no || "")}&marksObtained=${encodeURIComponent(marksObtained || "")}`,
    )
  } catch (error) {
    console.error(error)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token")
    }
    res.status(500).send("Server error")
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
    res.render('quizResults_1', { quizData, marksObtained });
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