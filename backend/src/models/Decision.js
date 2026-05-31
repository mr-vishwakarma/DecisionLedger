const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  context: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Finalized', 'Rejected', 'draft', 'review', 'approved', 'rejected'],
    default: 'Pending',
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  proposedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false,  // Optional — users can create personal decisions without a team
  },
  reasoning: {
    type: String,
    default: '',
  },
  optionsConsidered: {
    type: [String],
    default: [],
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  tags: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    default: 'General',
  },
  finalConclusion: {
    type: String,
    default: '',
  },
  ledgerHash: {
    type: String,
    default: '',
  },
  blockchainTxHash: {
    type: String,
    default: '',
  },
  blockchainTimestamp: {
    type: Date,
  },
  blockchainAnchored: {
    type: Boolean,
    default: false,
  },
  votes: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vote: { type: String, enum: ['approve', 'reject', 'abstain'] },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Decision', decisionSchema);

