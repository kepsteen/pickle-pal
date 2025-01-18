import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from the appropriate location
if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: "/etc/app.env" });
} else {
	dotenv.config();
}

export const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_URI);
		console.log("MongoDB Connected");
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		process.exit(1);
	}
};
