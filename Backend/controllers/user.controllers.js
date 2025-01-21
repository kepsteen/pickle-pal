import { formatUserImageName } from "../lib/utils.js";
import { InitialProfile } from "../models/profile.model.js";
import { uploadToS3 } from "../s3/client.js";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: "/etc/app.env" });
} else {
	dotenv.config({ path: "../.env" });
}

export const createInitialProfile = async (req, res) => {
	try {
		const { email, firstName } = req.body;
		// Todo: Add error handling
		const newProfile = await InitialProfile.create({ email, firstName });
		res.status(201).json(newProfile);
	} catch (error) {
		res.status(500).json({ error: "Failed to create profile" });
	}
};

export const verifyEmailExists = async (req, res) => {
	try {
		const { email } = req.params;
		if (email === undefined) throw new Error("Email is required");
		const profile = await InitialProfile.find({ email });
		if (profile.length !== 0) {
			return res.status(200).json({ uniqueEmail: false });
		}

		return res.status(200).json({ uniqueEmail: true });
	} catch (error) {
		res.status(500).json({ error: "Error checking email existence" });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const { userId } = req.params;
		const profileImage = req.file;
		const { firstName, skillLevel, playStyle, duprRating, bio, lookingFor } =
			req.body;

		if (!profileImage) {
			return res.status(400).json({ error: "Profile image is required" });
		}

		const imageName = formatUserImageName(
			profileImage.originalname,
			userId,
			"profileImgs"
		);

		await uploadToS3(profileImage.buffer, imageName, userId);

		let updateData = {
			firstName,
			skillLevel,
			playStyle,
			duprRating,
			bio,
			lookingFor,
			profileImageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`,
		};

		const updatedProfile = await InitialProfile.findOneAndUpdate(
			{ userId },
			updateData,
			{ new: true }
		);

		if (!updatedProfile) {
			return res.status(404).json({ error: "Profile not found" });
		}

		return res.status(200).json(updatedProfile);
	} catch (error) {
		console.error("Profile update error:", error);
		res.status(500).json({ error: "Error updating Profile" });
	}
};
