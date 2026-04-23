import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Job from './models/Job.js';

const indianJobs = [
  {
    title: 'Software Engineer - Google Cloud',
    company: 'Google',
    description: 'Build and maintain large-scale distributed systems. Experience with Java, C++, or Go required. Focus on Google Cloud Platform services.',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salary: { min: 2500000, max: 4500000, currency: 'INR' },
    requiredSkills: ['Java', 'Go', 'Distributed Systems', 'Cloud Computing', 'DSA'],
    eligibility: { branches: ['CSE', 'ISE', 'ECE'], minCGPA: 8.5, graduationYear: 2025 },
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'SDE-II (Backend)',
    company: 'Amazon',
    description: 'Design and develop high-performance backend services for Amazon Retail. Work on supply chain optimization and inventory management systems.',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salary: { min: 2200000, max: 4000000, currency: 'INR' },
    requiredSkills: ['Node.js', 'NoSQL', 'AWS', 'System Design', 'Microservices'],
    eligibility: { branches: ['CSE', 'ISE'], minCGPA: 8.0, graduationYear: 2025 },
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Full Stack Engineer',
    company: 'Flipkart',
    description: 'Help us build the future of Indian E-commerce. Focus on React/Node.js stack for consumer-facing features.',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salary: { min: 1800000, max: 3500000, currency: 'INR' },
    requiredSkills: ['React', 'Node.js', 'Redis', 'Kafka', 'SQL'],
    eligibility: { branches: ['Any'], minCGPA: 7.5, graduationYear: 2025 },
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Associate Software Engineer',
    company: 'Microsoft',
    description: 'Join the Azure team in Hyderabad. Focus on developer tools and cloud infrastructure.',
    location: 'Hyderabad, Telangana',
    type: 'Full-time',
    salary: { min: 2000000, max: 3800000, currency: 'INR' },
    requiredSkills: ['C#', '.NET', 'Azure', 'Algorithms', 'TypeScript'],
    eligibility: { branches: ['CSE', 'ECE'], minCGPA: 8.0, graduationYear: 2025 },
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Backend Intern (6 Months)',
    company: 'Zomato',
    description: 'Work on the logistics and delivery engine of India\'s largest food delivery platform.',
    location: 'Gurugram, Haryana',
    type: 'Internship',
    salary: { min: 40000, max: 60000, currency: 'INR' },
    requiredSkills: ['Golang', 'PostgreSQL', 'Docker', 'Redis'],
    eligibility: { branches: ['CSE', 'ISE', 'IT'], minCGPA: 7.0, graduationYear: 2026 },
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Product Engineer',
    company: 'Razorpay',
    description: 'Build robust payment infrastructure for India. Focus on scale, security, and developer experience.',
    location: 'Bengaluru, Karnataka',
    type: 'Full-time',
    salary: { min: 2400000, max: 4200000, currency: 'INR' },
    requiredSkills: ['PHP', 'Go', 'MySQL', 'React', 'Security'],
    eligibility: { branches: ['Any'], minCGPA: 7.0, graduationYear: 2025 },
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

const seedIndiaJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('🚀 Connected to MongoDB for India Jobs seeding...');

    const recruiter = await User.findOne({ role: 'recruiter' }) || await User.findOne();
    
    if (!recruiter) {
      console.error('❌ No recruiter found. Please sign up first.');
      process.exit(1);
    }

    const jobsToInsert = indianJobs.map(job => ({
      ...job,
      postedBy: recruiter._id
    }));

    await Job.insertMany(jobsToInsert);
    console.log(`✅ Successfully seeded ${indianJobs.length} Indian tech jobs!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedIndiaJobs();
