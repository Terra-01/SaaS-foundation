// path: src/lib/db/mongodb.ts
import mongoose from "mongoose";
import { env } from "@/lib/env";

declare global {
    // eslint-disable-next-line no-var
    var _mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

const cached = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

/**
 * Returns a cached Mongoose connection. Safe to call multiple times.
 * The connection string should point to a replica set for transaction support.
 */
export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(env.MONGODB_URI, {
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
}
