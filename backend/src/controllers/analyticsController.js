const Decision = require('../models/Decision');
const Vote = require('../models/Vote');
const User = require('../models/User');
const Activity = require('../models/Activity');




const getAnalytics = async (req, res) => {
  try {
    const totalDecisions = await Decision.countDocuments();
    const finalizedDecisions = await Decision.countDocuments({ status: 'finalized' });
    const pendingDecisions = await Decision.countDocuments({ status: 'pending' });

    
    const decisionsWithConsensus = await Decision.find({ consensusPercentage: { $exists: true, $ne: null } });
    let totalConsensus = 0;
    decisionsWithConsensus.forEach(d => {
      totalConsensus += d.consensusPercentage;
    });
    const avgConsensus = decisionsWithConsensus.length > 0 ? (totalConsensus / decisionsWithConsensus.length).toFixed(1) : 0;

    const totalUsers = await User.countDocuments();
    const uniqueVoters = await Vote.distinct('user');
    const participationRate = totalUsers > 0 ? ((uniqueVoters.length / totalUsers) * 100).toFixed(1) : 0;

    res.json({
      totalDecisions,
      finalizedDecisions,
      pendingDecisions,
      avgConsensus,
      participationRate,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getTimeline = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('user', 'name avatar')
      .populate('decision', 'title')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getPublicStats = async (req, res) => {
  try {
    const totalDecisions = await Decision.countDocuments();
    const totalTeams = await User.countDocuments({ role: 'team' }); 
    const totalActiveTeams = await User.countDocuments({ role: 'team', isActive: true }); 
    res.json({ totalDecisions, totalTeams, totalActiveTeams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const globalSearch = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json({ decisions: [], users: [] });
    }
    const regex = new RegExp(query, 'i');
    const decisions = await Decision.find({
      $or: [{ title: regex }, { reasoning: regex }, { tags: regex }]
    }).limit(10);
    const users = await User.find({
      $or: [{ name: regex }, { email: regex }]
    }).select('-password').limit(10);
    res.json({ decisions, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getTimeline,
  getPublicStats,
  globalSearch,
};
