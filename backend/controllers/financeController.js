const Finance = require('../models/Finance');

const getFinance = async (req, res) => {
  try {
    const finance = await Finance.find({ user: req.user._id }).sort({ date: -1 });
    res.json(finance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createFinance = async (req, res) => {
  try {
    const { type, amount, description, category, date } = req.body;
    
    const finance = await Finance.create({
      user: req.user._id,
      type,
      amount,
      description: description || '',
      category: category || 'other',
      date: date || new Date()
    });
    
    res.status(201).json(finance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteFinance = async (req, res) => {
  try {
    const finance = await Finance.findById(req.params.id);
    
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }
    
    if (finance.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await finance.deleteOne();
    res.json({ message: 'Finance record removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getFinance, createFinance, deleteFinance };