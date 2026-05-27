const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    decision: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Decision',
      required: true,
    },
    voter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    choice: {
      type: String,
      enum: ['Agree', 'Disagree', 'Neutral'],
      required: true,
    },
    reasoning: {
      type: String,
      default: '',
    },
    // The hash of this specific vote, to ensure it wasn't tampered with
    voteHash: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a user from voting twice on the same decision
voteSchema.index({ decision: 1, voter: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
