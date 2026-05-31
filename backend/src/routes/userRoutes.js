const express = require('express');
const router = express.Router();
const { getUsers, inviteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUsers);
router.post('/invite', protect, inviteUser);

module.exports = router;
