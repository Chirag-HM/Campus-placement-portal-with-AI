import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { handleLoginStreak } from '../services/gamificationService.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    console.log(`📝 Registering user: ${email}, role: ${role}`);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`⚠️ User already exists: ${email}`);
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    console.log(`✅ User registered successfully: ${user._id}`);
    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const streakResult = await handleLoginStreak(user._id);
    res.json({ user, token, streakResult });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const googleCallback = (req, res) => {
  try {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?error=auth_failed`);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -__v')
      .populate('learningPath');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const streakResult = await handleLoginStreak(user._id);
    res.json({ user, streakResult });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
