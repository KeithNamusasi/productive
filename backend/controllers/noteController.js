const Note = require('../models/Note');

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ pinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content, tags, pinned } = req.body;
    
    const note = await Note.create({
      user: req.user._id,
      title,
      content: content || '',
      tags: tags || [],
      pinned: pinned || false
    });
    
    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content, tags, pinned } = req.body;
    
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (title) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags) note.tags = tags;
    if (pinned !== undefined) note.pinned = pinned;
    
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };