import { Location } from "../models/location.model.js";

// Helper function to convert miles to meters
const milesToMeters = (miles: number) => miles * 1609.34;

export const locationQueries = {
	findNearbyLocations: async (coordinates: number[], miles: number) => {
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
