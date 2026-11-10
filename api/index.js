import app from '../backend/src/server.js';
import { connectDB } from '../backend/src/config/db.js';

export default async function handler(req, res) {
  // Ensure DB connection is initiated for serverless requests
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless DB connection error:', err.message);
  }

  // Handle request through Express app
  return app(req, res);
}
