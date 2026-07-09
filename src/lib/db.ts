import mongoose from 'mongoose';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    let uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log('💡 Successfully connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  
  return cached.conn;
}

export default connectDB;
