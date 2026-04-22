import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  jobTitle: String,
  matchScore: Number,
  strengths: [String],
  gaps: [String],
  suggestions: [String],
  keywordsFound: [String],
  keywordsMissing: [String],
  atsScore: Number,
  overallFeedback: String,
  analysedAt: { type: Date, default: Date.now }
});

const interviewHistorySchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession' },
  role: String,
  roundType: String,
  totalScore: Number,
  completedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: String,
  role: { type: String, enum: ['student', 'recruiter', 'admin'], default: 'student' },
  college: String,
  branch: String,
  graduationYear: Number,
  cgpa: Number,
  phone: String,
  skills: [String],
  resume: {
    url: String,
    publicId: String,
    uploadedAt: Date,
    analysisHistory: [resumeAnalysisSchema]
  },
  interviewHistory: [interviewHistorySchema],
  learningPath: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath' },
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  linkedIn: String,
  github: String,
  portfolio: String,
}, { timestamps: true });

userSchema.virtual('isProfileComplete').get(function () {
  return !!(this.college && this.branch && this.graduationYear && this.cgpa && this.skills?.length > 0);
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);
export default User;
