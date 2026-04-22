import User from '../models/User.js';
import Job from '../models/Job.js';
import InterviewSession from '../models/InterviewSession.js';

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = ['college', 'branch', 'graduationYear', 'cgpa', 'phone', 'skills', 'linkedIn', 'github', 'portfolio'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!['student', 'recruiter', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { role } = req.user;

    if (role === 'student') {
      const user = await User.findById(req.user._id);
      const appliedCount = user.appliedJobs?.length || 0;
      const latestScore = user.resume?.analysisHistory?.length > 0
        ? user.resume.analysisHistory[user.resume.analysisHistory.length - 1].matchScore : null;
      const interviewCount = user.interviewHistory?.length || 0;
      const avgInterviewScore = interviewCount > 0
        ? Math.round(user.interviewHistory.reduce((s, i) => s + i.totalScore, 0) / interviewCount) : 0;

      return res.json({
        appliedCount, latestResumeScore: latestScore,
        interviewCount, avgInterviewScore,
        hasResume: !!user.resume?.url,
        hasLearningPath: !!user.learningPath,
      });
    }

    if (role === 'recruiter') {
      const jobs = await Job.find({ postedBy: req.user._id });
      const totalApplicants = jobs.reduce((sum, j) => sum + j.applications.length, 0);
      const shortlisted = jobs.reduce((sum, j) => sum + j.applications.filter(a => a.status === 'shortlisted').length, 0);
      return res.json({
        postedJobs: jobs.length, totalApplicants, shortlisted,
        pendingReview: totalApplicants - shortlisted,
      });
    }

    if (role === 'admin') {
      const [totalStudents, totalRecruiters, totalJobs, totalInterviews] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'recruiter' }),
        Job.countDocuments(),
        InterviewSession.countDocuments({ status: 'completed' }),
      ]);
      const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5).select('title company createdAt');
      const hiredCount = await Job.aggregate([
        { $unwind: '$applications' },
        { $match: { 'applications.status': 'hired' } },
        { $count: 'total' },
      ]);

      return res.json({
        totalStudents, totalRecruiters, totalJobs, totalInterviews,
        totalHired: hiredCount[0]?.total || 0, recentJobs,
      });
    }

    res.json({});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
