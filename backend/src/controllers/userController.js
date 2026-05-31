const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Invite a user
// @route   POST /api/users/invite
// @access  Private
const sendEmail = require('../utils/sendEmail');

const inviteUser = async (req, res) => {
  try {
    const { email, role, group } = req.body;
    
    // In a real app, you might save an Invitation document. Here we just send an email.
    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?email=${encodeURIComponent(email)}`;
    const message = `You have been invited to join the DecisionLedger workspace.\n\nRole: ${role || 'Member'}\nGroup: ${group || 'General'}\n\nPlease join using this link:\n${inviteUrl}`;

    await sendEmail({
      email,
      subject: 'Invitation to DecisionLedger',
      message,
    });

    res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send invitation' });
  }
};

module.exports = {
  getUsers,
  inviteUser,
};
