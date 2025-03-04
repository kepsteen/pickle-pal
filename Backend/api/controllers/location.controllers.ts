import { Request, Response } from "express";
import { Location } from "../models/location.model.js";
import { Like, Pair, PairLike } from "../models/matches.model.js";
import { UserDocument } from "../../types/types.js";

export const setLocation = async (req: Request, res: Response) => {
	try {
		const { userId } = req.auth;
		const { coordinates } = req.body;

		const location = await Location.findOneAndUpdate(
			{ userId },
			{
				location: {
					type: "Point",
					coordinates,
				},
			},
			{ upsert: true, new: true }
		);

		res.status(201).json(location);
	} catch (error: unknown) {
		console.error("Set Location Error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		res.status(500).json({
			error: "Failed to set user's location",
			details: errorMessage,
		});
	}
};

export const getLocation = async (req: Request, res: Response) => {
	try {
		const { userId } = req.auth;

		const location = await Location.findOne({ userId });

		res.status(201).json(location);
	} catch (error: unknown) {
		console.error("Set Location Error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		res.status(500).json({
			error: "Failed to set user's location",
			details: errorMessage,
		});
	}
};

export const getNearByUsers = async (req: Request, res: Response) => {
	try {
		const maxDistance = parseInt(req.query.maxDistance as string) || 16093.4; // Default to 10 miles
		const lat = parseFloat(req.query.lat as string);
		const lng = parseFloat(req.query.lng as string);

		const { userId } = req.auth;
		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		if (isNaN(lat) || isNaN(lng) || isNaN(maxDistance)) {
			return res.status(400).json({
				error:
					"Invalid parameters. Please provide valid lat, lng, and maxDistance values",
			});
		}

		const coordinates = [lng, lat];

		const users = await Location.find({
			userId: { $ne: userId },
			location: {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: coordinates,
					},
					$maxDistance: maxDistance * 1609.34,
				},
			},
		})
			.populate({
				path: "userId",
				model: "InitialUser",
				match: { userId: { $exists: true } },
				localField: "userId",
				foreignField: "userId",
			})
			.limit(100)
			.exec();

		const userDocs: UserDocument[] = users
			.filter((loc) => loc.userId !== null)
			.map((loc) => loc.userId as unknown as UserDocument);

		//got nearby users
		const interactedLikes = await Like.find({
			liker: userId,
		}).select("liked");

		const interactedUsers = interactedLikes.map((like) => like.liked);

		let filteredUsers = userDocs.filter(
			(user: UserDocument) => !interactedUsers.includes(user.userId)
		);

		filteredUsers = filteredUsers.filter(
			(user: UserDocument) => user.isOnboarded
		);
		console.log(filteredUsers);

		res.status(200).json(filteredUsers);
	} catch (error: unknown) {
		console.error("Get Nearby Users Error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		res.status(500).json({
			error: "Failed to get nearby users",
			details: errorMessage,
		});
	}
};

export const getNearByPairs = async (req: Request, res: Response) => {
	// Todo: Fix this controller
	try {
		const maxDistance = parseInt(req.query.maxDistance as string) || 16093.4; // Default to 10 miles
		const lat = parseFloat(req.query.lat as string);
		const lng = parseFloat(req.query.lng as string);

		const { userId } = req.auth;
		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		if (isNaN(lat) || isNaN(lng) || isNaN(maxDistance)) {
			return res.status(400).json({
				error:
					"Invalid parameters. Please provide valid lat, lng, and maxDistance values",
			});
		}

		const coordinates = [lng, lat];

		// First, find nearby users
		const nearbyLocations = await Location.find({
			userId: { $ne: userId },
			location: {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: coordinates,
					},
					$maxDistance: maxDistance * 1609.34,
				},
			},
		});

		// Get the userIds of nearby users
		const nearbyUserIds = nearbyLocations.map((loc) => loc.userId);

		// Find pairs where at least one user is nearby
		const nearbyPairs = await Pair.find({
			$or: [
				{ pairUser1: { $in: nearbyUserIds } },
				{ pairUser2: { $in: nearbyUserIds } },
			],
		}).populate([
			{
				path: "pairUser1",
				model: "InitialUser",
			},
			{
				path: "pairUser2",
				model: "InitialUser",
			},
		]);

		// Get interacted pairs
		const interactedPairLikes = await PairLike.find({
			pairLiker: userId,
		}).select("pairLiked");

		const interactedPairIds = interactedPairLikes.map((like) => like.pairLiked);

		// Filter out pairs that have been interacted with
		const filteredPairs = nearbyPairs.filter(
			(pair) => !interactedPairIds.includes(pair.pairUser1)
		);

		res.status(200).json(filteredPairs);
	} catch (error: unknown) {
		console.error("Get Nearby Pairs Error:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		res.status(500).json({
			error: "Failed to get nearby pairs",
			details: errorMessage,
		});
	}
};
