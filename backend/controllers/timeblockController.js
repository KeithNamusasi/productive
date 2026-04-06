const TimeBlock = require('../models/TimeBlock');

const getTimeBlocks = async (req, res) => {
  try {
    const { date } = req.query;
    let query = { user: req.user._id };
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const timeBlocks = await TimeBlock.find(query).sort({ timeOfDay: 1 });
    res.json(timeBlocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTimeBlock = async (req, res) => {
  try {
    const { title, description, timeOfDay, date, category } = req.body;
    
    const timeBlock = await TimeBlock.create({
      user: req.user._id,
      title,
      description: description || '',
      timeOfDay,
      date: date || new Date(),
      category: category || 'general',
      completed: false
    });
    
    res.status(201).json(timeBlock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTimeBlock = async (req, res) => {
  try {
    const { title, description, timeOfDay, date, category, completed } = req.body;
    
    const timeBlock = await TimeBlock.findById(req.params.id);
    
    if (!timeBlock) {
      return res.status(404).json({ message: 'Time block not found' });
    }
    
    if (timeBlock.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (title) timeBlock.title = title;
    if (description !== undefined) timeBlock.description = description;
    if (timeOfDay) timeBlock.timeOfDay = timeOfDay;
    if (date) timeBlock.date = date;
    if (category) timeBlock.category = category;
    if (completed !== undefined) timeBlock.completed = completed;
    
    const updatedTimeBlock = await timeBlock.save();
    res.json(updatedTimeBlock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTimeBlock = async (req, res) => {
  try {
    const timeBlock = await TimeBlock.findById(req.params.id);
    
    if (!timeBlock) {
      return res.status(404).json({ message: 'Time block not found' });
    }
    
    if (timeBlock.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await timeBlock.deleteOne();
    res.json({ message: 'Time block removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTimeBlocks, createTimeBlock, updateTimeBlock, deleteTimeBlock };