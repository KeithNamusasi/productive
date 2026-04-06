const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Habit name is required'],
    trim: true
  },
  completedToday: {
    type: Boolean,
    default: false
  },
  streak: {
    type: Number,
    default: 0
  },
  lastCompleted: {
    type: Date,
    default: null
  },
  color: {
    type: String,
    default: '#6366f1'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Habit', habitSchema);