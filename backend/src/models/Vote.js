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
    
    voteHash: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


voteSchema.index({ decision: 1, voter: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;
