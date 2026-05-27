const Decision = require('../models/Decision');
const Vote = require('../models/Vote');
const crypto = require('crypto');

// Utility to generate SHA-256 hash
const generateHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// @desc    Create a new decision
// @route   POST /api/decisions
// @access  Private
const createDecision = async (req, res) => {
  try {
    const { title, context, optionsConsidered } = req.body;

    const decision = await Decision.create({
      title,
      context,
      optionsConsidered,
      proposedBy: req.user._id,
      status: 'Pending',
    });

    res.status(201).json(decision);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all decisions
// @route   GET /api/decisions
// @access  Public
const getDecisions = async (req, res) => {
  try {
    const decisions = await Decision.find({}).populate('proposedBy', 'name email avatar').sort({ createdAt: -1 });
    res.json(decisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get decision by ID
// @route   GET /api/decisions/:id
// @access  Public
const getDecisionById = async (req, res) => {
  try {
    const decision = await Decision.findById(req.params.id).populate('proposedBy', 'name email avatar');
    
    if (decision) {
      const votes = await Vote.find({ decision: decision._id }).populate('voter', 'name avatar');
      res.json({ decision, votes });
    } else {
      res.status(404).json({ message: 'Decision not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cast a vote on a decision
// @route   POST /api/decisions/:id/vote
// @access  Private
const castVote = async (req, res) => {
  try {
    const { choice, reasoning } = req.body;
    const decisionId = req.params.id;

    const decision = await Decision.findById(decisionId);

    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    if (decision.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot vote on a finalized decision' });
    }

    const existingVote = await Vote.findOne({ decision: decisionId, voter: req.user._id });

    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted on this decision' });
    }

    const voteDataString = `${decisionId}-${req.user._id}-${choice}-${reasoning}-${Date.now()}`;
    const voteHash = generateHash(voteDataString);

    const vote = await Vote.create({
      decision: decisionId,
      voter: req.user._id,
      choice,
      reasoning,
      voteHash,
    });

    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Finalize a decision and append to the cryptographic ledger
// @route   POST /api/decisions/:id/finalize
// @access  Private
const finalizeDecision = async (req, res) => {
  try {
    const { finalConclusion, status } = req.body; // status can be 'Finalized' or 'Rejected'
    const decisionId = req.params.id;

    const decision = await Decision.findById(decisionId);

    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    if (decision.proposedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Only the proposer can finalize the decision' });
    }

    if (decision.status !== 'Pending') {
      return res.status(400).json({ message: 'Decision is already finalized' });
    }

    const votes = await Vote.find({ decision: decisionId });
    
    // Ledger Hashing Logic (Append-only blockchain simulation)
    // 1. Get the last finalized decision to get its hash
    const lastDecision = await Decision.findOne({ status: { $in: ['Finalized', 'Rejected'] } }).sort({ finalizedAt: -1 });
    const previousHash = lastDecision && lastDecision.ledgerHash ? lastDecision.ledgerHash : '0'; // '0' for genesis block

    // 2. Prepare data for hashing
    const votesHashData = votes.map(v => v.voteHash).join('-');
    const decisionData = `${decision._id}-${finalConclusion}-${status}-${votesHashData}-${previousHash}`;
    const ledgerHash = generateHash(decisionData);

    // 3. Update Decision
    decision.status = status;
    decision.finalConclusion = finalConclusion;
    decision.previousHash = previousHash;
    decision.ledgerHash = ledgerHash;
    decision.finalizedAt = Date.now();

    await decision.save();

    res.json(decision);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDecision,
  getDecisions,
  getDecisionById,
  castVote,
  finalizeDecision,
};
