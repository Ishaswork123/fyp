const mongoose = require('mongoose');

const penExpSchema = new mongoose.Schema({
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
    
  mass1: Number,
  radius1: Number,
  threadLength1: Number,
  PenndulumLength1:Number,
  trial1Time1: Number,
  trial2Time1: Number,
  meanTime1: Number,
  timePeriod1: Number,


  mass2: Number,
  radius2: Number,
  threadLength2: Number,
  PenndulumLength2:Number,
  trial1Time2: Number,
  trial2Time2: Number,
  meanTime2: Number,
  timePeriod2: Number,
  
  mass3: Number,
  radius3: Number,
  threadLength3: Number,
  PenndulumLength3:Number,
  trial1Time3: Number,
  trial2Time3: Number,
  meanTime3: Number,
  timePeriod3: Number,

}, { timestamps: true });

module.exports = mongoose.model('penExp', penExpSchema);
