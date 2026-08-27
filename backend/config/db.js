import mongoose from "mongoose"
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

export default connectDb;