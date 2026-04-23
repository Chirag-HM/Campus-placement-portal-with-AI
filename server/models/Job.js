import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchScore: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interviewing', 'rejected', 'offered', 'hired'],
    default: 'applied'
  },
  coverLetter: String,
  portfolioLink: String,
  answers: [{ question: String, answer: String }],
  appliedAt: { type: Date, default: Date.now }
});

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyLogo: String,
  description: { type: String, required: true },
  requirements: [String],
  requiredSkills: [String],
  preferredSkills: [String],
  location: String,
  type: {
    type: String,
    enum: ['Full-time', 'Internship', 'Part-time', 'Contract'],
    default: 'Full-time'
  },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'INR' }
  },
  eligibility: {
    branches: [String],
    minCGPA: Number,
    graduationYear: Number,
    backlogsAllowed: { type: Boolean, default: false }
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applications: [applicationSchema],
  deadline: Date,
  isActive: { type: Boolean, default: true },
  rounds: [String],
}, { timestamps: true });

jobSchema.index({ isActive: 1, deadline: 1 });
jobSchema.index({ postedBy: 1 });

const Job = mongoose.model('Job', jobSchema);
export default Job;
