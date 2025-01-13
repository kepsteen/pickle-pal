import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB Connected");
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		process.exit(1);
	}
};
