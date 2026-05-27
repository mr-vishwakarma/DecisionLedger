const express = require('express');
const router = express.Router();
const {
  createDecision,
  getDecisions,
  getDecisionById,
  castVote,
  finalizeDecision,
} = require('../controllers/decisionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getDecisions)
  .post(protect, createDecision);

router.route('/:id')
  .get(getDecisionById);

router.post('/:id/vote', protect, castVote);
router.post('/:id/finalize', protect, finalizeDecision);

module.exports = router;
