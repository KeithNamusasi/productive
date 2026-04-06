import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaThumbtack, FaSearch, FaStickyNote } from 'react-icons/fa';
import { notesAPI } from '../../services/api';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await notesAPI.getAll();
      setNotes(res.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const noteData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      
      if (editingNote) {
        await notesAPI.update(editingNote._id, noteData);
      } else {
        await notesAPI.create(noteData);
      }
      fetchNotes();
      closeModal();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.delete(id);
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const togglePin = async (note) => {
    try {
      await notesAPI.update(note._id, { pinned: !note.pinned });
      fetchNotes();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content || '',
      tags: note.tags?.join(', ') || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setFormData({ title: '', content: '', tags: '' });
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.pinned);

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
          <h1 className="text-3xl font-bold">Quick Notes</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Capture your thoughts</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FaPlus className="mr-2" /> New Note
        </button>
      </div>

      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {pinnedNotes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaThumbtack className="text-[#6366f1]" /> Pinned Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {pinnedNotes.map(note => (
              <motion.div
                key={note._id}
                layout
                className="card cursor-pointer"
                whileHover={{ y: -2 }}
                onClick={() => openEditModal(note)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{note.title}</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePin(note); }}
                    className="text-[#6366f1]"
                  >
                    <FaThumbtack className="text-sm" />
                  </button>
                </div>
                <div 
                  className="text-sm mb-3 line-clamp-3"
                  style={{ color: 'var(--text-secondary)' }}
                  dangerouslySetInnerHTML={{ __html: note.content?.replace(/<[^>]*>/g, '').slice(0, 100) || '' }}
                />
                {note.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#6366f1' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3 pt-3 flex justify-end gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditModal(note); }}
                    className="text-gray-400 hover:text-[#6366f1]"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(note._id); }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-4">All Notes ({unpinnedNotes.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unpinnedNotes.map(note => (
            <motion.div
              key={note._id}
              layout
              className="card cursor-pointer"
              whileHover={{ y: -2 }}
              onClick={() => openEditModal(note)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{note.title}</h3>
                <button
                  onClick={(e) => { e.stopPropagation(); togglePin(note); }}
                  className="text-gray-400 hover:text-[#6366f1]"
                >
                  <FaThumbtack className="text-sm" />
                </button>
              </div>
              <div 
                className="text-sm mb-3 line-clamp-3"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: note.content?.replace(/<[^>]*>/g, '').slice(0, 100) || '' }}
              />
              {note.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#6366f1' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 pt-3 flex justify-end gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); openEditModal(note); }}
                  className="text-gray-400 hover:text-[#6366f1]"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(note._id); }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
          {unpinnedNotes.length === 0 && (
            <div className="col-span-full text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              No notes yet. Create your first note!
            </div>
          )}
        </div>
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
              className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">{editingNote ? 'Edit Note' : 'New Note'}</h2>
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
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="input-field h-40 resize-none"
                    placeholder="Write your note here..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="input-field"
                    placeholder="work, ideas, personal"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingNote ? 'Update' : 'Save'}
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

export default Notes;