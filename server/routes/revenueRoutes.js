const express = require('express');
const revenueController = require('../controllers/revenueController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.get('/summary', revenueController.getRevenueSummary);
router.get('/chart', revenueController.getRevenueChart);

module.exports = router;
