const Decision = require('../models/Decision');
const blockchainService = require('../services/blockchainService');
const Activity = require('../models/Activity');


exports.createDecision = async (req, res) => {
  try {
    console.log('createDecision API called. Body:', req.body, 'User:', req.user);
    const { title, context, reasoning, optionsConsidered, priority, tags, category, teamId } = req.body;
    
    // Validate required fields
    if (!title || !context) {
      return res.status(400).json({ message: 'Title and context are required' });
    }

    const decisionData = {
      title,
      context,
      reasoning,
      optionsConsidered,
      priority,
      tags,
      category,
      creatorId: req.user._id,
      proposedBy: req.user._id, // Set both for backward compatibility
      status: 'draft',
      votes: []
    };

    // Only set teamId if a valid one was provided
    if (teamId) {
      decisionData.teamId = teamId;
    }

    await decision.save();
    console.log('Decision successfully saved in DB:', decision);
    
    try {
      await Activity.create({
        user: req.user._id,
        action: 'CREATED_DECISION',
        decision: decision._id,
        details: `${req.user.name} proposed decision: "${title}"`
      });
    } catch (actErr) {
      console.error('Failed to create activity log:', actErr);
    }

    res.status(201).json(decision);
  } catch (error) {
    console.error('Error creating decision in controller:', error);
    res.status(500).json({ message: error.message || 'Failed to create decision' });
  }
};

exports.getDecisions = async (req, res) => {
  try {
    const decisions = await Decision.find({ 
      $or: [
        { creatorId: req.user._id },
        { proposedBy: req.user._id },
        { 'votes.userId': req.user._id }
        // Note: Would add team check here once teams are fully implemented
      ]
    })
      .populate('creatorId', 'name email avatar')
      .populate('proposedBy', 'name email avatar')
      .sort({ createdAt: -1 });

    const mappedDecisions = decisions.map(d => {
      const obj = d.toObject();
      const proposer = obj.proposedBy || obj.creatorId;
      obj.proposedBy = proposer;
      obj.creatorId = obj.creatorId || proposer;
      return obj;
    });
    
    res.json(mappedDecisions);
  } catch (error) {
    console.error('Error fetching decisions:', error);
    res.status(500).json({ message: 'Failed to fetch decisions' });
  }
};

exports.getDecisionById = async (req, res) => {
  try {
    const decision = await Decision.findById(req.params.id)
      .populate('creatorId', 'name email avatar')
      .populate('proposedBy', 'name email avatar')
      .populate('votes.userId', 'name email avatar');
      
    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }
    
    const proposer = decision.proposedBy || decision.creatorId;
    const responseData = {
      decision: {
        ...decision.toObject(),
        proposedBy: proposer,
        creatorId: decision.creatorId || proposer
      },
      votes: (decision.votes || []).map(v => ({
        voter: v.userId || { name: 'Unknown User', email: '' },
        choice: v.vote === 'approve' ? 'Agree' : v.vote === 'reject' ? 'Disagree' : 'Abstain',
        reasoning: v.comment || '',
        createdAt: v.createdAt
      }))
    };
    
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching decision:', error);
    res.status(500).json({ message: 'Failed to fetch decision' });
  }
};

