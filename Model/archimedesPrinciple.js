const mongoose = require('mongoose');

const archimedesSchema = new mongoose.Schema({
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
  weightInAir1: Number,
  weightInLiquid1: Number,
  volumeDisplaced1: Number,
  buoyantForce1: Number,
  apparentWeight1: Number,

  // Trial 2
  weightInAir2: Number,
  weightInLiquid2: Number,
  volumeDisplaced2: Number,
  buoyantForce2: Number,
  apparentWeight2: Number,

  // Trial 3
  weightInAir3: Number,
  weightInLiquid3: Number,
  volumeDisplaced3: Number,
  buoyantForce3: Number,
  apparentWeight3: Number

}, { timestamps: true });

module.exports = mongoose.model('archimedesExp', archimedesSchema);
