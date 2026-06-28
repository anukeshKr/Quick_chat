import mongoose from "mongoose";

export async function connectDb() {
    try {
        // The await keyword guarantees it finishes connecting before moving down
        
        await mongoose.connect(process.env.MONGODB_URI,{ family: 4 });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // Optional: Force stop the server if the database fails to connect
        process.exit(1);
    }
}
