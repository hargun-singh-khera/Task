import mongoose from "mongoose";

const MONGO_URL = process.env.MONGODB_URI;

export const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return;
        }
        await mongoose.connect(MONGO_URL);
        const connection = mongoose.connection
        connection.on("connected", () => {
            console.log("MongoDB connected successfully")
        })
        connection.on("error", (error) => {
            console.log("MongoDB connection error: ", error)
            process.exit()
        })
    } catch (error) {
        console.log("Something went wrong while connecting to the database")
        console.log(error);
    }
};