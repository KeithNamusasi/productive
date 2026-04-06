const express = require('express');
const router = express.Router();
const { getHabits, createHabit, toggleHabit, resetDailyHabits, deleteHabit } = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getHabits);
router.post('/', protect, createHabit);
router.put('/:id/toggle', protect, toggleHabit);
router.post('/reset', protect, resetDailyHabits);
router.delete('/:id', protect, deleteHabit);

module.exports = router;