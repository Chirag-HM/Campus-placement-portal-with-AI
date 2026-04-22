import LearningPath from '../models/LearningPath.js';
import User from '../models/User.js';
import * as claudeService from '../services/claudeService.js';

export const generatePath = async (req, res) => {
  try {
    const { targetRole, currentLevel } = req.body;
    if (!targetRole || !currentLevel) {
      return res.status(400).json({ message: 'Target role and current level are required' });
    }

    const user = await User.findById(req.user._id);
    let skillGaps = [];
    if (user.resume?.analysisHistory?.length > 0) {
      const latest = user.resume.analysisHistory[user.resume.analysisHistory.length - 1];
      skillGaps = latest.gaps || [];
    }
    if (skillGaps.length === 0) skillGaps = ['General skills for ' + targetRole];

    const { roadmap } = await claudeService.generateLearningPath(skillGaps, targetRole, currentLevel);

    if (user.learningPath) await LearningPath.findByIdAndDelete(user.learningPath);

    const learningPath = await LearningPath.create({
      student: req.user._id, targetRole, currentLevel, skillGaps, roadmap,
    });

    user.learningPath = learningPath._id;
    await user.save();
    res.status(201).json({ learningPath });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate learning path', error: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { week, isCompleted } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.learningPath) return res.status(404).json({ message: 'No learning path found' });

    const lp = await LearningPath.findById(user.learningPath);
    if (!lp) return res.status(404).json({ message: 'Learning path not found' });

    const weekItem = lp.roadmap.find(w => w.week === week);
    if (!weekItem) return res.status(404).json({ message: 'Week not found' });

    weekItem.isCompleted = isCompleted;
    weekItem.completedAt = isCompleted ? new Date() : null;
    lp.recalculateProgress();
    await lp.save();
    res.json({ learningPath: lp });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

export const getMyPath = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.learningPath) return res.json({ learningPath: null });
    const lp = await LearningPath.findById(user.learningPath);
    res.json({ learningPath: lp });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
