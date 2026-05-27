const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyEmail,
  googleAuth,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verifyemail/:token', verifyEmail);
router.post('/google', googleAuth);
router.get('/profile', protect, getUserProfile);

module.exports = router;
