import { Location } from "../models/location.model.js";

export const setLocation = async (req, res) => {
	try {
		const { userId } = req.auth;
		const { coordinates } = req.body;
		console.log("coords", coordinates);

		console.log("endpoint hit");

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
	} catch (error) {
		console.error("Set Location Error:", error);
		res.status(500).json({
			error: "Failed to set user's location",
			details: error.message,
		});
	}
};

export const getNearByUsers = async (req, res) => {
	try {
		const maxDistance = parseInt(req.query.maxDistance) || 16093.4; // Default to 10 miles
		const lat = parseFloat(req.query.lat);
		const lng = parseFloat(req.query.lng);

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

		const userDocs = users
			.filter((loc) => loc.userId !== null)
			.map((loc) => loc.userId);

		res.status(200).json(userDocs);
	} catch (error) {
		console.error("Get Nearby Users Error:", error);
		res.status(500).json({
			error: "Failed to get nearby users",
			details: error.message,
		});
	}
};
