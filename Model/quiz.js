const mongoose = require('mongoose');

// Define the schema for a quiz
const quizSchema = new mongoose.Schema({
  exp_no:{
    type: String,
    required: true,
  },
  exp_title:{
    type: String,
    required: true,
  },
  question_no: {
    type: Number,
    required: true,
  },
  Question: {
    type: String,
    required: true,
  },
  option1: {
    type: String,
    required: true,
  },
  option2: {
    type: String,
    required: true,
  },
  option3: {
    type: String,
    required: true,
  },
  option4: {
    type: String,
    required: true,
  },
  Answer: {
    type: String,
    required: true,
  }
},{timestamps:true});

// Create a model using the schema
const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
