import { Location } from "../models/location.model.js";

// Helper function to convert miles to meters
const milesToMeters = (miles) => miles * 1609.34;

export const locationQueries = {
	findNearbyLocations: async (coordinates, miles) => {
		const meters = milesToMeters(miles);
		return await Location.find({
			location: {
				$near: {
					$geometry: {
						type: "Point",
						coordinates: coordinates,
					},
					$maxDistance: meters,
				},
			},
		});
	},
};

// Example: Find locations within 10 miles
const locations = await findLocationsWithinMiles([-73.856077, 40.848447], 10);
