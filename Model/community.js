const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  communityName: { type: String, required: true, unique: true }, // Ensuring uniqueness
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "tchr", required: true },
  
  commDescription: { type: String, required: true }, 
  role: { type: String, enum: ['std', 'tchr'], required: true }, 
  users: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      role: { type: String, enum: ['std', 'tchr'], required: true } // Now properly included
    }
  ],
  
  messages: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType'
      },
      userType: {
        type: String,
        required: true,
        enum: ['std', 'tchr']
      },
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],

  totalUsers: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Community', communitySchema);
