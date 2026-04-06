const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.put('/:id/status', protect, updateTaskStatus);
router.delete('/:id', protect, deleteTask);

module.exports = router;