exports.castVote = async (req, res) => {
  try {
    let { vote, comment, choice, reasoning } = req.body;
    
    // Map choice (Agree/Disagree/Abstain) to vote (approve/reject/abstain)
    if (choice) {
      if (choice === 'Agree') vote = 'approve';
      else if (choice === 'Disagree') vote = 'reject';
      else if (choice === 'Abstain') vote = 'abstain';
    }
    if (reasoning !== undefined && comment === undefined) {
      comment = reasoning;
    }

    const decisionId = req.params.id;
    const userId = req.user._id;

    if (!['approve', 'reject', 'abstain'].includes(vote)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const decision = await Decision.findById(decisionId);
    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    // Check if user already voted
    const existingVoteIndex = decision.votes.findIndex(v => v.userId.toString() === userId.toString());
    
    if (existingVoteIndex >= 0) {
      // Update existing vote
      decision.votes[existingVoteIndex].vote = vote;
      if (comment !== undefined) decision.votes[existingVoteIndex].comment = comment;
      decision.votes[existingVoteIndex].createdAt = Date.now();
    } else {
      // Add new vote
      decision.votes.push({
        userId,
        vote,
        comment,
        createdAt: Date.now()
      });
    }

    await decision.save();
    
    try {
      await Activity.create({
        user: userId,
        action: 'VOTED',
        decision: decisionId,
        details: `${req.user.name} cast a vote (${vote}) on "${decision.title}"`
      });
    } catch (actErr) {
      console.error('Failed to create activity log for vote:', actErr);
    }
    
    const updatedDecision = await Decision.findById(decisionId)
      .populate('creatorId', 'name email avatar')
      .populate('proposedBy', 'name email avatar')
      .populate('votes.userId', 'name email avatar');

    const proposer = updatedDecision.proposedBy || updatedDecision.creatorId;
    const responseData = {
      decision: {
        ...updatedDecision.toObject(),
        proposedBy: proposer,
        creatorId: updatedDecision.creatorId || proposer
      },
      votes: (updatedDecision.votes || []).map(v => ({
        voter: v.userId || { name: 'Unknown User', email: '' },
        choice: v.vote === 'approve' ? 'Agree' : v.vote === 'reject' ? 'Disagree' : 'Abstain',
        reasoning: v.comment || '',
        createdAt: v.createdAt
      }))
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error casting vote:', error);
    res.status(500).json({ message: 'Failed to cast vote' });
  }
};

exports.finalizeDecision = async (req, res) => {
  try {
    const { status, finalConclusion } = req.body;
    const decisionId = req.params.id;
    const userId = req.user._id;

    if (!['Finalized', 'Rejected', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid finalization status' });
    }

    const decision = await Decision.findById(decisionId);
    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    // Verify user is the proposer
    const proposerId = decision.proposedBy || decision.creatorId;
    if (!proposerId || proposerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only the proposer can finalize this decision' });
    }

    decision.status = status;
    decision.finalConclusion = finalConclusion;
    
    // Generate a cryptographic ledger hash (mocking the blockchain/ledger commit)
    const crypto = require('crypto');
    const hashInput = `${decisionId}-${JSON.stringify(decision.votes)}-${finalConclusion}-${Date.now()}`;
    decision.ledgerHash = crypto.createHash('sha256').update(hashInput).digest('hex');

    await decision.save();

    try {
      await Activity.create({
        user: userId,
        action: 'FINALIZED_DECISION',
        decision: decisionId,
        details: `${req.user.name} finalized decision "${decision.title}" as: ${status}`,
        ledgerHash: decision.ledgerHash
      });
    } catch (actErr) {
      console.error('Failed to create activity log for finalization:', actErr);
    }

    // Anchor to blockchain asynchronously (to prevent blocking response, but update DB upon completion)
    blockchainService.anchorRecord("Decision", decisionId, decision.ledgerHash).then(async (receipt) => {
      if (receipt) {
        await Decision.findByIdAndUpdate(decisionId, {
          blockchainTxHash: receipt.txHash,
          blockchainTimestamp: receipt.timestamp,
          blockchainAnchored: true
        });
        console.log(`Decision ${decisionId} successfully anchored to blockchain: ${receipt.txHash}`);
      }
    }).catch(err => {
      console.error("Failed asynchronous blockchain anchoring:", err);
    });

    const updatedDecision = await Decision.findById(decisionId)
      .populate('creatorId', 'name email avatar')
      .populate('proposedBy', 'name email avatar')
      .populate('votes.userId', 'name email avatar');

    const proposer = updatedDecision.proposedBy || updatedDecision.creatorId;
    const responseData = {
      decision: {
        ...updatedDecision.toObject(),
        proposedBy: proposer,
        creatorId: updatedDecision.creatorId || proposer
      },
      votes: (updatedDecision.votes || []).map(v => ({
        voter: v.userId || { name: 'Unknown User', email: '' },
        choice: v.vote === 'approve' ? 'Agree' : v.vote === 'reject' ? 'Disagree' : 'Abstain',
        reasoning: v.comment || '',
        createdAt: v.createdAt
      }))
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error finalizing decision:', error);
    res.status(500).json({ message: 'Failed to finalize decision' });
  }
};

exports.verifyDecisionBlockchain = async (req, res) => {
  try {
    const decisionId = req.params.id;
    const decision = await Decision.findById(decisionId);
    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    if (!decision.blockchainAnchored) {
      return res.json({ verified: false, reason: "Decision is not anchored on the blockchain yet." });
    }

    const onChainHash = await blockchainService.getDecisionHashOnChain(decisionId);
    if (!onChainHash) {
      return res.json({ verified: false, reason: "No matching hash found on-chain." });
    }

    const isMatch = onChainHash === decision.ledgerHash;
    res.json({
      verified: isMatch,
      localHash: decision.ledgerHash,
      onChainHash: onChainHash,
      txHash: decision.blockchainTxHash,
      timestamp: decision.blockchainTimestamp
    });
  } catch (error) {
    console.error('Error verifying blockchain decision:', error);
    res.status(500).json({ message: 'Verification failed' });
  }
};
