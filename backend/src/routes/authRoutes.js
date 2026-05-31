const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyEmail,
  googleAuth,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  refreshToken,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verifyemail/:token', verifyEmail);
router.post('/google', googleAuth);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh', refreshToken);

module.exports = router;
