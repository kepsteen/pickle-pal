import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

// Load environment variables
if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: "/etc/app.env" });
} else {
	dotenv.config({ path: "../.env" });
}

// Configure and export S3 Client
export const s3Client = new S3Client({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
	region: process.env.AWS_REGION as string,
});

// s3 File upload helper function
export const uploadToS3 = async (
	fileBuffer: Buffer,
	fileName: string,
	userId: string
) => {
	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: fileName,
		Body: fileBuffer,
		ContentType: "image/*",
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
