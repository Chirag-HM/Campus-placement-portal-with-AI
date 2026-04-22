import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: Number,
  question: String,
  hint: String,
  expectedTopics: [String]
});

const answerSchema = new mongoose.Schema({
  questionId: Number,
  userAnswer: String,
  score: Number,
  feedback: String,
  whatWasMissed: [String],
  improvedAnswer: String,
  evaluatedAt: { type: Date, default: Date.now }
});

const interviewSessionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  roundType: { type: String, enum: ['HR', 'Technical', 'DSA', 'System Design', 'Behavioral'], default: 'Technical' },
  questions: [questionSchema],
  answers: [answerSchema],
  totalScore: { type: Number, default: 0 },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date
}, { timestamps: true });

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
