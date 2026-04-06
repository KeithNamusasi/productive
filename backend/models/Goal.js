const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Goal title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  milestones: [{
    title: String,
    completed: { type: Boolean, default: false },
    targetDate: Date
  }],
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  targetDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', goalSchema);