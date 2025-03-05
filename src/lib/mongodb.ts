import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

// Mock database for development when MongoDB is not available
const mockDatabase = {
  forms: new Map(),
  emailLists: new Map(),
  formResponses: new Map()
};

// Flag to indicate if we're using the mock database - set to true by default for development
let usingMockDb = true; // Always use mock DB for now

// Define the cached mongoose connection type
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare the global variable with proper typing
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase() {
  // Always use mock database for now
  console.log('Using mock database by default');
  return mockMongooseConnection();
}

// Create a mock mongoose connection that doesn't actually connect to MongoDB
function mockMongooseConnection() {
  console.log('Using mock database');
  
  // Create a mock mongoose instance
  const mockMongoose = { ...mongoose };
  
  // Return the mock mongoose instance
  return mockMongoose;
}

// Export the mock database for direct access in mock models
export { mockDatabase, usingMockDb };
export default connectToDatabase;