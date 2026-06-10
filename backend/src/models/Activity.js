const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['CREATED_DECISION', 'VOTED', 'FINALIZED_DECISION', 'COMMENTED'],
    },
    decision: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Decision',
      required: true,
    },
    details: {
      type: String, // e.g., "Sarah voted on Q3 Expansion"
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
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
