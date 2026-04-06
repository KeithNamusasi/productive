const express = require('express');
const router = express.Router();
const { getTimeBlocks, createTimeBlock, updateTimeBlock, deleteTimeBlock } = require('../controllers/timeblockController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getTimeBlocks);
router.post('/', protect, createTimeBlock);
router.put('/:id', protect, updateTimeBlock);
router.delete('/:id', protect, deleteTimeBlock);

module.exports = router;