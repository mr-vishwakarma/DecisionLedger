const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiController');
const { optionalProtect } = require('../middleware/authMiddleware');

// POST /api/ai/chat - Open to all users (even not logged in), populates req.user if logged in
router.post('/chat', optionalProtect, chat);

module.exports = router;

