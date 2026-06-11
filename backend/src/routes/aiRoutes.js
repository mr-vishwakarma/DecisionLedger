const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiController');
const { optionalProtect } = require('../middleware/authMiddleware');


router.post('/chat', optionalProtect, chat);

module.exports = router;

