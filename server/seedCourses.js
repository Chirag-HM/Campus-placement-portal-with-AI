import 'dotenv/config';
import mongoose from 'mongoose';
import Course from './models/Course.js';

const sampleCourses = [
  {
    title: 'Modern Full Stack Mastery',
    description: 'Learn the MERN stack with advanced patterns like Microservices, Redis Caching, and Docker containerization.',
    category: 'Development',
    duration: '12 Hours',
    level: 'Intermediate',
    xpReward: 150,
    modules: [
      { title: 'Introduction to Microservices', content: 'Architecture overview...' },
      { title: 'Redis for Caching', content: 'How to speed up your API...' }
    ]
  },
  {
    title: 'AI Engineering Fundamentals',
    description: 'Master the art of prompt engineering and integrating Large Language Models (LLMs) into your applications.',
    category: 'AI & Data Science',
    duration: '8 Hours',
    level: 'Beginner',
    xpReward: 100,
    modules: [
      { title: 'LLM Basics', content: 'Understanding Transformers...' },
      { title: 'Prompt Engineering 101', content: 'Best practices for better responses...' }
    ]
  },
  {
    title: 'Cloud Architecture with AWS',
    description: 'Prepare for the AWS Certified Solutions Architect Associate exam with hands-on labs.',
    category: 'Cloud',
    duration: '20 Hours',
    level: 'Advanced',
    xpReward: 250,
    modules: [
      { title: 'EC2 and S3', content: 'Computing and Storage...' },
      { title: 'Serverless with Lambda', content: 'Event-driven scaling...' }
    ]
  }
];

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    await Course.deleteMany({}); // Clear existing to avoid duplicates during dev
    await Course.insertMany(sampleCourses);
    console.log('✅ Successfully seeded sample courses!');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    process.exit(1);
  }
};

seedCourses();
