import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function fix() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const usersExists = collections.some(c => c.name === 'users');
    
    if (usersExists) {
      try {
        await db.collection('users').dropIndex('googleId_1');
        console.log('Dropped googleId_1 index');
      } catch (e) {
        console.log('googleId_1 index not found, skipping drop');
      }
    } else {
      console.log('Users collection not found');
    }
    
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fix();
