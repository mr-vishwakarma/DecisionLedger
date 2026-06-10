const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyEmail,
  googleAuth,
  githubAuth,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  refreshToken,
  updateCompanyName,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verifyemail/:token', verifyEmail);
router.post('/google', googleAuth);
router.post('/google/callback', googleAuth);
router.post('/github', githubAuth);
router.post('/github/callback', githubAuth);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.patch('/profile/company', protect, updateCompanyName);
router.post('/refresh', refreshToken);
module.exports = router;
