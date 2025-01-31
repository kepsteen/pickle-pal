import { Request, Response } from "express";
import { formatUserImageName } from "../lib/utils.js";
import { User } from "../models/profile.model.js";
import { uploadToS3 } from "../s3/client.js";
import dotenv from "dotenv";
import { Like, Match } from "../models/matches.model.js";

if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: "/etc/app.env" });
} else {
	dotenv.config({ path: "../.env" });
}

export const createUser = async (req: Request, res: Response) => {
	try {
		const { email, firstName, userId } = req.body;

		const newProfile = await User.create({ email, firstName, userId });
		res.status(201).json(newProfile);
	} catch (error: unknown) {
		console.error("Create user error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		res.status(500).json({
			error: "Failed to create profile",
			details: errorMessage,
		});
	}
};

export const verifyEmailExists = async (req: Request, res: Response) => {
	try {
		const { email } = req.params;
		if (email === undefined) throw new Error("Email is required");
		const profile = await User.find({ email });
		if (profile.length !== 0) {
			return res.status(200).json({ uniqueEmail: false });
		}

		return res.status(200).json({ uniqueEmail: true });
	} catch (error) {
		res.status(500).json({ error: "Error checking email existence" });
	}
};

export const updateProfile = async (req: Request, res: Response) => {
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
			lookingFor: JSON.parse(lookingFor),
			profileImageUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageName}`,
		};

		const updatedProfile = await User.findOneAndUpdate({ userId }, updateData, {
			new: true,
		});

		if (!updatedProfile) {
			return res.status(404).json({ error: "Profile not found" });
		}

		return res.status(200).json(updatedProfile);
	} catch (error) {
		console.error("Profile update error:", error);
		res.status(500).json({ error: "Error updating Profile" });
	}
};

export const getUsers = async (req: Request, res: Response) => {
	try {
		const { excludeUserId } = req.query;

		const users = await User.find({ userId: { $ne: excludeUserId } });

		if (users.length === 0) res.status(404).json({ error: "No users found" });

		return res.status(200).json(users);
	} catch (error) {
		console.error("Error finding users", error);
		res.status(500).json({ error: "Error fetching users" });
	}
};

export const addLike = async (req: Request, res: Response) => {
	try {
		const { userId: likerUserId } = req.auth;
		const { userId: likedUserId } = req.params;
		const { isLike } = req.body;
		console.log(`${likerUserId} likes ${likedUserId}`);
		// Find both users to get their MongoDB _id
		const [likerUser, likedUser] = await Promise.all([
			User.findOne({ userId: likerUserId }),
			User.findOne({ userId: likedUserId }),
		]);

		if (!likerUser || !likedUser) {
			return res.status(404).json({ error: "One or both users not found" });
		}

		// Create the like record
		const newLike = await Like.create({
			liker: likerUser.userId,
			liked: likedUser.userId,
			isLike,
		});
		console.log("newLike", newLike);

		// Check if there's a mutual like
		const mutualLike = await Like.findOne({
			liker: likedUser.userId,
			liked: likerUser.userId,
			isLike: true,
		});
		console.log("mutualLike", mutualLike);
		if (mutualLike) {
			// Create a match if there's a mutual like
			const match = await Match.create({
				user1: likerUser.userId,
				user2: likedUser.userId,
			});

			console.log("match created", match);

			// Get the full user document for the liked user
			const matchedUser = await User.findOne({ userId: likedUser.userId });
			console.log("matchedUser", matchedUser);
			return res.status(201).json({
				like: newLike,
				isMatch: true,
				matchedUser: matchedUser,
			});
		}

		res.status(201).json({
			like: newLike,
			isMatch: false,
			matchedUser: null,
		});
	} catch (error) {
		console.error("Error adding like", error);
		res.status(500).json({ error: "Error adding like" });
	}
};
