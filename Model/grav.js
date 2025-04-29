const mongoose = require('mongoose');

const forceExpSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Std',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  exp_no: {
    type: String,
    required: true
  },

  // Trial 1
  weightP1: Number,
  weightQ1: Number,
  angleP1: Number,
  angleQ1: Number,
  PsinAngleP1: Number,
  QsinAngleQ1: Number,
  weightW1: Number,
  weightError1: Number,

  // Trial 2
  weightP2: Number,
  weightQ2: Number,
  angleP2: Number,
  angleQ2: Number,
  PsinAngleP2: Number,
  QsinAngleQ2: Number,
  weightW2: Number,
  weightError2: Number,

  // Trial 3
  weightP3: Number,
  weightQ3: Number,
  angleP3: Number,
  angleQ3: Number,
  PsinAngleP3: Number,
  QsinAngleQ3: Number,
  weightW3: Number,
  weightError3: Number,

}, { timestamps: true });

module.exports = mongoose.model('forceExperiment', forceExpSchema);
