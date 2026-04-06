const Book = require('../models/Book');

const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, totalPages, status, notes } = req.body;
    
    const book = await Book.create({
      user: req.user._id,
      title,
      author,
      totalPages,
      status: status || 'backlog',
      notes: notes || ''
    });
    
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, totalPages, currentPage, status, notes, readingStreak, lastReadDate } = req.body;
    
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (title) book.title = title;
    if (author) book.author = author;
    if (totalPages) book.totalPages = totalPages;
    if (currentPage !== undefined) book.currentPage = currentPage;
    if (status) book.status = status;
    if (notes !== undefined) book.notes = notes;
    if (readingStreak !== undefined) book.readingStreak = readingStreak;
    if (lastReadDate) book.lastReadDate = lastReadDate;
    
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getBooks, createBook, updateBook, deleteBook };