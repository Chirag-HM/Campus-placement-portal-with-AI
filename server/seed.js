import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Job from './models/Job.js';

const sampleJobs = [
  {
    title: 'Full Stack MERN Developer',
    company: 'TechFlow Solutions',
    description: 'We are looking for a talented MERN stack developer to join our core team. You will be responsible for building scalable web applications and collaborating with the design team.',
    location: 'Remote',
    type: 'Full-time',
    salary: { min: 800000, max: 1200000, currency: 'INR' },
    requiredSkills: ['MongoDB', 'Express', 'React', 'Node.js', 'Redux', 'Tailwind CSS'],
    eligibility: { branches: ['CSE', 'ISE', 'ECE'], minCGPA: 7.5, graduationYear: 2025 },
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive: true
  },
  {
    title: 'Backend Developer Intern',
    company: 'DataStream AI',
    description: 'Join our backend team as an intern and work on high-performance APIs and database architectures. Great learning opportunity for students.',
    location: 'Bangalore, India',
    type: 'Internship',
    salary: { min: 25000, max: 35000, currency: 'INR' },
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Postman'],
    eligibility: { branches: ['CSE', 'ISE'], minCGPA: 7.0, graduationYear: 2026 },
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Frontend React Engineer',
    company: 'CreativePixels',
    description: 'Focus on building beautiful, interactive user interfaces using React and Framer Motion. Knowledge of UI/UX principles is a plus.',
    location: 'Mumbai, India',
    type: 'Full-time',
    salary: { min: 600000, max: 900000, currency: 'INR' },
    requiredSkills: ['React', 'JavaScript', 'Framer Motion', 'CSS3', 'HTML5'],
    eligibility: { branches: ['Any'], minCGPA: 6.5, graduationYear: 2025 },
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Find the first user to assign as the recruiter
    const user = await mongoose.model('User').findOne();
    if (!user) {
      console.error('No users found in DB. Please sign in via Google first to create your account.');
      process.exit(1);
    }

    const jobsWithRecruiter = sampleJobs.map(job => ({
      ...job,
      postedBy: user._id
    }));
    
    await Job.insertMany(jobsWithRecruiter);
    console.log(`Successfully seeded 3 sample jobs assigned to ${user.name}! ✅`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
