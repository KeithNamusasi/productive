const Habit = require('../models/Habit');

const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createHabit = async (req, res) => {
  try {
    const { name, color } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const habit = await Habit.create({
      user: req.user._id,
      name,
      color: color || '#6366f1',
      completedToday: false,
      streak: 0,
      lastCompleted: null
    });
    
    res.status(201).json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const toggleHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
    if (lastCompleted) {
      lastCompleted.setHours(0, 0, 0, 0);
    }
    
    if (habit.completedToday) {
      habit.completedToday = false;
      if (lastCompleted && lastCompleted.getTime() === today.getTime() - 86400000) {
        habit.streak = Math.max(0, habit.streak - 1);
      }
    } else {
      habit.completedToday = true;
      if (lastCompleted && lastCompleted.getTime() === today.getTime() - 86400000) {
        habit.streak += 1;
      } else if (!lastCompleted || lastCompleted.getTime() < today.getTime() - 86400000) {
        habit.streak = 1;
      }
      habit.lastCompleted = new Date();
    }
    
    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetDailyHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const habit of habits) {
      if (habit.lastCompleted) {
        const lastCompleted = new Date(habit.lastCompleted);
        lastCompleted.setHours(0, 0, 0, 0);
        
        if (lastCompleted.getTime() !== today.getTime()) {
          habit.completedToday = false;
          await habit.save();
        }
      }
    }
    
    res.json({ message: 'Habits reset for new day' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await habit.deleteOne();
    res.json({ message: 'Habit removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getHabits, createHabit, toggleHabit, resetDailyHabits, deleteHabit };