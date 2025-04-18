import mongoose from "mongoose";

const dbURL = process.env.MONGODB_URI as string;

export const connectDB = async () => {
    if(!dbURL) {
        throw new Error("MONGODB_URL is NOT defined")
    }
    await mongoose.connect(dbURL);
}