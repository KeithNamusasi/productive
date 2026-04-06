const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  totalPages: {
    type: Number,
    required: true,
    min: 1
  },
  currentPage: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['backlog', 'reading', 'done'],
    default: 'backlog'
  },
  notes: {
    type: String,
    default: ''
  },
  readingStreak: {
    type: Number,
    default: 0
  },
  lastReadDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);