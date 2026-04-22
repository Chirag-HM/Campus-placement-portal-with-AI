import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');

    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: 'Test User',
      email: email,
      password: hashedPassword,
      role: 'student'
    });

    console.log('User created:', user._id);
    process.exit(0);
  } catch (error) {
    console.error('FAILED:', error);
    process.exit(1);
  }
}

test();
