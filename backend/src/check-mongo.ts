import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Project';

async function checkMongoData() {
  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    const collections = ['players', 'questions', 'groups', 'timers'];
    for (const collName of collections) {
      const count = await db.collection(collName).countDocuments();
      console.log(`Collection ${collName} count: ${count}`);
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Mongo Check Error:', err);
    process.exit(1);
  }
}

checkMongoData();
