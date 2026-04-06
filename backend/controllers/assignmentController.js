const Assignment = require('../models/Assignment');

const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ user: req.user._id })
      .populate('subject', 'name color')
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createAssignment = async (req, res) => {
  try {
    const { subject, title, description, dueDate, status, grade, priority } = req.body;
    
    const assignment = await Assignment.create({
      user: req.user._id,
      subject,
      title,
      description: description || '',
      dueDate,
      status: status || 'pending',
      grade: grade || null,
      priority: priority || 'medium'
    });
    
    const populatedAssignment = await Assignment.findById(assignment._id).populate('subject', 'name color');
    res.status(201).json(populatedAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { subject, title, description, dueDate, status, grade, priority } = req.body;
    
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    if (assignment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (subject) assignment.subject = subject;
    if (title) assignment.title = title;
    if (description !== undefined) assignment.description = description;
    if (dueDate) assignment.dueDate = dueDate;
    if (status) assignment.status = status;
    if (grade !== undefined) assignment.grade = grade;
    if (priority) assignment.priority = priority;
    
    const updatedAssignment = await assignment.save();
    const populatedAssignment = await Assignment.findById(updatedAssignment._id).populate('subject', 'name color');
    res.json(populatedAssignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    if (assignment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await assignment.deleteOne();
    res.json({ message: 'Assignment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAssignments, createAssignment, updateAssignment, deleteAssignment };