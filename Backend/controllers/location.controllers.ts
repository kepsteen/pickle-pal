import { Request, Response } from "express";
import { Location } from "../models/location.model.js";
import { Like } from "../models/matches.model.js";
import { UserDocument } from "../types/types.js";

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

export const getNearByUsers = async (req: Request, res: Response) => {
	try {
		const maxDistance = parseInt(req.query.maxDistance as string) || 16093.4; // Default to 10 miles
		const lat = parseFloat(req.query.lat as string);
		const lng = parseFloat(req.query.lng as string);

		const { userId } = req.auth;
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
			.exec();

		const userDocs: UserDocument[] = users
			.filter((loc) => loc.userId !== null)
			.map((loc) => loc.userId as unknown as UserDocument);

		//got nearby users
		const interactedLikes = await Like.find({
			liker: userId,
		}).select("liked");

		const interactedUsers = interactedLikes.map((like) => like.liked);

		const filteredUsers = userDocs.filter(
			(user: UserDocument) => !interactedUsers.includes(user.userId)
		);

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
