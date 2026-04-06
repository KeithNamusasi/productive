const express = require('express');
const router = express.Router();
const { getFinance, createFinance, deleteFinance } = require('../controllers/financeController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFinance);
router.post('/', protect, createFinance);
router.delete('/:id', protect, deleteFinance);

module.exports = router;