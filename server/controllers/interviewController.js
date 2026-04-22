import InterviewSession from '../models/InterviewSession.js';
import User from '../models/User.js';
import * as aiService from '../services/aiService.js';
import { getIO, getUserSocket } from '../index.js';

// Start a new interview session
export const startInterview = async (req, res) => {
  try {
    const { role, difficulty, roundType } = req.body;

    if (!role || !difficulty || !roundType) {
      return res.status(400).json({ message: 'Role, difficulty, and round type are required' });
    }

    // Generate questions via Claude
    const { questions } = await aiService.generateQuestions(role, difficulty, roundType);

    const session = await InterviewSession.create({
      student: req.user._id,
      role,
      difficulty,
      roundType,
      questions,
      status: 'in-progress',
    });

    res.status(201).json({
      sessionId: session._id,
      questions: session.questions,
      role,
      difficulty,
      roundType,
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ message: 'Failed to start interview', error: error.message });
  }
};

// Submit answer and get evaluation
export const submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, userAnswer } = req.body;

    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your session' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ message: 'Session already completed' });
    }

    const question = session.questions.find(q => q.id === questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    // Evaluate via Gemini
    let evaluation;
    if (req.body.language) {
      evaluation = await aiService.evaluateCode(
        question.question,
        userAnswer,
        req.body.language,
        session.role
      );
    } else {
      evaluation = await aiService.evaluateAnswer(
        question.question,
        userAnswer,
        session.role
      );
    }

    // Save answer
    session.answers.push({
      questionId,
      userAnswer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      whatWasMissed: evaluation.whatWasMissed,
      improvedAnswer: evaluation.improvedAnswer,
    });

    await session.save();

    // Emit real-time update
    const io = getIO();
    const socketId = getUserSocket(req.user._id.toString());
    if (io && socketId) {
      io.to(socketId).emit('interview-update', {
        sessionId,
        questionId,
        evaluation,
      });
    }

    res.json({ evaluation });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ message: 'Evaluation failed', error: error.message });
  }
};

// Complete interview — calculate final score
export const completeInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await InterviewSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your session' });
    }

    // Calculate total score
    const totalAnswers = session.answers.length;
    if (totalAnswers === 0) {
      return res.status(400).json({ message: 'No answers submitted' });
    }

    const avgScore = session.answers.reduce((sum, a) => sum + a.score, 0) / totalAnswers;
    session.totalScore = Math.round(avgScore * 10); // Scale to 0-100
    session.status = 'completed';
    session.completedAt = new Date();

    await session.save();

    // Save to user's interview history
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        interviewHistory: {
          sessionId: session._id,
          role: session.role,
          roundType: session.roundType,
          totalScore: session.totalScore,
          completedAt: session.completedAt,
        },
      },
    });

    // Emit completion event
    const io = getIO();
    const socketId = getUserSocket(req.user._id.toString());
    if (io && socketId) {
      io.to(socketId).emit('interview-complete', {
        sessionId,
        totalScore: session.totalScore,
      });
    }

    res.json({ session });
  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({ message: 'Failed to complete', error: error.message });
  }
};

// Get interview session by ID
export const getSession = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's interview history
export const getHistory = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ student: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
