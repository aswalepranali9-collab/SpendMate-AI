import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spendmate_ai';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (primaryErr) {
    console.warn(`⚠️ Primary MongoDB connection failed (${primaryErr.message}).`);
    
    // Fallback to in-memory MongoDB for seamless zero-setup local dev/testing
    try {
      console.log('🔄 Initializing in-memory MongoMemoryServer fallback for zero-config run...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ Connected to In-Memory MongoDB Server: ${conn.connection.host}`);
    } catch (memErr) {
      console.error('❌ MongoDB Connection Error:', memErr.message);
      process.exit(1);
    }
  }
};

