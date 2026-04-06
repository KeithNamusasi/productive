import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaBook, FaTrash, FaEdit, FaCheck, FaFire } from 'react-icons/fa';
import { booksAPI } from '../../services/api';
import { format } from 'date-fns';

const Reading = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    currentPage: '',
    status: 'backlog',
    notes: '',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await booksAPI.getAll();
      setBooks(res.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await booksAPI.update(editingBook._id, {
          ...formData,
          totalPages: parseInt(formData.totalPages),
          currentPage: parseInt(formData.currentPage) || 0,
        });
      } else {
        await booksAPI.create({
          ...formData,
          totalPages: parseInt(formData.totalPages),
          currentPage: parseInt(formData.currentPage) || 0,
        });
      }
      fetchBooks();
      closeModal();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await booksAPI.delete(id);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      totalPages: book.totalPages.toString(),
      currentPage: book.currentPage.toString(),
      status: book.status,
      notes: book.notes || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      totalPages: '',
      currentPage: '',
      status: 'backlog',
      notes: '',
    });
  };

  const updateProgress = async (book, newPage) => {
    try {
      await booksAPI.update(book._id, { currentPage: newPage });
      fetchBooks();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const booksByStatus = {
    reading: books.filter(b => b.status === 'reading'),
    backlog: books.filter(b => b.status === 'backlog'),
    done: books.filter(b => b.status === 'done'),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reading Tracker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your reading journey</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FaPlus className="mr-2" /> Add Book
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['reading', 'backlog', 'done'].map((status) => (
          <div key={status} className="card">
            <h3 className="text-lg font-semibold mb-4 capitalize flex items-center gap-2">
              <FaBook className={`text-${
                status === 'reading' ? '[#10b981]' : 
                status === 'done' ? '[#6366f1]' : '[#a0a0a0]'
              }`} />
              {status === 'reading' ? 'Currently Reading' : status}
              <span className="text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
                ({booksByStatus[status].length})
              </span>
            </h3>
            <div className="space-y-4">
              {booksByStatus[status].map(book => (
                <motion.div
                  key={book._id}
                  layout
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-secondary)' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{book.title}</h4>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{book.author}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(book)} className="text-gray-400 hover:text-[#6366f1]">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(book._id)} className="text-gray-400 hover:text-red-500">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  {status !== 'done' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Page {book.currentPage} of {book.totalPages}</span>
                        <span>{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#333] overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#10b981]"
                          style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={book.totalPages}
                        value={book.currentPage}
                        onChange={(e) => updateProgress(book, parseInt(e.target.value))}
                        className="w-full mt-2 accent-[#10b981]"
                      />
                    </div>
                  )}

                  {book.readingStreak > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-orange-500">
                      <FaFire /> {book.readingStreak} day streak
                    </div>
                  )}

                  {book.notes && (
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {book.notes}
                    </p>
                  )}
                </motion.div>
              ))}
              {booksByStatus[status].length === 0 && (
                <p className="text-center py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No books in {status}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="card w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Pages</label>
                    <input
                      type="number"
                      value={formData.totalPages}
                      onChange={(e) => setFormData({ ...formData, totalPages: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Page</label>
                    <input
                      type="number"
                      value={formData.currentPage}
                      onChange={(e) => setFormData({ ...formData, currentPage: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="reading">Reading</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field h-24 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingBook ? 'Update' : 'Add Book'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reading;