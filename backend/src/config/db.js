import mongoose from 'mongoose';

export const connectDB = async () => {
  // Reuse existing connection if already active
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Atlas Connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (primaryErr) {
      console.error(`❌ MongoDB Connection Error (${primaryErr.message}).`);
      if (process.env.VERCEL === '1') {
        return null;
      }
    }
  }

  // Fallback to in-memory MongoDB for local zero-setup development
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    try {
      console.log('🔄 Initializing in-memory MongoMemoryServer fallback for zero-config run...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ Connected to In-Memory MongoDB Server: ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.warn('⚠️ In-Memory Mongo fallback unavailable:', memErr.message);
    }
  } else if (!uri) {
    console.warn('⚠️ MONGODB_URI is not configured in Vercel environment variables.');
  }

  return null;
};

