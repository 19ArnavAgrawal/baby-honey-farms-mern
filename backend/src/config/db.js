import mongoose from 'mongoose';
import { CONFIG } from './constants.js';

let isConnected = false;
let memoryServer = null;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const primaryUri = process.env.MONGODB_URI || CONFIG.MONGODB_URI;

  // 1. First attempt: Connect to primary MongoDB URI (MongoDB Atlas or local daemon)
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return;
  } catch (err) {
    console.warn(`[MongoDB Warning] Primary connection failed: ${err.message}`);
  }

  // 2. Second attempt: In-memory MongoDB fallback for instant zero-config testing if primary is unreachable
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.log('[MongoDB Info] Initializing local MongoMemoryServer fallback for seamless zero-config operation...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();

      const conn = await mongoose.connect(memUri);
      isConnected = true;
      console.log(`[MongoDB] Connected to MongoMemoryServer at: ${memUri}`);

      // Auto-seed in-memory instance
      console.log('[MongoDB Info] Auto-populating initial honey catalog and default admin...');
      const { seedData } = await import('../scripts/seedData.js');
      await seedData();
      return;
    } catch (memErr) {
      console.warn(`[MongoDB Warning] MongoMemoryServer fallback skipped: ${memErr.message}`);
    }
  }

  console.warn(`[MongoDB Notice] Server is running in API-ready mode. Please set MONGODB_URI in backend/.env for Atlas.`);
};
