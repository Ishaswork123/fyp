const mongoose = require('mongoose');

const resonanceExpSchema = new mongoose.Schema({
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
  freq1: Number,
  waterLevel1: Number,
  diameter1: Number,
  airColumn1: Number,
  correctLength1: Number,
  waveLength1: Number,
  temp1: Number,
  velocity1: Number,

  // Trial 2
  freq2: Number,
  waterLevel2: Number,
  diameter2: Number,
  airColumn2: Number,
  correctLength2: Number,
  waveLength2: Number,
  temp2: Number,
  velocity2: Number,

  // Trial 3
  freq3: Number,
  waterLevel3: Number,
  diameter3: Number,
  airColumn3: Number,
  correctLength3: Number,
  waveLength3: Number,
  temp3: Number,
  velocity3: Number

}, { timestamps: true });

module.exports = mongoose.model('resonanceExp', resonanceExpSchema);
