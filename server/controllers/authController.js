import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const googleCallback = (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?error=auth_failed`);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-__v')
      .populate('learningPath');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
