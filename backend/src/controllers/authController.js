import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { seedSampleUserData } from '../utils/seedData.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'dev_secret_jwt_key_only_for_local_testing',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Please set the MONGODB_URI environment variable in your Vercel Project Settings.',
      });
    }

    const { name, email, password, currency, currencySymbol } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      currency: currency || 'INR',
      currencySymbol: currencySymbol || '₹',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        currencySymbol: user.currencySymbol,
        monthlyBudget: user.monthlyBudget,
        occupation: user.occupation,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Please set the MONGODB_URI environment variable in your Vercel Project Settings, or try 1-Click Guest Demo Mode.',
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        currencySymbol: user.currencySymbol,
        monthlyBudget: user.monthlyBudget,
        occupation: user.occupation,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        currencySymbol: user.currencySymbol,
        monthlyBudget: user.monthlyBudget,
        occupation: user.occupation,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, currency, currencySymbol, monthlyBudget, occupation } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (currency) user.currency = currency;
    if (currencySymbol) user.currencySymbol = currencySymbol;
    if (monthlyBudget !== undefined) user.monthlyBudget = Number(monthlyBudget);
    if (occupation) user.occupation = occupation;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        currencySymbol: user.currencySymbol,
        monthlyBudget: user.monthlyBudget,
        occupation: user.occupation,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Demo Guest Login for quick testing
// @route   POST /api/auth/demo
// @access  Public
export const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'alex.morgan@spendmate.ai';
    const dummyId = '507f191e810c19729de860ea';

    // If MongoDB is not connected in serverless/offline, return standalone demo session immediately
    if (mongoose.connection.readyState !== 1) {
      const token = generateToken(dummyId);
      return res.json({
        success: true,
        token,
        user: {
          id: dummyId,
          name: 'Alex Morgan',
          email: demoEmail,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          currency: 'INR',
          currencySymbol: '₹',
          monthlyBudget: 70000,
          occupation: 'Senior Product Designer',
          isDemo: true,
        },
      });
    }

    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: 'Alex Morgan',
        email: demoEmail,
        password: process.env.DEMO_USER_PASSWORD || 'SpendMateDemo2026!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        currency: 'INR',
        currencySymbol: '₹',
        monthlyBudget: 70000,
        occupation: 'Senior Product Designer',
      });
    }

    // Ensure demo user has fresh rich sample data
    const txCount = await Transaction.countDocuments({ userId: user._id });
    if (txCount === 0) {
      await seedSampleUserData(user._id);
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        currency: user.currency,
        currencySymbol: user.currencySymbol,
        monthlyBudget: user.monthlyBudget || 70000,
        occupation: user.occupation,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
