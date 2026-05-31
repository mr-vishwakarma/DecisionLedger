const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('./src/server');

// Cached database connection pointer
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/decision_ledger';
  console.log('Lambda: Connecting to MongoDB...');
  
  // Connect and store connection
  cachedDb = await mongoose.connect(MONGO_URI);
  return cachedDb;
}

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Prevent Lambda from waiting for the Node.js event loop to empty if connection is open
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Ensure database connection is ready before invoking the express app
  await connectToDatabase();
  
  return handler(event, context);
};
