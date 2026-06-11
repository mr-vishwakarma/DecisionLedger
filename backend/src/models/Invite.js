const mongoose = require('mongoose');
const crypto = require('crypto');

const inviteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  inviterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(32).toString('hex')
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) 
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
}, { timestamps: true });


inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Invite', inviteSchema);
