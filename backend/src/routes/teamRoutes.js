const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const teamController = require('../controllers/teamController');

// All routes are protected
router.use(protect);

router.post('/invite', teamController.createInvite);
router.get('/invites', teamController.getPendingInvites);

module.exports = router;
