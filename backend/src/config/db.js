import mongoose from 'mongoose';

let dbPromise = null;

export const connectDB = async () => {
  // Reuse existing connection if healthy
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Prevent multiple concurrent connection attempts
  if (dbPromise) {
    return dbPromise;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not set. Database features require this variable in Vercel Project Settings.');
    return null;
  }

  dbPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 45000,
  })
    .then((conn) => {
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      dbPromise = null;
      return conn;
    })
    .catch((err) => {
      console.error(`❌ MongoDB connection failed: ${err.message}`);
      dbPromise = null;
      throw err;
    });

  return dbPromise;
};
