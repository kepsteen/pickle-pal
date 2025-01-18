import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

// Load environment variables
if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: "/etc/app.env" });
} else {
	dotenv.config();
}

// Configure and export S3 Client
export const s3Client = new S3Client({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
	region: process.env.AWS_REGION,
});

// Optional: Create helper functions for common S3 operations
export const uploadToS3 = async (fileBuffer, fileName) => {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: fileName,
		Body: fileBuffer,
	};

	try {
		const command = new PutObjectCommand(params);
		const response = await s3Client.send(command);
		return response;
	} catch (error) {
		console.error("Error uploading to S3:", error);
		throw error;
	}
};
