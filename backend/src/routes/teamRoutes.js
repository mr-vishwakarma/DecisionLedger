const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const teamController = require('../controllers/teamController');


router.use(protect);

router.post('/invite', teamController.createInvite);
router.get('/invites', teamController.getPendingInvites);

module.exports = router;
