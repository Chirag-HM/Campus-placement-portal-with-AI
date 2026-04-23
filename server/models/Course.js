import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  provider: { type: String, default: 'PlaceAI Academy' },
  duration: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  category: { type: String, required: true },
  thumbnail: String,
  modules: [{
    title: String,
    content: String,
    videoUrl: String,
    resources: [{ name: String, url: String }]
  }],
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  xpReward: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Course', courseSchema);
