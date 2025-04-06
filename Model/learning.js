const mongoose = require('mongoose');

const learningMaterialSchema = new mongoose.Schema({
  title: String,
  exp_no:{
    type: String,
    required: true,
  },
  file: { type: Buffer, required: true }, // Stores the file as binary data
fileSize:{type:String,required:true},
  fileId: { type: mongoose.Schema.Types.ObjectId, required: false }, // Stores GridFS file ID
  fileType: { type: String, enum: ['pdf', 'video','image'], required: true }, // File type indicator
  teacherEmail: { type: String,required:true },
  assignedTo: { type: String, enum: ['all', 'class'], required: true },
  className: { type: String, default: null }, // Make className optional

  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: false }
}, { timestamps: true });

const LearningMaterial = mongoose.model('learning', learningMaterialSchema);
module.exports = LearningMaterial;
