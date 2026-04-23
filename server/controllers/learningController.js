import Course from '../models/Course.js';
import User from '../models/User.js';
import LearningPath from '../models/LearningPath.js';
import * as aiService from '../services/aiService.js';
import { awardXP } from '../services/gamificationService.js';

export const generatePath = async (req, res) => {
  try {
    const { targetRole, currentLevel, skillGaps } = req.body;
    const user = await User.findById(req.user._id);

    const systemPrompt = `You are an expert Career Mentor. Generate a 4-week personalized learning roadmap for a ${currentLevel} ${targetRole}.
Focus on these skill gaps: ${skillGaps.join(', ')}.
Return a JSON with a "roadmap" array. Each item should have:
"week": number, "focus": string, "topics": [string], "milestone": string,
"resources": [{"title": string, "type": "video"|"article"|"course", "url": string, "platform": string}]
Keep it professional and actionable.`;

    const result = await aiService.callAI(systemPrompt);
    
    const learningPath = await LearningPath.create({
      student: req.user._id,
      targetRole,
      currentLevel,
      skillGaps,
      roadmap: result.roadmap
    });

    user.learningPath = learningPath._id;
    await user.save();

    res.json({ learningPath });
  } catch (error) {
    res.status(500).json({ message: 'Generation failed', error: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { weekNumber, isCompleted } = req.body;
    const path = await LearningPath.findOne({ student: req.user._id });
    if (!path) return res.status(404).json({ message: 'Path not found' });

    const week = path.roadmap.find(w => w.week === weekNumber);
    if (week) {
      week.isCompleted = isCompleted;
      week.completedAt = isCompleted ? new Date() : null;
    }

    path.recalculateProgress();
    await path.save();

    res.json({ path });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

export const getMyPath = async (req, res) => {
  try {
    const path = await LearningPath.findOne({ student: req.user._id });
    res.json({ path });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const completeCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (user.completedCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Course already completed' });
    }

    user.completedCourses.push(courseId);
    
    user.certifications.push({
      name: `${course.title} Professional Certification`,
      issuedBy: 'PlaceAI Academy',
      date: new Date()
    });

    await user.save();
    const xpResult = await awardXP(user._id, course.xpReward || 100);

    res.json({ 
      message: 'Course completed successfully! Certification issued.', 
      xpResult,
      certifications: user.certifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
