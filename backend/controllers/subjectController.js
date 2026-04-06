const Subject = require('../models/Subject');

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createSubject = async (req, res) => {
  try {
    const { name, color } = req.body;
    
    const subject = await Subject.create({
      user: req.user._id,
      name,
      color: color || '#a855f7'
    });
    
    res.status(201).json(subject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { name, color, grades, currentGrade } = req.body;
    
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    if (subject.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (name) subject.name = name;
    if (color) subject.color = color;
    if (grades) subject.grades = grades;
    if (currentGrade !== undefined) subject.currentGrade = currentGrade;
    
    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    if (subject.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await subject.deleteOne();
    res.json({ message: 'Subject removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };