const Invite = require('../models/Invite');
const crypto = require('crypto');

exports.createInvite = async (req, res) => {
  try {
    const { email, role, teamId } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if invite already exists for this email
    const existingInvite = await Invite.findOne({ email: email.toLowerCase(), teamId });
    if (existingInvite) {
      return res.status(400).json({ message: 'An invite is already pending for this email in this team' });
    }

    const invite = new Invite({
      email: email.toLowerCase(),
      teamId: teamId || req.user._id, // Fallback if team logic not fully implemented
      inviterId: req.user._id,
      role: role || 'member'
    });

    const inviteHashData = JSON.stringify({
      email: invite.email,
      teamId: invite.teamId.toString(),
      inviterId: invite.inviterId.toString(),
      role: invite.role,
      token: invite.token,
      expiresAt: invite.expiresAt.toISOString()
    });
    invite.ledgerHash = crypto.createHash('sha256').update(inviteHashData).digest('hex');

    await invite.save();

    const blockchainService = require('../services/blockchainService');
    blockchainService.anchorRecord("Invite", invite._id.toString(), invite.ledgerHash).then(async (receipt) => {
      if (receipt) {
        await Invite.findByIdAndUpdate(invite._id, {
          blockchainTxHash: receipt.txHash,
          blockchainTimestamp: receipt.timestamp,
          blockchainAnchored: true
        });
      }
    }).catch(err => console.error("Blockchain anchoring error for Invite:", err));

    // Since we are not integrating a real email provider (like SendGrid or Nodemailer) yet,
    // we will just return the invite link in the response for the UI to display.
    const inviteLink = `http://localhost:5173/register?invite=${invite.token}`;

    res.status(201).json({
      message: 'Invite created successfully',
      inviteLink,
      invite
    });
  } catch (error) {
    console.error('Error creating invite:', error);
    res.status(500).json({ message: 'Failed to create invite' });
  }
};

exports.getPendingInvites = async (req, res) => {
  try {
    // Return invites created by this user
    const invites = await Invite.find({ inviterId: req.user._id }).sort({ createdAt: -1 });
    res.json(invites);
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ message: 'Failed to fetch pending invites' });
  }
};
