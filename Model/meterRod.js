const mongoose = require('mongoose');

const equilibriumExpSchema = new mongoose.Schema({
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
  weightSuspended1: Number,
  rInverse1: Number,
  observedReading1: Number,
  correctedReading1: Number,
  qInverseRInverse1: Number,
  condition1F1_1: Number,
  loopPosition1: Number,
  distance1: Number,
  condition2Tau1: Number,

  // Trial 2
  weightSuspended2: Number,
  rInverse2: Number,
  observedReading2: Number,
  correctedReading2: Number,
  qInverseRInverse2: Number,
  condition1F1_2: Number,
  loopPosition2: Number,
  distance2: Number,
  condition2Tau2: Number,

  // Trial 3
  weightSuspended3: Number,
  rInverse3: Number,
  observedReading3: Number,
  correctedReading3: Number,
  qInverseRInverse3: Number,
  condition1F1_3: Number,
  loopPosition3: Number,
  distance3: Number,
  condition2Tau3: Number,

}, { timestamps: true });

module.exports = mongoose.model('equilibriumExp', equilibriumExpSchema);
