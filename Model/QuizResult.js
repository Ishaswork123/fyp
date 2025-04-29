const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizResultSchema = new Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'std', required: true }, // Reference to the student
  quiz_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true }],

  fname:{
    type: String,
    required:true
},
  exp_no: { type: String, required: true }, // Experiment number
  exp_title:{
    type: String,
    required: true,
  },

  marks_obtained: { type: Number, required: true }, // Marks obtained by the student
  total_questions: { type: Number, required: true }, // Total number of questions in the quiz
  answers_submitted: { type: [String], required: true } ,// Array of student's submitted answers
  correctAnswers: {
    type:[ String],
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
