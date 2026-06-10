const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Send verification email
      const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
      
      // Usually, you'd have a frontend URL here. Since we're doing local testing with postman, we'll return the token or log it.
      const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verifyemail/${verificationToken}`;
      
      const message = `Please confirm your email by clicking the following link: \n\n ${verifyUrl}`;
      
      try {
        await sendEmail({
          email: user.email,
          subject: 'Email Verification',
          message,
        });
      } catch (error) {
        console.error('Email could not be sent', error);
        // We continue anyway so the user can be returned, in production you might want to handle this differently
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Email
// @route   GET /api/auth/verifyemail/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isEmailVerified = true;
    await user.save();
    
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// @desc    Google OAuth Callback / Login
// @route   POST /api/auth/google
// @access  Public
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify the token securely with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatar, email_verified } = payload;
    
    if (!email_verified) {
      return res.status(400).json({ message: 'Google email is not verified' });
    }

    let user = await User.findOne({ email });
    
    if (user) {
      // User exists, just log them in
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = avatar;
        user.isEmailVerified = true;
        await user.save();
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        isEmailVerified: true,
      });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    }
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};

// @desc    GitHub OAuth Callback / Login
// @route   POST /api/auth/github
// @access  Public
const githubAuth = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Authorization code missing' });
    }

    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ message: tokenData.error_description || 'Failed to authenticate with GitHub' });
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch user profile from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = await userResponse.json();

    // 3. Fetch user emails from GitHub (primary email might not be public)
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const emails = await emailsResponse.json();
    const primaryEmailObj = emails.find((e) => e.primary) || emails[0];

    if (!primaryEmailObj || !primaryEmailObj.email) {
      return res.status(400).json({ message: 'No email found on GitHub account' });
    }

    const email = primaryEmailObj.email;
    const googleId = undefined;
    const githubId = githubUser.id.toString();
    const avatar = githubUser.avatar_url;
    const name = githubUser.name || githubUser.login;

    let user = await User.findOne({ email });

    if (user) {
      // User exists, log them in & link github if not linked
      if (!user.githubId) {
        user.githubId = githubId;
        if (!user.avatar) user.avatar = avatar; // Only overwrite if no avatar
        user.isEmailVerified = true;
        await user.save();
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        githubId,
        avatar,
        isEmailVerified: true, // Trusted from GitHub
      });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        accessToken: generateAccessToken(user._id),
        refreshToken: generateRefreshToken(user._id),
      });
    }
  } catch (error) {
    console.error('GitHub Auth Error:', error);
    res.status(500).json({ message: 'Server Error during GitHub Authentication' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        companyName: user.companyName,
        avatar: user.avatar,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '15m' });
    
    // In production, use the actual frontend URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please go to this link to reset your password: \n\n ${resetUrl}`;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });
      res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.params.token;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const secret = process.env.REFRESH_TOKEN_SECRET || (process.env.JWT_SECRET ? process.env.JWT_SECRET + '_refresh' : 'fallback_refresh_secret');
    
    const decoded = jwt.verify(refreshToken, secret);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const accessToken = generateAccessToken(user._id);
    
    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.avatar = req.body.avatar || user.avatar;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isEmailVerified: updatedUser.isEmailVerified,
        avatar: updatedUser.avatar,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Update Company Name
// @route   PATCH /api/auth/profile/company
// @access  Private
const updateCompanyName = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { companyName } = req.body;
    if (typeof companyName !== 'string' || !companyName.trim()) {
      return res.status(400).json({ message: 'Valid companyName is required' });
    }
    user.companyName = companyName.trim();
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      avatar: user.avatar,
      companyName: user.companyName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
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
};

