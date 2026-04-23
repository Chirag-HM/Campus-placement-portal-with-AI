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
  googleId: { type: String, unique: true, sparse: true },
  password: { type: String },
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
  externalApplications: [{
    title: String,
    company: String,
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interviewing', 'rejected', 'offered', 'hired'],
      default: 'applied'
    },
    appliedAt: { type: Date, default: Date.now },
    notes: String
  }],
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{
    name: String,
    icon: String,
    awardedAt: { type: Date, default: Date.now }
  }],
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  certifications: [{
    name: String,
    issuedBy: String,
    date: { type: Date, default: Date.now },
    url: String
  }],
  lastLoginDate: Date,
  streak: {
    count: { type: Number, default: 0 },
    lastAwarded: Date,
    highest: { type: Number, default: 0 }
  },
  linkedIn: String,
  github: String,
  portfolio: String,
}, { timestamps: true });

userSchema.virtual('nextLevelXp').get(function () {
  return this.level * 500;
});

userSchema.virtual('isProfileComplete').get(function () {
  return !!(this.college && this.branch && this.graduationYear && this.cgpa && this.skills?.length > 0);
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);
export default User;
