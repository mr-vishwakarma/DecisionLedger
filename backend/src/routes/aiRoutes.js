const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiController');

// POST /api/ai/chat - Open to all users (even not logged in)
router.post('/chat', chat);

module.exports = router;
