const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stageProgress: {
    basic: { type: Number, default: 0 },
    intermediate: { type: Number, default: 0 },
    advanced: { type: Number, default: 0 },
    practice: { type: Number, default: 0 }
  },
  projectProgress: [{
    projectId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    completedAt: { type: Date }
  }],
  totalScore: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);