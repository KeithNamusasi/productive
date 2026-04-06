const Goal = require('../models/Goal');

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createGoal = async (req, res) => {
  try {
    const { title, description, milestones, progress, targetDate, status } = req.body;
    
    const goal = await Goal.create({
      user: req.user._id,
      title,
      description: description || '',
      milestones: milestones || [],
      progress: progress || 0,
      targetDate: targetDate || null,
      status: status || 'active'
    });
    
    res.status(201).json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGoal = async (req, res) => {
  try {
    const { title, description, milestones, progress, targetDate, status } = req.body;
    
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (title) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (milestones) goal.milestones = milestones;
    if (progress !== undefined) goal.progress = progress;
    if (targetDate !== undefined) goal.targetDate = targetDate;
    if (status) goal.status = status;
    
    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await goal.deleteOne();
    res.json({ message: 'Goal removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal };