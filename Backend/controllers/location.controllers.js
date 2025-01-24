import { Location } from "../models/location.model.js";

export const setLocation = async (req, res) => {
	try {
		const { userId } = req.auth;
		const { coordinates } = req.body;

		const location = Location.create({
			userId,
			location: {
				type: "Point",
				coordinates,
			},
		});

		res.status(201).json(location);
	} catch (error) {
		console.error("Set Location Error:", error);
		res.status(500).json({
			error: "Failed to set user's location",
			details: error.message,
		});
	}
};
