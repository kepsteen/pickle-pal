import { Request, Response } from "express";
import { formatUserImageName } from "../../lib/utils.js";
import { User } from "../models/profile.model.js";
import { uploadToS3 } from "../../s3/client.js";
import dotenv from "dotenv";
import { Like, Match, Pair, PairLike } from "../models/matches.model.js";
import Message from "../models/messages.model.js";
import { pairSwipeSessionManager } from "../../redis/PairSwipeSessionManager.js";
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
		const { userId } = req.auth;
		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}
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
		const { userId } = req.auth;
		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const { excludeUserId } = req.query;

		const users = await User.find({ userId: { $ne: userId } });

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

		// Check if there's a mutual like
		const mutualLike = await Like.findOne({
			liker: likedUser.userId,
			liked: likerUser.userId,
			isLike: true,
		});
		if (mutualLike) {
			// Create a match if there's a mutual like
			const match = await Match.create({
				user1: likerUser.userId,
				user2: likedUser.userId,
			});

			// Get the full user document for the liked user
			const matchedUser = await User.findOne({ userId: likedUser.userId });
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

export const getPals = async (req: Request, res: Response) => {
	try {
		const { userId } = req.auth;
		const matches = await Match.find({
			$or: [{ user1: userId }, { user2: userId }],
		});

		// Get the other user's ID from each match
		const palIds = matches.map((match) =>
			match.user1 === userId ? match.user2 : match.user1
		);

		const pals = await User.find({
			userId: { $in: palIds },
		});

		res.status(200).json(pals);
	} catch (error) {
		console.error("Error fetching pals", error);
		res.status(500).json({ error: "Error fetching pals" });
	}
};

export const getMessages = async (req: Request, res: Response) => {
	try {
		const { palId } = req.params;
		const { userId } = req.auth;
		const messages = await Message.find({
			$or: [
				{ sender: userId, reciever: palId },
				{ sender: palId, reciever: userId },
			],
		});

		res.status(200).json(messages);
	} catch (error) {
		console.error("Error fetching messages", error);
		res.status(500).json({ error: "Error fetching messages" });
	}
};

export const getUserById = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const user = await User.findOne({ userId });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		res.status(200).json(user);
	} catch (error) {
		console.error("Error fetching user by id", error);
		res.status(500).json({ error: "Error fetching user by id" });
	}
};

export const getCurrentPair = async (req: Request, res: Response) => {
	try {
		const { userId, palId } = req.query;
		const pair = await Pair.findOne({
			$or: [
				{ pairUser1: userId, pairUser2: palId },
				{ pairUser1: palId, pairUser2: userId },
			],
		});
		if (!pair) {
			return res.status(404).json({ error: "Pair not found" });
		}

		// Fetch user profiles
		const users = await User.find({
			userId: { $in: [pair.pairUser1, pair.pairUser2] },
		});

		// Format pair with profiles
		const pairWithProfiles = {
			pairId: pair._id.toString(),
			pairUser1Profile: {
				...users.find((user) => user.userId === pair.pairUser1)?.toObject(),
				_id: users
					.find((user) => user.userId === pair.pairUser1)
					?._id.toString(),
			},
			pairUser2Profile: {
				...users.find((user) => user.userId === pair.pairUser2)?.toObject(),
				_id: users
					.find((user) => user.userId === pair.pairUser2)
					?._id.toString(),
			},
		};

		res.status(200).json(pairWithProfiles);
	} catch (error) {
		console.error("Error fetching current pair", error);
		res.status(500).json({ error: "Error fetching current pair" });
	}
};

export const getPairs = async (req: Request, res: Response) => {
	try {
		const { userId } = req.auth;
		const { pairId: currentPairId } = req.query;
		const pairs = await Pair.find({
			$and: [{ pairUser1: { $ne: userId } }, { pairUser2: { $ne: userId } }],
		});

		// Get all unique user IDs from the pairs
		const userIds = [
			...new Set(pairs.flatMap((pair) => [pair.pairUser1, pair.pairUser2])),
		];

		// Fetch all user profiles in one query
		const users = await User.find({ userId: { $in: userIds } });

		// Fetch all pair likes where the current pair is the liker
		const interactedPairs = await PairLike.find({
			pairLiker: currentPairId,
		});

		// Filter out pairs that have already been interacted with
		const pairsWithProfiles = pairs
			.filter(
				(pair) =>
					!interactedPairs.some(
						(interactedPair) =>
							interactedPair.pairLiked.toString() === pair._id.toString()
					)
			)
			.map((pair) => ({
				pairId: pair._id.toString(),
				pairUser1Profile: {
					...users.find((user) => user.userId === pair.pairUser1)?.toObject(),
					_id: users
						.find((user) => user.userId === pair.pairUser1)
						?._id.toString(),
				},
				pairUser2Profile: {
					...users.find((user) => user.userId === pair.pairUser2)?.toObject(),
					_id: users
						.find((user) => user.userId === pair.pairUser2)
						?._id.toString(),
				},
			}));

		res.status(200).json(pairsWithProfiles);
	} catch (error) {
		console.error("Error fetching pairs", error);
		res.status(500).json({ error: "Error fetching pairs" });
	}
};

export const addPairLike = async (req: Request, res: Response) => {
	try {
		const { isLike, pairLikerId, pairLikedId } = req.body;
		const pair = await Pair.findById(pairLikedId);
		if (!pair) {
			return res.status(404).json({ error: "Pair not found" });
		}

		const newPairLike = await PairLike.create({
			pairLiker: pairLikerId,
			pairLiked: pairLikedId,
			isLike,
		});

		res.status(201).json(newPairLike);
	} catch (error) {
		console.error("Error adding pair like", error);
	}
};

export const getPairSwipeSession = async (req: Request, res: Response) => {
	try {
		const { userId } = req.auth;
		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		const session = await pairSwipeSessionManager.getSession(userId);
		if (!session) {
			return res.status(404).json({ error: "Pair swipe session not found" });
		}
		res.status(200).json(session);
	} catch (error) {
		console.error("Error fetching pair swipe session", error);
		res.status(500).json({ error: "Error fetching pair swipe session" });
	}
};

export const SavePairSwipeSession = async (req: Request, res: Response) => {
	try {
		const { userId } = req.auth;
		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		console.log("req.body", req.body);
		const session = await Promise.all([
			await pairSwipeSessionManager.saveSession(req.body.inviterId, req.body),
			await pairSwipeSessionManager.saveSession(req.body.inviteeId, req.body),
		]);
		res.status(201).json(session);
	} catch (error) {
		console.error("Error creating pair swipe session", error);
		res.status(500).json({ error: "Error creating pair swipe session" });
	}
};
