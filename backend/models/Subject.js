const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  color: {
    type: String,
    default: '#a855f7'
  },
  grades: [{
    name: String,
    score: Number,
    weight: Number,
    date: Date
  }],
  currentGrade: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);