const mongoose = require('mongoose');

const springExpSchema = new mongoose.Schema({
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
  initialLength1: Number,
  finalLength1: Number,
  extension1:Number,
  trial1Time1: Number,
  trial2Time1: Number,
  meanTime1: Number,
  timePeriod1: Number,
  gravity1: Number,
  mass2: Number,
  initialLength2: Number,
  finalLength2: Number,
  extension2: Number,
  trial1Time2: Number,
  trial2Time2: Number,
  meanTime2: Number,
  timePeriod2: Number,
  gravity2: Number,
  
  mass3: Number,
  initialLength3: Number,
  finalLength3: Number,
  extension3: Number,
  trial1Time3: Number,
  trial2Time3: Number,
  meanTime3: Number,
  timePeriod3: Number,
  gravity3: Number,

}, { timestamps: true });

module.exports = mongoose.model('SpringExp', springExpSchema);
