const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "std", required: true },
    // expId: { type: mongoose.Schema.Types.ObjectId, ref: "std", required: true },

    exp_no: { type: String, required: true },  // Experiment Number
    exp_title: { type: String, required: true },  // Experiment Title
    grade: { type: Number, required: true, min: 0, max: 15 }, // Grade out of 5
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "tchr", required: true },
     // Fetch from JWT
}, { timestamps: true });

module.exports = mongoose.model('expResult', resultSchema);
