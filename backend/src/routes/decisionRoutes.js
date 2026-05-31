const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const decisionController = require('../controllers/decisionController');

// All routes are protected
router.use(protect);

router.post('/', decisionController.createDecision);
router.get('/', decisionController.getDecisions);
router.get('/:id', decisionController.getDecisionById);
router.post('/:id/vote', decisionController.castVote);
router.post('/:id/finalize', decisionController.finalizeDecision);
router.get('/:id/verify-blockchain', decisionController.verifyDecisionBlockchain);

module.exports = router;
