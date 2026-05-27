const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    context: {
      type: String,
      required: true,
    },
    optionsConsidered: {
      type: [String],
      default: [],
    },
    proposedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Finalized', 'Rejected'],
      default: 'Pending',
    },
    finalConclusion: {
      type: String,
      default: '',
    },
    // The cryptographic hash linking this decision to the previous one (append-only ledger concept)
    previousHash: {
      type: String,
      default: '0',
    },
    // The cryptographic hash of this finalized decision + all votes
    ledgerHash: {
      type: String,
      default: null,
    },
    finalizedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Decision = mongoose.model('Decision', decisionSchema);

module.exports = Decision;
