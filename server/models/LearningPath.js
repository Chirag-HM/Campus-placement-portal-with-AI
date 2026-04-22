import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['video', 'article', 'course', 'documentation', 'practice'] },
  url: String,
  platform: String
});

const weekSchema = new mongoose.Schema({
  week: Number,
  focus: String,
  topics: [String],
  resources: [resourceSchema],
  milestone: String,
  isCompleted: { type: Boolean, default: false },
  completedAt: Date
});

const learningPathSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, required: true },
  currentLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  skillGaps: [String],
  roadmap: [weekSchema],
  overallProgress: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

learningPathSchema.methods.recalculateProgress = function () {
  if (this.roadmap.length === 0) return 0;
  const completed = this.roadmap.filter(w => w.isCompleted).length;
  this.overallProgress = Math.round((completed / this.roadmap.length) * 100);
  return this.overallProgress;
};

const LearningPath = mongoose.model('LearningPath', learningPathSchema);
export default LearningPath;
