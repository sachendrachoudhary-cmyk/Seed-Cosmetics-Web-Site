import mongoose from "mongoose";

let memoryServer: any = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/seedcosmetics";

  try {
    // Attempt standard connection first with a 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected to MongoDB at: ${uri.replace(/\/\/.*@/, "//***:***@")}`);
    return mongoose;
  } catch (err: any) {
    console.warn(`[Database] Standard MongoDB connection failed (${err.message}). Starting hybrid in-memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[Database] Connected to in-memory MongoDB at: ${memUri}`);
      return mongoose;
    } catch (memErr: any) {
      console.error("[Database] Failed to initialize in-memory database fallback:", memErr);
      throw memErr;
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
