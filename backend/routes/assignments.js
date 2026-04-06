const express = require('express');
const router = express.Router();
const { getAssignments, createAssignment, updateAssignment, deleteAssignment } = require('../controllers/assignmentController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAssignments);
router.post('/', protect, createAssignment);
router.put('/:id', protect, updateAssignment);
router.delete('/:id', protect, deleteAssignment);

module.exports = router;