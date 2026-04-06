const mongoose = require('mongoose');

const timeBlockSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Time block title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: 'general'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TimeBlock', timeBlockSchema);