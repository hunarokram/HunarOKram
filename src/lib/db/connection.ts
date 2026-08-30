import mongoose from 'mongoose';
import { logger } from '@/lib/logger';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

/**
 * Global cache for the MongoDB connection.
 * In serverless/edge environments, this prevents creating
 * a new connection on every request.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend globalThis to persist connection across hot reloads in dev
const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalForMongoose.mongooseCache) {
  globalForMongoose.mongooseCache = cached;
}

/**
 * Returns a cached MongoDB connection via Mongoose.
 * Safe for serverless: reuses existing connection if available.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    logger.info('Connecting to MongoDB...');

    cached.promise = mongoose
      .connect(MONGODB_URI as string, opts)
      .then((mongooseInstance) => {
        logger.info('MongoDB connected successfully');
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        logger.error('MongoDB connection failed', { error: String(err) });
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/**
 * Disconnect from MongoDB. Used in tests and graceful shutdown.
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    logger.info('MongoDB disconnected');
  }
}
