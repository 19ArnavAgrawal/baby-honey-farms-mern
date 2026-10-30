import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CONFIG } from '../config/constants.js';
import { seedData } from './seedData.js';

dotenv.config();

async function runSeed() {
  const mongoUri = process.env.MONGODB_URI || CONFIG.MONGODB_URI;
  console.log(`[Seed] Connecting to: ${mongoUri}`);

  try {
    await mongoose.connect(mongoUri);
    console.log('[Seed] Database connected.');

    // Force clear & reseed
    const { Category } = await import('../models/Category.js');
    const { Product } = await import('../models/Product.js');
    const { User } = await import('../models/User.js');

    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({ email: 'admin@babyhoneyfarms.com' });

    await seedData();

    console.log('\n=============================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY! ');
    console.log(' Business WhatsApp Number: ' + CONFIG.BUSINESS_WHATSAPP_NUMBER);
    console.log(' Admin Login: admin@babyhoneyfarms.com');
    console.log(' Admin Pass:  Admin@123');
    console.log('=============================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error] Failed to seed database:', err);
    process.exit(1);
  }
}

runSeed();
