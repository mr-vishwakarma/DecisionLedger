const express = require('express');
const router = express.Router();
const { getAnalytics, getTimeline, globalSearch } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAnalytics);
router.get('/timeline', protect, getTimeline);
router.get('/search', protect, globalSearch);

module.exports = router;
